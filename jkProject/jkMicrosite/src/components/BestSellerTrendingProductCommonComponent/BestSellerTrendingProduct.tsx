import {
  IAddtoWishList,
  IRemoveWishList,
} from "@components/Hooks/addtoWishList";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IListMainProductProps } from "@type/Pages/productList";
import { getCurrentWishListItems } from "@util/addGuestCartData";

import { getComponents } from "@templates/ProductList/components";

import {
  getParseUser,
  getTypeBasedCSSPath,
  getUserDetails,
} from "@util/common";
import Head from "next/head";
import { useState, useEffect } from "react";
import { IBestSellerTrendingProductProps } from ".";
import { IMAGE_PATH } from "@constant/imagepath";
import Loader from "@components/customLoader/Loader";
import ProductBox from "@templates/ProductList/components/ProductListSection/product-box";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const BestSellerTrendingProductComponent = (
  props: IBestSellerTrendingProductProps
) => {
  const [iteamList,setIteamList] = useState<any>([])
  const [wishListData, setWishListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currencySymbol = useCurrencySymbol();
  const { adddtoWishListProduct, removeWishListProduct, getWishListData } =
    useAddtoWishList();
  const [isQuickView, setIsQuickView] = useState<boolean>(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string>();

  const SimilarProductsSliderSetting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    centerPadding: "60px",
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

  useEffect(() => {
    getWishList();
    // eslint-disable-next-line
  }, []);

  useEffect(()=>{
    setIteamList(props?.data)
  },[props?.data])


  const getWishList = async () => {
    if (getUserDetails()) {
      const resposne = await getWishListData();
      setWishListData(resposne?.data[0]?.item_id);
    } else {
      const gueatWishlist = getCurrentWishListItems();
      const itemArray = gueatWishlist.map(
        (ele: IAddtoWishList) => ele?.item_id
      );
      setWishListData(itemArray);
    }
  };

  const onCloseQuickView = () => {
    setIsQuickView(false);
  };

  const addtoWishList = async (data: IListMainProductProps) => {
    const getUserDetails: any = getParseUser();
    setIsLoading(true);
    // @ts-ignore
    if (!wishListData?.includes(data?.product?._id) || !wishListData.length) {
      let wishListObj = {
        type: APPCONFIG.DEFAULT_QTY_TYPE,
        account_id: getUserDetails?.user_detail?.register_from as string,
        // @ts-ignore
        item_id: data?.product?._id,
      };
      await adddtoWishListProduct(wishListObj as IAddtoWishList);
      getWishList();
      setIsLoading(false);
    } else {
      let arr = [];
      // @ts-ignore
      arr.push(data?.product?._id);
      let wishListObj = {
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: arr,
      };
      await removeWishListProduct(wishListObj as IRemoveWishList);
      getWishList();
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {iteamList?.length && 
      <section className="similar-products-section">
        <div className="container">
          <div className="heading">
            <h2>{props?.title ? props?.title : "Trending Products"}</h2>
          </div>
          <div className="product-slider">
           <Slider {...SimilarProductsSliderSetting}>
            {iteamList?.map((product: any, index: number) => {
              return (
                <ProductBox
                  product={{
                    slug: product.product.slug,
                    image: product?.images?.[0]?.path
                      ? product?.images?.[0]?.path
                      : IMAGE_PATH.noImagePng,
                    title: product.product.title,
                    is_available_for_order: 1,
                    product_id: product?.product_id ?? product?.product._id,
                    _id: product.product._id,
                    website_product_id: product._id,
                    is_discounted: product.price_breakup?.is_discounted,
                    discount_per: product.discount_percentage,
                    product_tag_name: product.product_tag_name,
                    is_fix_price: product.is_fix_price,
                    diamond_total_carat: product.diamond_total_carat,
                    net_weight: product.net_weight,
                    total_price: product.total_price,
                    currency_symbol: currencySymbol,
                    original_total_price: product.price_breakup?.original_total_price,
                    sku: product.product?.sku,
                    is_in_wishlist: product.is_in_wishlist
                  }}
                  setIsQuickView={() => setIsQuickView(true)}
                  setQuickViewSlug={() => setQuickViewSlug(product.product.slug)}
                  product_tags_detail={props?.product_tags_detail}
                  wishListData={wishListData}
                  key={index}
                  addtoWishList={() => addtoWishList(product)}
                  type={1}
                  IsSlider={true}
                />
              );
            })}
            </Slider>
          </div>
        </div>
      </section>
      }


      {isQuickView ? (
        getComponents("2", "quick_view", {
          isModal: isQuickView,
          slug: quickViewSlug,
          onClose: onCloseQuickView,
        })
      ) : (
        <></>
      )}

      <Head>
        {/* <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.CardCssTemplate2)}
        /> */}
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            "2",
            CSS_NAME_PATH.similarProductsTemplate2
          )}
        />
      </Head>
    </>
  );
};

export default BestSellerTrendingProductComponent;
