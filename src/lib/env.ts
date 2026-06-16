import { z } from 'zod';

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// We wrap it in a try-catch to provide a better error message if env vars are missing
export const clientEnv = (() => {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  } catch (err: any) {
    console.error("❌ Invalid client environment variables:", err.flatten().fieldErrors);
    throw new Error("Invalid client environment variables");
  }
})();

export const serverEnv = (() => {
  if (typeof window !== 'undefined') return {} as z.infer<typeof serverEnvSchema>;
  try {
    return serverEnvSchema.parse({
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
  } catch (err: any) {
    console.error("❌ Invalid server environment variables:", err.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }
})();
