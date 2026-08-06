import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, List, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/my-list', label: 'My List', icon: List },
  { to: '/account', label: 'Profile', icon: User },
];

export function MobileNavbar() {
  return (
    <nav
      aria-label="Mobile"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-borderc bg-background/95 backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
