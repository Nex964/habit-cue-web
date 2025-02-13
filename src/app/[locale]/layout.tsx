import '@/css/global.css';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';
import Header from '@/components/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactQueryProvider from '@/hooks/ReactQueryProvider';

const queryClient = new QueryClient()

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export default function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!AppConfig.locales.includes(props.params.locale)) notFound();

  // Using internationalization in Client Components
  const messages = useMessages();

  return (
    <html className='bg-zinc-100 dark:bg-zinc-900' lang={props.params.locale}>
      <body>
        <ReactQueryProvider>
          <NextIntlClientProvider
            locale={props.params.locale}
            messages={messages}
          >
            <Header/>
            <div className='mx-12'>
              {props.children}
            </div>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

export const runtime = 'edge';
