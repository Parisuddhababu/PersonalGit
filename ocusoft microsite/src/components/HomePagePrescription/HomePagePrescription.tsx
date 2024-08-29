
import ProductBox from "@templates/ProductList/components/ProductListSection/product-box";
import useSliderHook from "@components/Hooks/sliderHook";
import { IHomePagePrescription } from ".";

export const HomePagePrescription = (props: {
  data: IHomePagePrescription[],
}) => {
  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
  } = useSliderHook(props.data);


  return (
    <section className="products-section">
      <div className="container">
        <h2 className="products-title">Prescribed Products</h2>
        <div className="products-wrapper">
          {
            hideLeftButton &&
            <div className="left-arrow arrow"
              onClick={() => SliderButton("LEFT", arrayIndex - 1)}
            >
              <i className="osicon-cheveron-down"></i>
            </div>
          }

          {slicedData[arrayIndex]?.map((i: IHomePagePrescription) => {
            return (
              <ProductBox
                item={{
                  product_id: i?.website_product_detail?._id,
                  slug: i?.website_product_detail?.product?.url_key,
                  base_image: i?.website_product_detail?.product?.base_image,
                  title: i?.website_product_detail?.product?.name,
                  selling_price: Number(i?.website_product_detail?.selling_price)?.toFixed(2),
                  is_prescribed_for:i?.is_prescribed_for
                }}
                key={+i?.website_product_detail?._id}
              />
            );
          })}
          {
            hideRightButton &&
            <div className="right-arrow arrow"
              onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
            >
              <i className="osicon-cheveron-down"></i>
            </div>
          }
        </div>
        <br />
      </div>
    </section>
  );
};

export default HomePagePrescription;
