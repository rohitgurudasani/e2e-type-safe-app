import '../styles/globals.css'
import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import theme from '../styles/theme';
import createEmotionCache from '../util/createEmotionCache';
import ProtectRoute from '../src/components/protectRoute'
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (

    <CacheProvider value={emotionCache}>
      <Head>
        <title>Home</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <ProtectRoute>
          <Component {...pageProps} />
        </ProtectRoute>
      </ThemeProvider>
    </CacheProvider>
  );
}