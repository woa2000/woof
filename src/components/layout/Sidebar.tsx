// Sidebar limpo com altura máxima 100vh e conteúdo rolável.
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Target, FileText, Settings, LogOut, User, BookOpen } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/features/useAuth';

const items = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Anamnese Digital', href: '/anamnese-digital', icon: FileText },
  { name: 'Manual da Marca', href: '/manual-marca', icon: BookOpen },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Campanhas', href: '/campanhas', icon: Target },
  { name: 'Landing Pages', href: '/landing-pages', icon: FileText },
  { name: 'Configurações', href: '/configuracoes', icon: Settings }
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) router.push('/login');
  };

  const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <aside
      className="w-64 h-screen max-h-screen bg-woof-dark-gray text-woof-white p-6 flex flex-col overflow-hidden"
      style={{ backgroundColor: '#5a6872', width: '256px' }}
    >
      {children}
    </aside>
  );

  if (!hydrated) {
    return (
      <Shell>
        <div className="mb-8 flex items-center justify-center">
          <div className="h-12 w-40 rounded bg-white/10 animate-pulse" />
        </div>
        <nav className="flex-grow space-y-3 overflow-y-auto pr-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-white/10 animate-pulse" />
          ))}
        </nav>
        <div className="pt-6 border-t border-white/20 space-y-4">
          <div className="h-10 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-10 w-full rounded bg-white/10 animate-pulse" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-8 flex items-center justify-center">
        <Logo sizeClass="h-12" />
      </div>
      <nav className="flex-grow overflow-y-auto pr-1">
        <ul>
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.name} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-woof-blue focus:ring-offset-woof-dark-gray ${
                    active
                      ? 'bg-woof-blue/90 text-woof-dark-gray font-medium shadow'
                      : 'hover:bg-woof-blue/20'
                  }`}
                  style={active ? { backgroundColor: '#a4c2dc', color: '#5a6872' } : undefined}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto pt-6 space-y-4 border-t border-white/20">
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
            style={{ backgroundColor: '#a4c2dc' }}
          >
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name || 'Avatar'}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User size={20} style={{ color: '#5a6872' }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || user?.email || 'Usuário'}</p>
            <p className="text-xs truncate text-white/70">{user?.email || 'carregando...'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
            className="w-full font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: '#a4c2dc', color: '#5a6872' }}
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </Shell>
  );
};

export default Sidebar;

