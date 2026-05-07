import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out';

  const variantStyles = {
    primary: 'bg-[#ec028b] text-white hover:bg-opacity-90 focus:ring-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.2)] hover:shadow-[0_0_25px_rgba(236,2,139,0.4)]',
    secondary: 'bg-gray-700/50 text-gray-200 hover:bg-gray-700 focus:ring-gray-500 border border-gray-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-base',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;