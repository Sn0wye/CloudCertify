import { Cloud } from 'lucide-react';

export function Footer() {
  return (
    <footer className='w-full border-t py-6 md:py-0'>
      <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
        <div className='flex items-center gap-2 text-lg font-semibold'>
          <Cloud className='h-5 w-5 text-sky-500' />
          <p>CloudCertify</p>
        </div>
        <p className='text-center text-sm text-muted-foreground md:text-left'>
          &copy; {new Date().getFullYear()} CloudCertify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
