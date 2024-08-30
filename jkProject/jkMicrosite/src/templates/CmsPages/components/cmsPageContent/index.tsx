import CMSPageContent from "@templates/CmsPages/components/cmsPageContent/cmsPageContent";
import { ICMSPageList } from "@type/Pages/CMSPage";

export interface ICMSPageContentProps {
    list: ICMSPageList;
}

export default CMSPageContent;