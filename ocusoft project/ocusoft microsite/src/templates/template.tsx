import React, { Component, Fragment } from "react";

// Util

// Components
import { RenderTemplate, ITemplateProps } from "@templates/index";

// config
import Head from "next/head";

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
    } = this.props;

    // @ts-ignore
    const Wrapper = RenderTemplate[page_template];

    return (
      <Fragment>
        <Head>
          {meta?.Alternate &&
            meta?.Alternate.map((link, linkIndex: number) => {
              return (
                <link
                  key={link.href}
                  rel="alternate"
                  href={link.href}
                  hrefLang={link.hreflang}
                />
              );
            })}
        </Head>
        <Wrapper
          sequence={sequence}
          default_style={default_style}
          theme={theme}
          meta={meta}
          host={host}
          data={data}
        />
      </Fragment>
    );
  }
}

export default Template;
