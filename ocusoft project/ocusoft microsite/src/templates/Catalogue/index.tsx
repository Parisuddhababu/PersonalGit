import { IBaseTemplateProps } from "@templates/index";
import Catalogue from "@templates/Catalogue/catalogue-list";
import { ICatalogue } from "@type/Pages/catalogue";

export interface ICatalogueList extends IBaseTemplateProps, ICatalogue {}

export default Catalogue;
