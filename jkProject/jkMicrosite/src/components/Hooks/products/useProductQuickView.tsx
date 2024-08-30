import { IUseProductQuickViewProps } from "@components/Hooks/products";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { IProductDetailsData } from "@type/Pages/Products";
import { getParseUser, getUserDetails } from "@util/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import APPCONFIG from "@config/app.config";
import useAddtoWishList from "../addtoWishList/addtoWishList";
import { IAddtoWishList, IRemoveWishList } from "../addtoWishList";
import { getCurrentWishListItems } from "@util/addGuestCartData";

const useProductQuickView = ({ slug }: IUseProductQuickViewProps) => {
  const [details, setProductDetails] = useState<IProductDetailsData | null>(
    null
  );
  const [productReview, setProductReview] = useState();
  const [defaultSize, setDefaultSize] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemQty, setItemQty] = useState<number>(1);
  const router = useRouter();
  const [templateType] = useState<string>("1");
  const { adddtoWishListProduct, removeWishListProduct } = useAddtoWishList();

  const getProductReview = async (id: string) => {
    if (id) {
      await pagesServices
        .getPage(`${APICONFIG.GET_PRODUCT_REVIEW}${id}`, {})
        .then((result) => {
          setProductReview(result?.data);
        });
    }
  };

  const getProductDetails = async () => {
    let url = `${APICONFIG.QUICK_VIEW}${slug}`;
    await pagesServices.getPage(url, {}).then(
      async (result) => {
        if (result) {
          setProductDetails(result?.data);
          setItemQty(result?.data?.website_product_detail?.min_order_qty
            ? +result?.data?.website_product_detail
              ?.min_order_qty
            : 1)
          setDefaultSize(
            result?.data?.website_product_detail?.default_size_details
              ?.default_size_id ?? result?.data?.product_size_list?.[0]?._id
          );
          setIsLoading(false);
          await getProductReview(result.data?.website_product_detail?._id);
        }
      },
      (error) => {
        if (error?.meta?.status_code === 401) {
          router.push("/sign-in");
        }
        // ErrorHandler(error, showError);
      }
    );
  };

  const updateDefaultSizeData = async (id: string, oldDetails = details) => {
    const data = {
      new_size_id: id || defaultSize,
      product_id: details?.website_product_detail?._id,
    };
    const temp = oldDetails;
    const result = await pagesServices.postPage(APICONFIG.PRICE_BREAKUP, data);
    if (result.meta && result.meta.status_code == 200 && temp) {
      // setisLoading(true);
      if (result.data.total_price) {
        temp.price_breakup.total_price = result.data.total_price;
      }
      if (result.data.diamond_details) {
        temp.website_product_detail.diamond_details =
          result.data.diamond_details;
      }
      if (result.data.color_stone_details) {
        temp.website_product_detail.color_stone_details =
          result.data.color_stone_details;
      }
      if (result.data.metal_quality) {
        temp.price_breakup.metal_quality = result.data.metal_quality;
      }
      if (result.data.net_weight) {
        temp.price_breakup.net_weight = result.data.net_weight;
      }
      if (result.data.total_metal_price) {
        temp.price_breakup.total_metal_price = result.data.total_metal_price;
      }
      if (result.data.total_color_stone_price) {
        temp.price_breakup.total_color_stone_price =
          result.data.total_color_stone_price;
      }
      if (result.data.original_total_price) {
        temp.price_breakup.original_total_price =
          result.data.original_total_price;
      }
      if (result.data.metal_rate) {
        temp.price_breakup.metal_rate = result.data.metal_rate;
      }
      // Discount
      if (result.data?.metal_discount) {
        temp.price_breakup.metal_discount =
          result.data.metal_discount;
      }
      if (result.data?.colorstone_discount) {
        temp.price_breakup.colorstone_discount =
          result.data.colorstone_discount;
      }
      if (result.data?.diamond_discount) {
        temp.price_breakup.diamond_discount =
          result.data.diamond_discount;
      }
    }
    setProductDetails(temp);
    return { ...oldDetails, ...temp };
  };

  // useEffect(() => {
  //   if (defaultSize) {
  //     updateDefaultSizeData();
  //   }
  //   // eslint-disable-next-line
  // }, [defaultSize])

  useEffect(() => {
    getProductDetails();
    // eslint-disable-next-line
  }, [slug]);

  const getWishList = async () => {
    if (!getUserDetails()) {
      const gueatWishlist = getCurrentWishListItems();
      const itemArray = gueatWishlist.map(
        (ele: IAddtoWishList) => ele?.item_id
      );
      const result = itemArray?.some(
        (ele: string) => ele == details?.price_breakup?.product_id
      );
      if (details) {
        setProductDetails({ ...details, is_in_wishlist: result ? 1 : 0 });
      }
    }
  };

  const addtoWishList = async (data: IProductDetailsData) => {
    const getUserDetails: any = getParseUser();
    if (!data?.is_in_wishlist) {
      let wishListData = {
        type: APPCONFIG.DEFAULT_QTY_TYPE,
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: data?.price_breakup?.product_id,
      };
      const response = await adddtoWishListProduct(
        wishListData as IAddtoWishList
      );
      if (response?.meta?.status_code == 201) {
        if (details) {
          setProductDetails({ ...details, is_in_wishlist: 1 });
        }
      } else getWishList();
    } else {
      let arr = [];
      arr.push(data?.price_breakup?.product_id);
      let wishListData = {
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: arr,
      };
      const response = await removeWishListProduct(
        wishListData as IRemoveWishList
      );
      // @ts-ignore
      if (response?.meta?.status_code == 200) {
        if (details) {
          setProductDetails({ ...details, is_in_wishlist: 0 });
        }
      } else getWishList();
    }
  };

  return {
    details,
    productReview,
    defaultSize,
    isLoading,
    templateType,
    itemQty,
    setDefaultSize,
    setItemQty,
    setProductDetails,
    addtoWishList,
    updateDefaultSizeData
  };
};
export default useProductQuickView;
