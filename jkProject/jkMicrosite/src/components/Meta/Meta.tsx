import React from "react";
import { MetaProps } from ".";
import Head from "next/head";

const Meta = ({ meta, domainName, micrositeName }: MetaProps) => {
  return (
    <Head>
      <title>{meta?.slug_info?.slug_detail?.meta_title ? meta?.slug_info?.slug_detail?.meta_title : domainName}</title>
      <meta name="application-name" content={micrositeName} />
      <meta name="apple-mobile-web-app-title" content={micrositeName} />
      <meta
        name="title"
        content={meta?.slug_info?.slug_detail?.meta_title ? meta?.slug_info?.slug_detail?.meta_title : domainName}
      />
      <meta property="og:title" content={meta?.slug_info?.slug_detail?.meta_title ? meta?.slug_info?.slug_detail?.meta_title : domainName} />
      <meta property="og:type" content="website" />

      <meta
        name="keywords"
        content={meta?.slug_info?.slug_detail?.meta_keyword ? meta?.slug_info?.slug_detail?.meta_keyword : domainName}
      />
      <meta
        name="robots"
        content={
          meta?.slug_info?.slug_detail?.meta_robot_option ? meta?.slug_info?.slug_detail?.meta_robot_option : domainName
        }
      />
      <meta
        name="description"
        content={
          meta?.slug_info?.slug_detail?.meta_description ?? domainName
        }
      />
      <meta property="og:description"
        content={meta?.slug_info?.slug_detail?.meta_description ?? domainName} />

      <meta
        name="og:image"
        content={
          meta?.slug_info?.slug_detail?.image ??
          meta?.favicon_image?.path
        }
      />
      <meta property="og:image"
        content={
          meta?.slug_info?.slug_detail?.image ??
          meta?.favicon_image?.path
        } />
      <link rel="icon" type="image/png" sizes="32x32" href={meta?.favicon_image?.path || ""}></link>
      <link rel="icon" type="image/png" sizes="16x16" href={meta?.favicon_image?.path || ""}></link>
      <script dangerouslySetInnerHTML={{ __html: meta?.slug_info?.slug_detail?.script }} />
    </Head>
  );
};

export default Meta;
