/* eslint-disable @next/next/google-font-display */
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* This will use Font optimization: https://nextjs.org/docs/basic-features/font-optimization */}
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=fallback"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@500;900&display=fallback"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
