import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withAuthUser } from 'next-firebase-auth'
import initAuth from "../firebase/firebase";

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default withAuthUser<AppProps>()(MyApp)
