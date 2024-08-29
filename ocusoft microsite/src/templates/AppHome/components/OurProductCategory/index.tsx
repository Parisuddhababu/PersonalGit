import { ICategoryData } from "@type/Pages/home";
import IOurProductCategory1 from "@templates/AppHome/components/OurProductCategory/our-product-category-1";
export interface IOurProductCategory1Props {
  data: ICategoryData[];
  dynamic_title:{
    our_product_category_title:string
  }
}

export default IOurProductCategory1;
