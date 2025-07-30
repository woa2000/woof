// src/app/(dashboard)/layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <main className="flex-1 p-6">
      {children}
    </main>
  );
};

export default DashboardLayout;
