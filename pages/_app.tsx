import { ClerkProvider } from '@clerk/nextjs';
import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Add this line!

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}