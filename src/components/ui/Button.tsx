"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-all rounded-sm relative overflow-hidden group cursor-pointer";
  
  const variants = {
    primary: "bg-black border border-black",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-200 text-gray-900 hover:border-black",
  };

  return (
    <motion.button
      whileHover={variant === "primary" ? "hover" : undefined}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className={cn(
        "relative z-10 flex items-center gap-2",
        variant === "primary" ? "mix-blend-difference text-white" : ""
      )}>
        {children}
      </span>
      {variant === "primary" && (
        <motion.span 
          variants={{
            hover: { y: "0%", borderRadius: "0%" }
          }}
          initial={{ y: "110%", borderRadius: "100% 100% 0 0" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -inset-1 bg-white z-0" 
        />
      )}
    </motion.button>
  );
}
