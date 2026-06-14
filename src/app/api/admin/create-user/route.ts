import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { z } from 'zod';

// Zod schema for input validation
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional().or(z.literal('')),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  userType: z.string(),
  status: z.string().optional()
});

// Basic in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;
const ipRequests = new Map<string, { count: number, resetTime: number }>();

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    // In App Router, we can sometimes get IP from headers depending on hosting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const now = Date.now();
    const rateData = ipRequests.get(ip);
    
    if (rateData) {
      if (now > rateData.resetTime) {
        ipRequests.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else if (rateData.count >= MAX_REQUESTS) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      } else {
        rateData.count++;
      }
    } else {
      ipRequests.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Clean up old entries periodically to prevent memory leaks (simple version)
    if (ipRequests.size > 1000) ipRequests.clear();

    // 2. Authentication Check (Ensure caller is logged in)
    const supabaseAuth = await createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.user_metadata?.user_type !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Forbidden: Only administrators can create users.' }, { status: 403 });
    }

    // 3. Schema Validation
    const body = await request.json();
    const validationResult = createUserSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const { email, password, firstName, lastName, phone, userType, status } = validationResult.data;

    // 4. Admin User Creation
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'defaultpass123!',
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
      }
    });

    if (authError) {
      console.error("Auth Admin Error:", authError.message);
      // Generic error to prevent leaking internal database state
      return NextResponse.json({ error: 'Failed to create user account.' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: authData.user 
    });

  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
