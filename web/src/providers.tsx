import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient();

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};
