import { IBaseTemplateProps } from "@templates/index";
import Collection from "@templates/Collection/collection";
import { ICollection } from "@type/Pages/collection";

export interface ICollectionProps extends IBaseTemplateProps, ICollection { }

export default Collection;
