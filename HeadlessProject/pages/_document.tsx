import { withLingui } from '@graphcommerce/lingui-next/document/withLingui'
import type { LinguiDocumentProps } from '@graphcommerce/lingui-next/document/withLingui'
import type { EmotionCacheProps } from '@graphcommerce/next-ui'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import InlineStyle from "@components/common/utils/InlineStyle";

class Document extends NextDocument<EmotionCacheProps & LinguiDocumentProps> {
  render() {
    return (
      <Html>
        <Head>
            <meta name="application-name" content="Brainvire Luma" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
            />
            <meta
                name="apple-mobile-web-app-title"
                content="Brainvire Luma"
            />
            <meta name="format-detection" content="telephone=yes" />
            <meta name="mobile-web-app-capable" content="yes" />
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          <link rel="preload" href="https://fonts.googleapis.com" as="font" />
          <link rel="preload" href="https://fonts.gstatic.com" as="font" />
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="preload" as="style" />
            {/*<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />*/}

            <InlineStyle src="/assets/css/slick-default.css" />
            <InlineStyle src="/assets/css/slick-theme-new.css" />

          {this.props.emotionStyleTags}
          {this.props.linguiScriptTag}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default withLingui(Document, (locale) => import(`../locales/${locale}.po`))
