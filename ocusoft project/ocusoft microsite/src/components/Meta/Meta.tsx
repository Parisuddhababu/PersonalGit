import React from "react";
import { MetaProps } from "@components/Meta/index";
import Head from "next/head";

const Meta = ({ meta }: MetaProps) => {
  return (
    <Head>
      <title>{meta?.slug_info?.slug_detail?.meta_title ? meta?.slug_info?.slug_detail?.meta_title : 'Ocusoft'}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="title"
        content={meta?.slug_info?.slug_detail?.meta_title ? meta?.slug_info?.slug_detail?.meta_title : 'Ocusoft'}
      />
      <meta property="og:title" content={meta?.slug_info?.slug_detail?.meta_title ? meta?.slug_info?.slug_detail?.meta_title : 'Ocusoft'} />
      <meta property="og:type" content="website" />

      <meta
        name="keywords"
        content={meta?.slug_info?.slug_detail?.meta_keyword ? meta?.slug_info?.slug_detail?.meta_keyword : 'Ocusoft'}
      />
      <meta
        name="robots"
        content={
          meta?.slug_info?.slug_detail?.meta_robot_option ? meta?.slug_info?.slug_detail?.meta_robot_option : 'Ocusoft'
        }
      />
      <meta
        name="description"
        content={
          meta?.slug_info?.slug_detail?.meta_description ?? 'Ocusoft'
        }
      />
      <meta property="og:description"
        content={meta?.slug_info?.slug_detail?.meta_description ?? 'Ocusoft'} />

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
