'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Garante que só renderize após a hidratação
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rotas que não devem ter o menu/sidebar
  const routesWithoutMenu = ['/login', '/cadastro'];
  const shouldShowMenu = !routesWithoutMenu.includes(pathname);

  // Debug: vamos ver se está funcionando
  console.log('🔍 ConditionalLayout - pathname:', pathname);
  console.log('🔍 ConditionalLayout - shouldShowMenu:', shouldShowMenu);
  console.log('🔍 ConditionalLayout - isClient:', isClient);

  // Durante a hidratação, renderiza um layout neutro para evitar mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  if (!shouldShowMenu) {
    // Para páginas de login e cadastro, renderiza apenas o conteúdo
    return <>{children}</>;
  }

  // Para todas as outras páginas, renderiza com o sidebar
  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-light-gray">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full">
        <main className="flex-1 h-full overflow-y-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ConditionalLayout;
