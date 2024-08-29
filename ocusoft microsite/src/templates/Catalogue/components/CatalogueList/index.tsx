import CatalogueList from "@templates/Catalogue/components/CatalogueList/catalogue-list-1";
import { IRootColor } from "@type/Common/Base";
import { ICatalogueList1 } from "@type/Pages/catalogue";
export interface ICatalogueListProps {
  theme: string;
  default_style: IRootColor;
  data: {
    type: number;
    category_type_count: number;
    categories: ICatalogueList1[];
  }

}

export default CatalogueList;
