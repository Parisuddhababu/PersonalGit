import {
  IAddtoCart,
  ICustomiseAddtoProduct,
  IGuestCartData,
  IUpdateCart,
} from "@components/Hooks/addtoCart";
import {
  IAddtoWishList,
  IRemoveWishList,
} from "@components/Hooks/addtoWishList";
import APPCONFIG from "@config/app.config";
import { IWishListGuest } from "@templates/MyWishlist";
import { IWishListPropsData } from "@type/Pages/myWishlist";
import { IsBrowser } from "@util/common";

export const getCurrentGuestCartItems = () => {
  if (IsBrowser) {
    const guestData = localStorage.getItem(APPCONFIG.GUEST_CART_DATA);
    if (guestData && JSON.parse(guestData)) {
      return JSON.parse(guestData);
    }
    return [];
  }
};

export const addGuestCartItems = (
  newData: ICustomiseAddtoProduct[] | IAddtoCart[]
) => {
  const oldData = getCurrentGuestCartItems();
  const storeData = [...oldData, ...newData];
  if (IsBrowser) {
    localStorage.setItem(APPCONFIG.GUEST_CART_DATA, JSON.stringify(storeData));
    return true;
  }
};
export const updateGuestCartItems = async (
  data: IUpdateCart,
  indexGuest: number
) => {
  const { cart_item, qty } = data;
  const cartData = getCurrentGuestCartItems();
  let index = -1;
  if (indexGuest === -1) {
    index = cartData.findIndex((element: IAddtoCart) => {
      return element?.item_id == cart_item;
    });
  } else {
    index = indexGuest;
  }
  if (index != -1 && IsBrowser) {
    cartData[index].qty = qty;
    cartData[index].is_from_product_list = 0;
    localStorage.setItem(APPCONFIG.GUEST_CART_DATA, JSON.stringify(cartData));
    return true;
  }
};

export const getCurrentWishListItems = () => {
  if (IsBrowser) {
    const wishListData = localStorage.getItem(APPCONFIG.GUEST_WISHLIST_DATA);
    if (wishListData && JSON.parse(wishListData)) {
      return JSON.parse(wishListData);
    }
    return [];
  }
};

export const addGuestWishListItems = (
  newData: IAddtoWishList | IRemoveWishList
) => {
  const oldData = getCurrentWishListItems();
  const tempArr = [newData];
  const storeData = [...oldData, ...tempArr];
  const index = oldData.findIndex(
    (ele: IRemoveWishList) => ele.item_id === newData?.item_id
  );
  if (index === -1) {
    localStorage.setItem(
      APPCONFIG.GUEST_WISHLIST_DATA,
      JSON.stringify(storeData)
    );
    return true;
  }
  return false;
};

export const deleteGuestUserWishList = (props: IRemoveWishList) => {
  const wishListData = getCurrentWishListItems();
  const objWithIdIndex = wishListData.findIndex(
    (obj: IRemoveWishList) => obj.item_id === props
  );
  if (objWithIdIndex > -1) {
    wishListData.splice(objWithIdIndex, 1);
    localStorage.setItem(
      APPCONFIG.GUEST_WISHLIST_DATA,
      JSON.stringify(wishListData)
    );
    return true;
  }
};

export const updateGuestWishListData = (newData: IWishListPropsData[]) => {
  const oldData = getCurrentWishListItems();
  const filteredOldData = oldData?.filter((oldItem: IWishListGuest) =>
    newData.some((newItem) => newItem.product_id === oldItem.item_id)
  );
  localStorage.setItem(
    APPCONFIG.GUEST_WISHLIST_DATA,
    JSON.stringify(filteredOldData)
  );
};

export const updateGuestCartData = (newData: IAddtoCart[]) => {
  const oldData = getCurrentGuestCartItems();
  const filteredOldData = oldData?.filter((oldItem: IGuestCartData) =>
    newData.some((newItem: IAddtoCart) => newItem.item_id === oldItem.item_id)
  );
  localStorage.setItem(
    APPCONFIG.GUEST_CART_DATA,
    JSON.stringify(filteredOldData)
  );
};
