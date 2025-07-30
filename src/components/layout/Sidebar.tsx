// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Target, FileText, Settings, LogOut, User, BookOpen } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/features/useAuth';
import Button from '@/components/ui/Button';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Anamnese Digital', href: '/anamnese-digital', icon: FileText },
  { name: 'Manual da Marca', href: '/manual-marca', icon: BookOpen },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Campanhas', href: '/campanhas', icon: Target },
  { name: 'Landing Pages', href: '/landing-pages', icon: FileText },  
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Garante que só renderize após a hidratação
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug
  console.log('🎯 Sidebar sendo renderizado!');

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/login');
    }
  };

  // Durante a hidratação, mostra um placeholder simples
  if (!isClient) {
    return (
      <aside 
        className="w-64 bg-dark-brown text-white p-6 flex flex-col" 
        style={{ 
          backgroundColor: '#4A2E00', 
          minHeight: '100vh',
          width: '256px'
        }}
      >
        <div className="mb-8">
          <div className="text-white font-display font-semibold text-2xl uppercase">
            Woof®
          </div>
        </div>
        <nav className="flex-grow">
          <div className="animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-4 h-10 bg-white bg-opacity-10 rounded"></div>
            ))}
          </div>
        </nav>
      </aside>
    );
  }

  return (
    <aside 
      className="w-64 bg-dark-brown text-white p-6 flex flex-col" 
      style={{ 
        backgroundColor: '#4A2E00', 
        minHeight: '100vh',
        width: '256px'
      }}
    >
      <div className="mb-8">
        <div className="text-white font-display font-semibold text-2xl uppercase">
          Woof®
        </div>
      </div>
      <nav className="flex-grow">
        <ul>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name} className="mb-4">
                <Link
                  href={item.href}
                  className={`flex items-center py-2 px-4 rounded transition-colors duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                      : 'hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white hover:shadow-md text-white text-opacity-80 hover:text-opacity-100'
                    }
                  `}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* User Info at the bottom */}
      <div className="mt-auto pt-6 border-t border-white border-opacity-20 space-y-4">
        {/* User Profile */}
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
            style={{ backgroundColor: '#FF6B00' }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name || 'User Avatar'} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User size={20} className="text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || user?.email || 'Usuário'}</p>
            <p className="text-xs text-white text-opacity-70 truncate">{user?.email || 'carregando...'}</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg  px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-lg hover:text-white"
          onClick={handleLogout}
          style={{
            fontWeight: '500'
          }}
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
