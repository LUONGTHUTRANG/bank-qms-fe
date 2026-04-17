import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  icon?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", icon, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-headline font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-on-primary shadow-lg shadow-primary/20",
      outline: "border border-outline-variant text-outline hover:text-primary hover:bg-surface-container-highest",
      ghost: "text-outline hover:text-primary hover:bg-white/60",
      glass: "bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high"
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-10 py-4 text-sm",
      icon: "w-10 h-10 p-0"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && <span className="material-symbols-outlined text-xl">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";