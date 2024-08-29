import APPCONFIG from "@config/app.config";

const DefaultMeta = () => {
  return (
    <>
      <meta name="google-site-verification" content={APPCONFIG.GMETAVERIFY} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="application-name" content="Brainvire" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Brainvire" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#008dd2" />
      <meta name="facebook-domain-verification" content="mzdf4e3e7dsgftykm5gh3zrxl7b8vg" />
      <link rel="dns-prefetch" href={APPCONFIG.assetstPath} />
    </>
  );
};

export default DefaultMeta;
