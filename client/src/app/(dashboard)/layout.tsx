// src/app/(dashboard)/layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <section className="min-h-full">
      {children}
    </section>
  );
};

export default DashboardLayout;
