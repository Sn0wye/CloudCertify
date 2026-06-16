import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient();

  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster
        position='bottom-center'
        toastOptions={{
          classNames: {
            toast:
              'border-2 border-black shadow-[4px_4px_0px_0px_#000] font-bold rounded-[5px]',
            error: 'bg-destructive text-white',
            warning: 'bg-[#ffb020] text-black',
          },
        }}
      />
    </QueryClientProvider>
  );
};
