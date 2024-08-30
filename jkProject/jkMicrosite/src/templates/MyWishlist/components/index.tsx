import { getTypeWiseComponentName } from "@util/common";

import MyWishlistSection1 from "@templates/MyWishlist/components/Wishlist/wishlist-1";
import MyWishlistSection2 from "@templates/MyWishlist/components/Wishlist/wishlist-2";

import { IProductTagList } from "@components/Meta";
// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
    wishlist_data_1: MyWishlistSection1,
    wishlist_data_2: MyWishlistSection2,

};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */

export const getComponents = (type: string, name: string, props: any,product_tags_detail: IProductTagList[] | undefined) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} product_tags_detail={product_tags_detail}/>;
  }
};
