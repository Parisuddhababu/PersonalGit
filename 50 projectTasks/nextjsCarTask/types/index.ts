import { MouseEventHandler } from "react";

/*for custom button*/
export interface CustomButtonProps {
  title: string;
  btnType?: "button" | "submit";
  containerStyles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}
/*for products*/

export interface ProductsData {
  limit: number;
  products: {
    category: string;
    price: number;
    rating: number;
    id: number;
    images: string[];
    title: string;
    discountPercentage: number;
    brand: string;
    stock: number;
  }[];
  skip: number;
  total: number;
}
/*for clicked data*/

export interface ClickedData {
  category: string;
  price: number;
  rating: number;
  id: number;
  images: string[];
  title: string;
  discountPercentage: number;
  brand: string;
  stock: number;
}
