import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/theme';
import { Providers } from './providers';

export const metadata = {
  title: 'Hyperliquid stats',
  description:
    'Stats dashboard for Hyperliquid, a decentralized perpetual futures exchange on its own L1. Metrics include volume, users, open interest, funding rate, vault pnl, trader pnl, liquidations, inflows, outflows, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width' />
        <link rel='apple-touch-icon' sizes='180x180' href='/img/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/img/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/img/favicon-16x16.png' />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
