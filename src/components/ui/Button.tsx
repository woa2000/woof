import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon as LucideIcon } from 'lucide-react';

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
  const baseStyles = 'px-4 py-2 rounded flex items-center justify-center';
  const variantStyles = {
    primary: 'bg-woof-orange text-white hover:bg-woof-orange/90',
    secondary: 'bg-light-gray text-dark-brown hover:bg-light-gray/80',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className || ''} font-sans`}
      {...props}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
