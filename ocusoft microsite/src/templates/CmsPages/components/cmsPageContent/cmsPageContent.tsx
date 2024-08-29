import React from "react";
import { ICMSPageContentProps } from "@templates/CmsPages/components/cmsPageContent";

const CMSPageContent = (props: ICMSPageContentProps) => {
  return (
    <div className="container">
      <>
        <div
          dangerouslySetInnerHTML={{
            __html: props?.list?.data?.[0]?.description || "",
          }}
        ></div>
      </>
    </div>
  );
};
export default CMSPageContent;
