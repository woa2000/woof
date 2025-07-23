// src/components/ui/Card.tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;
