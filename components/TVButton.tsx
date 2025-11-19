import React, { useRef, useEffect } from 'react';

interface TVButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  autoFocus?: boolean;
  icon?: React.ReactNode;
}

export const TVButton: React.FC<TVButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  autoFocus,
  icon,
  ...props 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform focus:scale-105 focus:ring-4 focus:z-10 outline-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400 shadow-lg shadow-blue-900/20",
    secondary: "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
    ghost: "bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-gray-500 focus:bg-gray-800"
  };

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="w-6 h-6">{icon}</span>}
      {children}
    </button>
  );
};