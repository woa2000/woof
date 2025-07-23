// src/app/page.tsx
import { redirect } from 'next/navigation';

const HomePage: React.FC = () => {
  // Redirect to the dashboard
  redirect('/dashboard');
};

export default HomePage;
