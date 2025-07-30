import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon: Icon,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'px-4 py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-200 min-h-[44px]';
  const variantStyles = {
    primary: 'text-white hover:opacity-90 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300',
  };
  
  const primaryStyle = {
    backgroundColor: '#FF6B00', // woof-orange
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className || ''}`}
      style={variant === 'primary' ? primaryStyle : undefined}
      {...props}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
