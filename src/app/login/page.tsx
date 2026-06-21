"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Eye, EyeOff, Command } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        w = canvas.width = parent.clientWidth * window.devicePixelRatio;
        h = canvas.height = parent.clientHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => { mouse = { x: -1000, y: -1000 }; };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle Configuration
    const particleCount = 120;
    const particles: any[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvas.parentElement?.clientWidth || 1000),
        y: Math.random() * (canvas.parentElement?.clientHeight || 1000),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5
      });
    }

    let animationFrame: number;
    const render = () => {
      const logicalWidth = canvas.parentElement?.clientWidth || 1000;
      const logicalHeight = canvas.parentElement?.clientHeight || 1000;
      
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around edges
        if (p.x < 0) p.x = logicalWidth;
        if (p.x > logicalWidth) p.x = 0;
        if (p.y < 0) p.y = logicalHeight;
        if (p.y > logicalHeight) p.y = 0;

        // Mouse interaction (repel)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;
        
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw constellation lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - (dist / 100) * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-auto" />;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    if (lockoutUntil) {
      const timer = setInterval(() => {
        if (Date.now() > lockoutUntil) {
          setLockoutUntil(null);
          setFailedAttempts(0);
          setError(null);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setFailedAttempts(0);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutUntil(Date.now() + 30000); // 30 seconds lockout
        setError("Too many failed attempts. Please wait 30 seconds.");
      } else {
        setError(`Invalid login credentials. (${5 - newAttempts} attempts remaining)`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

  return (
    <div className="min-h-screen w-full flex bg-black font-sans text-white overflow-hidden">
      {/* Left side - Apple-like animated section */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-black items-center justify-center border-r border-white/10">
        
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
        
        {/* Interactive Particle Canvas */}
        <ParticleCanvas />
        
        {/* Content Overlay */}
        <div className="relative z-10 p-16 flex flex-col justify-center items-start w-full max-w-2xl pointer-events-none">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 mb-8 shadow-2xl">
            <Command className="w-8 h-8 text-white/80" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-6">
            Neelkanth CRM.
          </h1>
          <p className="text-xl text-white/50 font-medium max-w-md leading-relaxed tracking-wide">
            Manage your operations with precision, speed, and elegance.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 md:p-16 relative bg-black">
        {/* Subtle ambient light on the right */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-white/5 blur-[120px]" />
        </div>

        <div className="w-full max-w-[380px] space-y-10 relative z-10">
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Log in to your account
            </h2>
            <p className="text-white/40 text-sm font-medium">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm border border-red-500/30 flex items-start animate-in fade-in duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <div className="font-semibold tracking-wide">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 mt-12">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 text-white placeholder:text-white/30 px-4 font-medium"
                placeholder="name@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 text-white placeholder:text-white/30 px-4 pr-12 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || isLockedOut}
              className={cn(
                "relative w-full flex justify-center items-center mt-8 py-3.5 px-4 rounded-xl text-sm font-semibold overflow-hidden border border-white transition-all duration-300",
                isLoading || isLockedOut ? "opacity-70 cursor-not-allowed bg-white text-black" : "bg-white cursor-pointer"
              )}
            >
              <span className="relative z-10 flex items-center mix-blend-difference text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Logging In...
                  </>
                ) : (
                  "Log In"
                )}
              </span>
              {!isLoading && (
                <motion.span 
                  variants={{
                    hover: { y: "0%", borderRadius: "0%" }
                  }}
                  initial={{ y: "110%", borderRadius: "100% 100% 0 0" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -inset-1 bg-black z-0 pointer-events-none" 
                />
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
