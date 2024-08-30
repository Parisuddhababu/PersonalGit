import { getParseUser, getUserDetails } from "@util/common";
import { ISimilarViewProps } from "@templates/ProductDetails/components/SimilarProductView";
import useSimilarProductList from "@components/Hooks/similarProductList/useSimilarProductList";
import { useEffect, useState } from "react";
import { getComponents } from "@templates/ProductList/components";
import { ISimilarProductsProps } from "@components/Hooks/similarProductList";
import APPCONFIG from "@config/app.config";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import {
  IAddtoWishList,
  IRemoveWishList,
} from "@components/Hooks/addtoWishList";
import { getCurrentWishListItems } from "@util/addGuestCartData";
import ProductBox from "@templates/ProductList/components/ProductListSection/product-box";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import { IMAGE_PATH } from "@constant/imagepath";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SimilarProductView2 = (props: ISimilarViewProps) => {
  const { similarList } = useSimilarProductList({
    product_id: props?.data?.website_product_detail?.product_id,
    sectionName: props?.sectionName,
  });
  const currencySymbol = useCurrencySymbol();

  const [isQuickView, setIsQuickView] = useState<boolean>(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string>();
  const onCloseQuickView = () => {
    setIsQuickView(false);
  };

  const SimilarProductsSliderSetting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1366,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const { adddtoWishListProduct, removeWishListProduct } = useAddtoWishList();
  const [wishListData, setWishListData] = useState([]);

  useEffect(() => {
    getWishList();
  }, []);

  const getWishList = async () => {
    if (!getUserDetails()) {
      const gueatWishlist = getCurrentWishListItems();
      const itemArray = gueatWishlist.map(
        (ele: IAddtoWishList) => ele?.item_id
      );
      setWishListData(itemArray);
    }
  };

  const getCondition = (data: ISimilarProductsProps) => {
    if (getUserDetails()) return !data?.is_in_wishlist;
    else
      return !wishListData?.some((ele) =>
        ele == data?.product_id ? data?.product_id : data?.product?._id
      );
  };

  const addtoWishList = async (data: ISimilarProductsProps) => {
    const Index = similarList?.findIndex((ele, index) => {
      if (ele?._id == data?._id) {
        return index ? index : ((index + 1) as number);
      }
    });
    const getUserDetails: any = getParseUser();
    if (getCondition(data)) {
      let wishListData = {
        type: APPCONFIG.DEFAULT_QTY_TYPE,
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: data?.product_id ? data?.product_id : data?.product?._id,
      };
      const response = await adddtoWishListProduct(
        wishListData as IAddtoWishList
      );
      if (response?.meta?.status_code == 201 && similarList) {
        similarList[Index as number].is_in_wishlist = 1;
      } else getWishList();
    } else {
      let arr = [];
      arr.push(data?.product_id ? data?.product_id : data?.product?._id);
      let wishListData = {
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: arr,
      };
      const response = await removeWishListProduct(
        wishListData as IRemoveWishList
      );
      // @ts-ignore
      if (response?.meta?.status_code == 200 && similarList) {
        similarList[Index as number].is_in_wishlist = 0;
      } else getWishList();
    }
  };

  return (
    <>
      {similarList?.length && (
        <section className="similar-products-section">
          <div className="container">
            <div className="heading">
              <h2>{props?.title ? props?.title : "Similar Products"}</h2>
            </div>
            <div className="product-slider">
              <Slider {...SimilarProductsSliderSetting}>
                {similarList?.map(
                  (product: ISimilarProductsProps, pInd: number) => (
                    <>
                      <ProductBox
                        product={{
                          slug: product.product.slug,
                          image: product?.images?.[0]?.path
                            ? product?.images?.[0]?.path
                            : IMAGE_PATH.noImagePng,
                          title: product.product.title,
                          is_available_for_order:
                            product?.is_available_for_order,
                          product_id:
                            product?.product_id ?? product?.product._id,
                          _id: product.product._id,
                          website_product_id: product._id,
                          is_discounted: product.price_breakup?.is_discounted,
                          discount_per: product.discount_percentage,
                          product_tag_name: product.product_tag_name,
                          is_fix_price: product.is_fix_price,
                          diamond_total_carat: product.diamond_total_carat,
                          net_weight: product.net_weight,
                          total_price:
                            props.sectionName === "recently_view"
                              ? product?.price_breakup?.total_price
                              : product.total_price,
                          currency_symbol: currencySymbol,
                          original_total_price:
                            product.price_breakup?.original_total_price,
                          sku: product.product?.sku,
                          is_in_wishlist: product.is_in_wishlist,
                        }}
                        setIsQuickView={() => setIsQuickView(true)}
                        setQuickViewSlug={() =>
                          setQuickViewSlug(product.product.slug)
                        }
                        product_tags_detail={props?.product_tags_detail}
                        wishListData={wishListData}
                        key={pInd}
                        addtoWishList={() => addtoWishList(product)}
                        type={1}
                        IsSlider={true}
                      />
                    </>
                  )
                )}
              </Slider>
            </div>
          </div>
        </section>
      )}
      {/* Product Quick View - Start */}
      {isQuickView ? (
        getComponents("2", "quick_view", {
          isModal: isQuickView,
          slug: quickViewSlug,
          onClose: onCloseQuickView,
        })
      ) : (
        <></>
      )}
      {/* Product Quick View - End */}
    </>
  );
};

export default SimilarProductView2;
