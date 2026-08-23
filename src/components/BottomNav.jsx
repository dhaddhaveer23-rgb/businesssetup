import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/my-businesses', label: 'My Biz', icon: Briefcase },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="bg-card/90 backdrop-blur-lg border-t border-border px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] select-none">
      <div className="flex items-center justify-around">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/home' && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors select-none',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}