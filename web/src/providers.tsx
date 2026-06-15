import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient();

  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster
        position='bottom-center'
        theme='dark'
        toastOptions={{
          classNames: {
            toast:
              'border bg-card text-foreground font-mono text-sm rounded-none',
            error: 'border-destructive text-destructive',
            warning: 'border-primary text-primary',
            success: 'border-success text-success'
          }
        }}
      />
    </QueryClientProvider>
  );
};
