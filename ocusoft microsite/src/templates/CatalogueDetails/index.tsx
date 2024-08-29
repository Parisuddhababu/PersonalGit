import { IBaseTemplateProps } from "@templates/index";
import { ICatalogDetails } from "@type/Pages/CatalogDetails";
import CatalogDetails from "@templates/CatalogueDetails/CatalogueDetails";

export interface ICatalogueDetailsProps
  extends IBaseTemplateProps,
    ICatalogDetails {}

export default CatalogDetails;
