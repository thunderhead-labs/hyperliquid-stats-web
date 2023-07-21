'use client';
import { useEffect } from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import TagManager from 'react-gtm-module';
import { Global } from '@emotion/react';
import theme from '../styles/theme';
import { GlobalStyles } from '@/styles/global';
import { DataContextProvider } from '../contexts/data';

const tagManagerArgs = { gtmId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CONFIG as string };

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <DataContextProvider>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <Global styles={GlobalStyles} />
          {children}
        </ChakraProvider>
      </CacheProvider>
    </DataContextProvider>
  );
}
