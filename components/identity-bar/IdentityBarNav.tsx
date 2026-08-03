'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Builders', href: '/builders' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'About', href: '/about' },
] as const;

export function IdentityBarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden desktop:flex items-center gap-8">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} aria-current={isActive ? 'page' : undefined} className="group relative text-sm font-medium text-text-primary/[0.92] transition-colors duration-150 hover:text-text-primary">
            {item.label}
            <span className={`pointer-events-none absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 bg-accent transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}
