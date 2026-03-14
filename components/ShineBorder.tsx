import React from 'react';
import { motion } from 'framer-motion';

interface ShineBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
}

const ShineBorder: React.FC<ShineBorderProps> = ({ children, className = "", borderRadius = "full" }) => {
  return (
    <div className={`relative p-[1px] group overflow-hidden ${borderRadius === 'full' ? 'rounded-full' : 'rounded-xl'} ${className}`}>
      {/* Animated Shine Gradient */}
      <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Inner Content Wrapper */}
      <div className={`relative h-full w-full bg-inherit ${borderRadius === 'full' ? 'rounded-full' : 'rounded-xl'}`}>
        {children}
      </div>
    </div>
  );
};

export default ShineBorder;
