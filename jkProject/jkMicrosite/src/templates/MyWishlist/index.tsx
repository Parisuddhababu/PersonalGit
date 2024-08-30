import { SlugInfoProps } from "@components/Meta";
import MyWishlist from "@templates/MyWishlist/my-wishlist";

export default MyWishlist;

export interface IMywishlistProps {
  domainName?: string;
  slugInfo?: SlugInfoProps;
}

export interface IWishListGuest {
  item_id :string
  type : string
}