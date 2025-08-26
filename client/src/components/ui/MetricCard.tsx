// src/components/ui/MetricCard.tsx
import Card from './Card';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  metric: string | number;
  description?: string;
  chart?: ReactNode; // Placeholder for a chart component
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  metric,
  description,
  chart,
}) => {
  return (
    <Card>
      <h2 className="text-lg font-display font-semibold text-dark-brown mb-2">{title}</h2>
      <p className="text-3xl font-display font-semibold text-woof-orange mb-2">{metric}</p>
      {description && <p className="text-sm text-dark-gray font-sans mb-4">{description}</p>}
      {chart && <div>{chart}</div>}
    </Card>
  );
};

export default MetricCard;
