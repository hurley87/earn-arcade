import Document, { Html, Head, Main, NextScript } from 'next/document'
import { DEFAULT_THEME, getThemeVariables } from '@magiclabs/ui'
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap"
            rel="stylesheet"
          />
          <link
            rel="preconnect"
            href="https://cdn.usefathom.com"
            crossOrigin=""
          />
          <style
            type="text/css"
            dangerouslySetInnerHTML={{
              __html: getThemeVariables(DEFAULT_THEME).toCSS(),
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
