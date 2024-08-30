import APPCONFIG from "@config/app.config";

const GTM_ID = APPCONFIG.gtmID;

export const GTagScript = () => {
  if (!GTM_ID) {
    return <script id="GTM_ID" />;
  }

  return (
    // eslint-disable-next-line @next/next/next-script-for-ga
    <script
      dangerouslySetInnerHTML={{
        __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
      async={true}
    />
  );
};

export const GTagNoScript = () => {
  if (!GTM_ID) {
    return <script id="GTM_ID-frame" />;
  }
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
};
