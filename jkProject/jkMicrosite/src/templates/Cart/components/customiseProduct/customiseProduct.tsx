import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { uuid } from "@util/uuid";
import { ICustomiseProductProps, IProductSizeList } from ".";

const CustomiseProduct = ({
  // isModal,
  onClose,
  product,
  allAvailableCombinations,
  CustomizeProductData,
  productCombinations,
}: ICustomiseProductProps) => {
  const [metalType, setMetalType] = useState<string>("");
  const [metalPurity, setMetalPurity] = useState<string | undefined>("");
  const [metalColor, setMetalColor] = useState<string | undefined>("");
  const [daimond, setDiamond] = useState<string>("");
  const [colorStone, setColorStone] = useState<string>("");
  const [initialLoading, setIitialLoading] = useState<boolean>(false);
  const [priceTypeList, setPriceTypeList] = useState<string[]>([]);
  const [Hallmark, setHallmark] = useState<string | null>(null);
  const [stamping, setStampnig] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [productSizeList, setProductSizeList] = useState<
    null | IProductSizeList[]
  >(null);

  useEffect(() => {
    if (productCombinations?.metal_customisation) {
      const priceTypeList = Object.keys(
        productCombinations.metal_customisation
      );
      setPriceTypeList(priceTypeList);
    }

    const selectedMetal = product?.default_metal;

    if (product?.default_metal_type) {
      const metalData = productCombinations?.metal_customisation?.[
        product?.default_metal_type
      ]?.find(
        (data) =>
          data.metal_purity_id === selectedMetal?.metal_purity_id &&
          data.metal_type_id === selectedMetal?.metal_type_id
      );
      metalData && setMetalColor(metalData.metal_type_id);
      setMetalType(product?.default_metal_type);
    }

    if (selectedMetal?.metal_purity_id) {
      setMetalPurity(selectedMetal?.metal_purity_id);
    }

    const firstDiamond = product?.diamond_details?.[0];
    if (firstDiamond) {
      setDiamond(firstDiamond.diamond_quality_id);
    }

    const firstColorStone = product?.color_stone_details?.[0];
    if (firstColorStone) {
      setColorStone(firstColorStone?.color_stone_id!);
    }

    if (
      product?.hall_mark_charge != null &&
      product?.hall_mark_charge != undefined
    ) {
      setHallmark(product?.hall_mark_charge.toString());
    }

    if (product?.stamping_charge) {
      setStampnig(product.stamping_charge);
    }

    if (product?.size_id) {
      setSelectedSize(product.size_id);
    }

    if (product?.product_size_list) {
      setProductSizeList(product?.product_size_list);
    }

    // }

    if (!initialLoading) {
      setIitialLoading(true);
    }
  }, [initialLoading, product, productCombinations]);

  useEffect(() => {
    if (metalPurity || !initialLoading) return;
    if (metalType === product?.default_metal_type) {
      setMetalPurity(product?.default_metal?.metal_purity_id!);
    } else {
      const selectedData =
        productCombinations?.metal_customisation?.[metalType];
      setMetalPurity(selectedData?.[0]?.metal_purity_id);
    }
    // eslint-disable-next-line
  }, [metalType]);

  useEffect(() => {
    if (!metalPurity || metalColor || !initialLoading) return;

    if (metalPurity === product?.default_metal?.metal_purity_id) {
      setMetalColor(product?.default_metal?.metal_type_id);
    } else {
      const selectedData =
        productCombinations?.metal_customisation?.[metalType];
      setMetalColor(selectedData?.[0]?.metal_type_id);
    }
    // eslint-disable-next-line
  }, [metalPurity]);

  const toggleModal = () => {
    onClose();
  };

  const onSubmit = async (toggle = true) => {
    const obj = {
      cart_item: product?._id,
      item_id: product?.item_id,
      qty: product?.qty,
      net_weight: product?.total_rate_card_Details?.net_weight,
      product_id: product?.product_id,
      ...(Hallmark !== null && { hall_mark_charge: parseInt(Hallmark) }),
      ...(daimond && { diamond_quality_id: daimond }),
      ...(metalType && { metal_type: metalType }),
      ...(metalColor && { metal_type_id: metalColor }),
      ...(metalPurity && { metal_purity_id: metalPurity }),
      ...(colorStone && { color_stone_id: colorStone }),
      ...(stamping && { stamping_charge: stamping }),
      ...(selectedSize !== product?.size_id && { size_id: selectedSize }),
    };

    if (Object.keys(obj).length > 1) {
      CustomizeProductData([obj]);
    }

    if (toggle) {
      toggleModal();
    }
  };

  const getMetalPurity = () => {
    // @ts-ignore
    const uniqueArray = productCombinations?.metal_customisation?.[
      metalType
    ]?.filter((item, index) => {
      // @ts-ignore
      const currentIndex = productCombinations?.metal_customisation?.[
        metalType
      ]?.findIndex((obj) => obj.metal_purity_id === item.metal_purity_id);
      return currentIndex === index;
    });

    return uniqueArray?.map((ele) => (
      <div
        className="item-radio"
        key={uuid()}
        onClick={() => {
          if (ele?.metal_purity_id != metalPurity) {
            setIitialLoading(true);
            setMetalPurity(ele?.metal_purity_id);
            setMetalColor("");
          }
        }}
      >
        <input
          type="radio"
          value={ele?.metal_purity_id}
          name="metal-purity"
          defaultChecked={metalPurity === ele?.metal_purity_id ? true : false}
        />
        <label htmlFor="metal-purity">
          <span className="item-name">{ele?.metal_purity_name}</span>
        </label>
      </div>
    ));
  };

  const getMetalColor = () => {
    // @ts-ignore
    const uniqueArray = productCombinations?.metal_customisation?.[
      metalType
    ]?.filter((item) => item.metal_purity_id == metalPurity);
    return uniqueArray?.map((ele) => (
      <div
        className="item-radio"
        key={uuid()}
        onClick={() => {
          setIitialLoading(true);
          setMetalColor(ele?.metal_type_id);
        }}
      >
        <input
          type="radio"
          value={ele?.metal_type_id}
          name="metal-color"
          defaultChecked={metalColor === ele?.metal_type_id ? true : false}
        />
        <label htmlFor="metal-color">
          <span className="item-name">{ele?.metal_type_name}</span>
        </label>
      </div>
    ));
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailRatingReview)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.prodDetailCustomisePopup)}
        />
      </Head>
      <div className="page-wrapper customise-product-modal">
        <div className="modal-content">
          <form>
            <div className="row">
              {productSizeList &&
                productSizeList?.length > 0 &&
                selectedSize ? (
                <div className="d-col">
                  <label>Size</label>
                  <select
                    className="custom-select"
                    value={selectedSize}
                    onChange={(event) => setSelectedSize(event?.target?.value)}
                  >
                    {productSizeList?.map((sizeList: any) => (
                      <option value={sizeList?._id} key={sizeList?._id}>
                        {sizeList?.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <></>
              )}
              {priceTypeList?.length > 0 && metalType && (
                <div className="d-col">
                  <h6>
                    Metal Type <span className="asterisk"> *</span>
                  </h6>
                  <div className="item">
                    {priceTypeList.map((ele) => (
                      <div
                        className="item-radio"
                        key={uuid()}
                        onClick={() => {
                          if (ele != metalType) {
                            setIitialLoading(true);
                            setMetalPurity("");
                            setMetalColor("");
                            setMetalType(ele);
                          }
                        }}
                      >
                        <input
                          type="radio"
                          id={ele}
                          name="metal-type"
                          value={ele}
                          defaultChecked={metalType === ele ? true : false}
                        />
                        <label htmlFor="metal-type">
                          <span className="item-name">{ele}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {productCombinations?.metal_customisation && (
                <div className="d-col">
                  <h6>
                    Metal Purity <span className="asterisk"> *</span>
                  </h6>
                  <div className="item">
                    {metalType ? getMetalPurity() : <></>}
                  </div>
                </div>
              )}

              {productCombinations?.metal_customisation && (
                <div className="d-col">
                  <h6>
                    Metal Color <span className="asterisk"> *</span>
                  </h6>
                  <div className="item">
                    {metalPurity ? getMetalColor() : <></>}
                  </div>
                </div>
              )}

              {allAvailableCombinations?.customizable_diamonds && daimond ? (
                <div className="d-col">
                  <h6>
                    Diamond <span className="asterisk"> *</span>
                  </h6>
                  <div className="item">
                    {allAvailableCombinations?.customizable_diamonds?.map(
                      (ele) => (
                        <div
                          className="item-radio"
                          key={uuid()}
                          onClick={() => setDiamond(ele?.diamond_quality_id)}
                        >
                          <input
                            type="radio"
                            id={ele?.diamond_quality_id}
                            name="diamond"
                            value={ele?.diamond_quality_id}
                            defaultChecked={
                              daimond === ele?.diamond_quality_id ? true : false
                            }
                          />
                          <label htmlFor="diamond">
                            <span className="item-name">
                              {ele?.diamond_quality_name}
                            </span>
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {allAvailableCombinations?.customizable_color_stones &&
                colorStone ? (
                <div className="d-col">
                  <h6>
                    Color Stone <span className="asterisk"> *</span>
                  </h6>
                  <div className="item">
                    {allAvailableCombinations?.customizable_color_stones.map(
                      (ele) => (
                        <div
                          className="item-radio"
                          key={uuid()}
                          onClick={() => setColorStone(ele?.color_stone_id)}
                        >
                          <input
                            type="radio"
                            id={ele?.color_stone_id}
                            name="color-stone"
                            value={ele?.color_stone_id}
                            defaultChecked={
                              colorStone === ele?.color_stone_id ? true : false
                            }
                          />
                          <label htmlFor="color-stone">
                            <span className="item-name">
                              {ele?.color_stone_name}
                            </span>
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="d-col d-space-between">
                <div className="d-col-2">
                  <button
                    onClick={() => onSubmit()}
                    type="submit"
                    className=" btn btn-primary"
                  >
                    Save
                  </button>
                </div>

                <div className="d-col-2">
                  <button
                    onClick={toggleModal}
                    type="button"
                    className=" btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomiseProduct;
