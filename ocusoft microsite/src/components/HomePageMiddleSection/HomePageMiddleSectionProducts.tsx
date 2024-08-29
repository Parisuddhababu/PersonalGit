
import ProductBox from "@templates/ProductList/components/ProductListSection/product-box";
import useSliderHook from "@components/Hooks/sliderHook";
import { IHomePagePrescription } from "@components/HomePagePrescription";
import { IMiddleSection } from "@type/Pages/home";

export const HomePageMiddleSectionProducts = (props: {
  data: IMiddleSection,
}) => {
  const {
    slicedData: sliceData1,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
  } = useSliderHook(props?.data?.products);


  return (
    <section className="products-section" key={props.data?._id}>
      <div className="container">
        <h2 className="products-title">{props.data?.title}</h2>
        <div className="products-wrapper">
          {
            hideLeftButton &&
            <div className="left-arrow arrow"
              onClick={() => SliderButton("LEFT", arrayIndex - 1)}
            >
              <i className="osicon-cheveron-down"></i>
            </div>
          }

          {sliceData1[arrayIndex]?.map((i: IHomePagePrescription) => {
            return (
              <ProductBox
                item={{
                  product_id: i?._id,
                  slug: i?.product?.url_key,
                  base_image: i?.product?.base_image,
                  title: i?.product?.name,
                  selling_price: Number(i?.selling_price)?.toFixed(2)
                }}
                key={i?._id}
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

export default HomePageMiddleSectionProducts;
