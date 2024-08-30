import '../styles/main.scss'
import { FramerNextPages } from '@graphcommerce/framer-next-pages'
import { GraphQLProvider } from '@graphcommerce/graphql'
import { GlobalHead } from '@graphcommerce/magento-store'
import {
  CssAndFramerMotionProvider,
  DarkLightModeThemeProvider,
  PageLoadIndicator,
} from '@graphcommerce/next-ui'
import { CssBaseline } from '@mui/material'
import { AppProps } from 'next/app'
import { UIContextProvider } from '../components/common/contexts/UIContext'
import { lightTheme } from '../components/theme'
import { I18nProvider } from '../lib/i18n/I18nProvider'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function ThemedApp(props: AppProps) {
  const { router } = props
  const { locale = 'en' } = router

  return (
    <UIContextProvider>
      <PayPalScriptProvider options={{ clientId: "test" }}>
        <CssAndFramerMotionProvider>
          <I18nProvider key={locale} locale={locale}>
            <GraphQLProvider {...props}>
              <DarkLightModeThemeProvider light={lightTheme} dark={lightTheme}>
                <GlobalHead />
                <CssBaseline />
                <PageLoadIndicator />
                <FramerNextPages {...props} />
              </DarkLightModeThemeProvider>
            </GraphQLProvider>
          </I18nProvider>
        </CssAndFramerMotionProvider>
      </PayPalScriptProvider>
    </UIContextProvider>
  )
}
