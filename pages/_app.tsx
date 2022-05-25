import type { AppProps } from 'next/app'
import '../styles/index.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider } from 'wagmi';
import * as Fathom from "fathom-client";
import Router, { useRouter } from "next/router";
import { useEffect } from 'react';

Router.events.on("routeChangeComplete", () => {
  Fathom.trackPageview();
});


const { chains, provider } = configureChains(
  [chain.polygon],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    Fathom.load('JYEJRHHV', {
      includedDomains: ['earnarcade.xyz', 'www.earnarcade.xyz'],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);

  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains} theme={midnightTheme()}>
      <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export default MyApp
