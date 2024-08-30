import { getDymanicBgTagColorAndImg } from "@util/common";
import React from "react";
import { IProductBadgeProps } from "@templates/ProductDetails/components/WebsiteProductDetail/index";

const ProductBadge1 = ({
  details,
  product_tags_detail,
}: IProductBadgeProps) => {
  const getProductTagBGColorAndImage = (tagTitle: string) => {
    const bgTagColorAndImg = getDymanicBgTagColorAndImg(
      tagTitle,
      product_tags_detail
    );
    return bgTagColorAndImg;
  };

  return (
    <div className="badge-wrapper">
      {details?.price_breakup?.is_discounted ? (
        <div className="badge discount-badge">
          {details?.price_breakup?.discount_per}% OFF
        </div>
      ) : (
        <></>
      )}
      {details?.website_product_detail?.is_available_for_order !== 1 ? (
        <div className="badge out-of-stock-badge">Out Of Stock</div>
      ) : (
        <></>
      )}
      {details?.website_product_detail?.product_tag_name?.length > 0 && (
        <div
          className={"badge badge-featured"}
          style={
            getProductTagBGColorAndImage(
              details?.website_product_detail?.product_tag_name
            ).style
          }
        >
          {getProductTagBGColorAndImage(
            details?.website_product_detail?.product_tag_name
          ).imgPath && (
            <div className="product-tag-img">
              <img
                src={
                  getProductTagBGColorAndImage(
                    details?.website_product_detail?.product_tag_name
                  ).imgPath
                }
                alt="productTag Img"
              />
            </div>
          )}

          {details?.website_product_detail?.product_tag_name}
        </div>
      )}
    </div>
  );
};

export default ProductBadge1;
