import HomePageRecommededProducts from "./RecommendedProducts";

export interface IHomePageRecommededProducts {
    website_product_detail:{
      product: {
        base_image: string;
        name: string;
        sku: string;
        url_key: string;
        _id: string;
      },
      selling_price: number;
      _id: string;
    },
    product: {
      base_image: string;
      name: string;
      sku: string;
      url_key: string;
      _id: string;
    },
    selling_price: number;
    product_id: string;
    _id: string;
    is_prescribed_for?:string;
  }
  
  export default HomePageRecommededProducts;