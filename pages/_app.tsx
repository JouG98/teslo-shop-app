import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import '../styles/globals.css'

import { SWRConfig } from 'swr';
import { CssBaseline } from '@mui/material'
import { AuthProvider, CartProvider, UIProvider } from '../context';


function MyApp({ Component, pageProps }: AppProps) {

    
  return(

    <SessionProvider>
      <PayPalScriptProvider options={{'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT || ''}}>
        <SWRConfig 
          value={{
            // refreshInterval: 3000, // tiempo de refresh de la peticion
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider>
            <UIProvider>
              <CartProvider>
                {/* <ThemeProvider theme={ currentTheme }> */}
                  <CssBaseline />
                    <Component  {...pageProps} />
                {/* </ThemeProvider> */}
              </CartProvider>
            </UIProvider>
          </AuthProvider>

        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
    )
}

export default MyApp
