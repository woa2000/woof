// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PanelTopOpen, Megaphone, Target, Users, FileText, Settings } from 'lucide-react';
import Logo from '@/components/ui/Logo'; // Assuming Logo component exists

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Landing Pages', href: '/landing-pages', icon: PanelTopOpen },
  { name: 'Conteúdo Orgânico', href: '/conteudo-organico', icon: Megaphone },
  { name: 'Anúncios', href: '/anuncios', icon: Target },
  { name: 'Leads (CRM)', href: '/leads', icon: Users },
  { name: 'Anamnese e Relatórios', href: '/anamnese-relatorios', icon: FileText },
  { name: 'Configurações', href: '/settings', icon: Settings }, // Added settings as it's a common dashboard item
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  // Placeholder for Firebase Auth user data
  const user = { displayName: 'Nome do Usuário', photoURL: '' }; // Replace with actual Firebase Auth user

  return (
    <aside className="w-64 bg-dark-brown text-white p-6 flex flex-col">
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="flex-grow">
        <ul>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name} className="mb-4">
                <Link
                  href={item.href}
                  className={`flex items-center py-2 px-4 rounded transition-colors
                    ${isActive ? 'bg-woof-orange' : 'hover:bg-white/10'}
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
      <div className="mt-auto flex items-center pt-6 border-t border-white/20">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
           {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User Avatar'} className="w-full h-full object-cover" />
           ) : (
            <div className="w-full h-full bg-woof-orange flex items-center justify-center text-white font-bold">
               {user.displayName ? user.displayName[0] : 'U'}
            </div>
           )}
        </div>
        <div>
          <p className="text-sm font-semibold">{user.displayName}</p>
          {/* Add user status or role here if needed */}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
