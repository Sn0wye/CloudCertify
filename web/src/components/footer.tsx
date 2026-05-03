import { Cloud } from 'lucide-react';

export function Footer() {
  return (
    <footer className='w-full border-t-2 border-black py-6 md:py-0 bg-white'>
      <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
        <div className='flex items-center gap-2 text-lg font-black'>
          <div className='h-8 w-8 rounded-[5px] border-2 border-black bg-[#88aaee] flex items-center justify-center shadow-[2px_2px_0px_0px_#000]'>
            <Cloud className='h-4 w-4 text-black' />
          </div>
          <p className='text-black'>CloudCertify</p>
        </div>
        <p className='text-center text-sm text-black/70 font-medium md:text-left'>
          &copy; {new Date().getFullYear()} CloudCertify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
