// src/app/(dashboard)/layout.tsx
import Sidebar from '@/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-light-gray">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header could go here if needed for all dashboard pages */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
