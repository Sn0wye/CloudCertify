import { Cloud } from 'lucide-react';
import { Link } from 'wouter';
import type { ReactNode } from 'react';

type SiteHeaderProps = {
  children?: ReactNode;
};

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur'>
      <div className='container flex h-16 items-center justify-between gap-4'>
        <Link
          href='/'
          className='flex items-center gap-2.5 font-display text-lg uppercase tracking-tight text-foreground'
        >
          <span className='flex h-9 w-9 items-center justify-center border border-primary bg-primary text-primary-foreground'>
            <Cloud className='h-5 w-5' />
          </span>
          <span>CloudCertify</span>
          <span className='hud-label hidden sm:inline'>/ v2.1</span>
        </Link>
        <div className='flex flex-1 items-center justify-end'>{children}</div>
      </div>
    </header>
  );
}
