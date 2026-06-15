import { Cloud } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className='w-full border-t border-border bg-background'>
      <div className='container flex flex-col items-start justify-between gap-6 py-8 md:flex-row md:items-center'>
        <div className='flex items-center gap-2.5 font-display text-base uppercase tracking-tight text-foreground'>
          <span className='flex h-7 w-7 items-center justify-center border border-primary bg-primary text-primary-foreground'>
            <Cloud className='h-4 w-4' />
          </span>
          <span>CloudCertify</span>
        </div>

        <nav className='flex flex-wrap gap-x-6 gap-y-2'>
          <Link href='/dashboard' className='hud-label hover:text-primary'>
            Dashboard
          </Link>
          <a href='#certifications' className='hud-label hover:text-primary'>
            Certifications
          </a>
          <a href='#pricing' className='hud-label hover:text-primary'>
            Pricing
          </a>
        </nav>

        <p className='hud-label'>
          &copy; {new Date().getFullYear()} CloudCertify · Unit D-01
        </p>
      </div>
    </footer>
  );
}
