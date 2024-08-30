import React, { Component, Fragment } from "react";

// Util

// Components
import { RenderTemplate, ITemplateProps } from "@templates/index";

// config
import Head from "next/head";
import Meta, { SlugInfoProps } from "@components/Meta";
import { IImageVideo } from "@type/Pages/productDetails";

export class Template extends Component<ITemplateProps> {
  render () {
    const {
      meta,
      data,
      page_template,
      host,
      sequence,
      default_style,
      theme,
      slugInfo,
      domainName,
      micrositeName
    } = this.props;

    // robot and googlebot
    // let NoIndex = APPCONFIG.NoIndex;
    // let NoFollow = APPCONFIG.NoFollow;
    // if (meta?.NoIndex === "1") NoIndex = true;
    // if (meta?.NoFollow === "1") NoFollow = true;

    // @ts-ignore
    const Wrapper = RenderTemplate[page_template];
    let metaObj = {
      slug_info: {
        slug_detail: {
          meta_title: "",
          meta_keyword: "",
          meta_description: "",
          meta_robot_option: "",
          script: "",
          image: null
        }
      },
      favicon_image: slugInfo?.favicon_image,
      product_tags_detail: slugInfo?.product_tags_detail
    };
    if (page_template === "PRODUCT_DETAILS") {
      let imgUrl: string | null = null;
      data?.website_product_detail?.images.map((ele: IImageVideo) => {
        if (imgUrl === null && ele?.path) {
          imgUrl = ele?.path;
        }
      })
      // @ts-ignore
      if ((slugInfo?.slug_info?.slug_detail?.meta_title?.length &&
        slugInfo?.slug_info?.slug_detail?.meta_description?.length
      )) {
        // @ts-ignore
        const { meta_title, meta_description, meta_keyword, meta_robot_option, script } = slugInfo?.slug_info?.slug_detail;
        metaObj.slug_info.slug_detail.meta_title = meta_title;
        metaObj.slug_info.slug_detail.meta_keyword = meta_keyword;
        metaObj.slug_info.slug_detail.meta_description = meta_description;
        metaObj.slug_info.slug_detail.meta_robot_option = meta_robot_option;
        metaObj.slug_info.slug_detail.script = script;
        metaObj.slug_info.slug_detail.image = imgUrl ? imgUrl : null;
      }
      else if ((data?.seo_details?.meta_title?.length && data?.seo_details?.meta_description?.length)) {
        const { meta_title, meta_keyword, meta_description } = data?.seo_details
        metaObj.slug_info.slug_detail.meta_title = meta_title;
        metaObj.slug_info.slug_detail.meta_keyword = meta_keyword;
        metaObj.slug_info.slug_detail.meta_description = meta_description;
        metaObj.slug_info.slug_detail.meta_robot_option = "";
        metaObj.slug_info.slug_detail.script = "";
        metaObj.slug_info.slug_detail.image = imgUrl ? imgUrl : null;
      }
      else {
        let metaDescription = "";
        if (data?.price_breakup?.metal_quality) {
          metaDescription = data?.price_breakup?.metal_quality;
        }
        if (data?.website_product_detail?.diamond_details?.[0]?.diamond_quality_name) {
          const metaDiamond = `Diamond ${data?.website_product_detail?.diamond_details?.[0]?.diamond_quality_name}`
          metaDescription.length ? metaDescription = `${metaDescription} | ${metaDiamond}` : metaDescription = metaDiamond
        }
        if (data?.website_product_detail?.color_stone_details?.[0]?.color_stone_name) {
          const metaColorStone = `Color Stone ${data?.website_product_detail?.color_stone_details?.[0]?.color_stone_name}`
          metaDescription.length ? metaDescription = `${metaDescription} | ${metaColorStone}` : metaDescription = metaColorStone
        }
        metaObj.slug_info.slug_detail.meta_title = `${data?.title} | ${domainName}`;
        metaObj.slug_info.slug_detail.meta_keyword = "";
        metaObj.slug_info.slug_detail.meta_description = metaDescription;
        metaObj.slug_info.slug_detail.meta_robot_option = "";
        metaObj.slug_info.slug_detail.script = "";
        metaObj.slug_info.slug_detail.image = imgUrl ? imgUrl : null;
      }
    }
    else {
      if ((slugInfo?.slug_info?.slug_detail && Object.entries(slugInfo?.slug_info?.slug_detail)?.length)) {
        // @ts-ignore
        metaObj = { ...slugInfo };
      }
    };

    return (
      <Fragment>
        <Head>
          {meta?.Alternate &&
            meta?.Alternate.map((link, linkIndex: number) => {
              return (
                <link
                  key={linkIndex}
                  rel="alternate"
                  href={link.href}
                  hrefLang={link.hreflang}
                />
              );
            })}
        </Head>
        {/* <NextSeo
          title={slugInfo?.slug_info?.slug_detail?.meta_title ? slugInfo?.slug_info?.slug_detail?.meta_title : domainName}
          description={slugInfo?.slug_info?.slug_detail?.meta_description}
          canonical={meta?.canonical_url || canonical}
          openGraph={{
            title: slugInfo?.slug_info?.slug_detail?.meta_title ? slugInfo?.slug_info?.slug_detail?.meta_title : domainName,
            description: slugInfo?.slug_info?.slug_detail?.meta_description ? slugInfo?.slug_info?.slug_detail?.meta_description : domainName,
          }}
          nofollow={NoFollow}
          noindex={NoIndex}
        /> */}
        {/* {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} template={page_template} /> : null} */}
        <Wrapper
          // {...data}
          sequence={sequence}
          default_style={default_style}
          theme={theme}
          meta={meta}
          host={host}
          data={data}
          slugInfo={metaObj}
          domainName={domainName}
        />
        <Meta meta={metaObj as SlugInfoProps} domainName={domainName} micrositeName={micrositeName}/>
      </Fragment>
    );
  }
}

export default Template;
