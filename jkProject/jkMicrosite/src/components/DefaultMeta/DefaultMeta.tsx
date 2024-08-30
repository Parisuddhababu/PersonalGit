import APPCONFIG from "@config/app.config";

const DefaultMeta = () => {
  return (
    <>
      {/* <link rel="icon" href="/assets/favicon.ico" type="image/ico" sizes="16x16" /> */}
      <meta name="google-site-verification" content={APPCONFIG.GMETAVERIFY} />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#008dd2" />
      <meta name="facebook-domain-verification" content="mzdf4e3e7dsgftykm5gh3zrxl7b8vg" />
      {/* <link rel="manifest" href="/manifest.json" /> */}
      <link rel="dns-prefetch" href={APPCONFIG.assetstPath} />

    </>
  );
};

export default DefaultMeta;
