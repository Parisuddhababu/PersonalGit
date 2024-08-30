import CMSPage from "@templates/CmsPages/cmsPage";
import { IBaseTemplateProps } from "@templates/index";
import { ICMSPage } from "@type/Pages/CMSPage";

export interface ICMSPageProps extends IBaseTemplateProps, ICMSPage {}

export default CMSPage;
