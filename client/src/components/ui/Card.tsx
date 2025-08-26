// src/components/ui/Card.tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
}) => {
  const variants = {
    default: 'bg-white shadow-sm border border-gray-100',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-gray-200',
    gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-md',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';

  return (
    <div 
      className={`
        ${variants[variant]} 
        ${paddingClasses[padding]} 
        ${hoverClasses}
        rounded-xl 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
