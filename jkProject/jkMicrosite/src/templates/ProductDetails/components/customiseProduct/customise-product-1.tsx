import {
  ICustomiseFormFields,
  ICustomiseProductProps,
} from "@templates/ProductDetails/components/customiseProduct/index";
import { CustomizableMetal, IProductDetails } from "@type/Pages/productDetails";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
// import Modal from "@components/Modal";
import React, { useEffect, useState } from "react";
import CustomImage from "@components/CustomImage/CustomImage";
import useCustomiseProductDetails from "@components/Hooks/customiseProductDetails/useCustomiseProductDetails";
import { useForm } from "react-hook-form";
import { uuid } from "@util/uuid";

const CustomiseProductPopup = ({
  // isModal,
  onClose,
  data,
  customProductDetails,
  customProductData,
  customiseData,
}: ICustomiseProductProps) => {
  const [details] = useState<IProductDetails>(data);
  const [CertifyBy, setCertifyBy] = useState<string>("");
  // const [Remark, setRemark] = useState<string>("");
  const { getCustomiseProductData } = useCustomiseProductDetails();
  const [metalType, setMetalType] = useState<string>("");
  const [metalPurity, setMetalPurity] = useState<string>("");
  const [metalColor, setMetalColor] = useState<string>("");
  const [daimond, setDiamond] = useState<string>("");
  const [colorStone, setColorStone] = useState<string>("");
  const [initialLoading, setIitialLoading] = useState<boolean>(false);

  useEffect(() => {
    if (customiseData && Object.entries(customiseData).length) {
      const {
        certify_by_id,
        color_stone_id,
        // remark,
        metal_type,
        metal_purity_id,
        metal_type_id,
        diamond_quality_id,
      } = customiseData;
      if (metal_type) setMetalType(metal_type)
      if (metal_purity_id) setMetalPurity(metal_purity_id)
      if (metal_type_id) setMetalColor(metal_type_id)
      if (color_stone_id) setColorStone(color_stone_id);
      if (diamond_quality_id) setDiamond(diamond_quality_id);
      if (certify_by_id) setCertifyBy(certify_by_id);
      // if (remark != null && remark != undefined) setRemark(remark);
    } else {
      const pdp = data?.website_product_detail
      if (pdp?.default_metal_type)
        setMetalType(details?.website_product_detail?.default_metal_type);
      if (pdp?.diamond_details?.[0]?.diamond_quality_id)
        setDiamond(pdp?.diamond_details?.[0]?.diamond_quality_id);
      if (pdp?.color_stone_details?.[0]?.color_stone_id)
        setColorStone(pdp?.color_stone_details?.[0]?.color_stone_id);

    }
    if (!initialLoading) {
      setIitialLoading(true)
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (metalPurity || !initialLoading)
      return
    if (metalType === details?.website_product_detail?.default_metal_type) {
      setMetalPurity(details?.website_product_detail?.default_metal.metal_purity_id);
    }
    else {
      const selectedData: CustomizableMetal = data?.products_customisation?.customizable_metals?.[metalType]
      setMetalPurity(selectedData?.[0]?.metal_purity_id);
    }
    // eslint-disable-next-line
  }, [metalType]);


  useEffect(() => {
    if (!metalPurity || metalColor || !initialLoading)
      return

    if (metalPurity === details?.website_product_detail?.default_metal.metal_purity_id) {
      setMetalColor(details?.website_product_detail?.default_metal.metal_type_id)
    }
    else {
      const selectedData: CustomizableMetal = data?.products_customisation?.customizable_metals?.[metalType]
      setMetalColor(selectedData?.[0]?.metal_type_id);
    }
    // eslint-disable-next-line
  }, [metalPurity]);

  const {
    // control,
    // formState: { errors },
    handleSubmit,
  } = useForm<ICustomiseFormFields | any>({
    defaultValues: {
      diamond: "",
      color_stone: "",
    },
  });

  const toggleModal = () => {
    onClose();
  };

  const onSubmit = async (toggle = true) => {
    const response = await getCustomiseProductData(data, {
      new_size_id: data?.new_size_id,
      diamond_quality_id: daimond,
      metal_type: metalType,
      metal_purity_id: metalPurity,
      metal_type_id: metalColor,
      color_stone_id: colorStone,
      // remark: Remark,
      product_id: data?.website_product_detail?._id,
      certify_by_id: CertifyBy,
    });
    // @ts-ignore
    customProductDetails(response?.newData);
    // @ts-ignore
    customProductData(response?.customiseObj);
    if (toggle) {
      toggleModal();
    }
  };

  useEffect(() => {
    if (!initialLoading || (metalType && !metalColor))
      return
    onSubmit(false);
    // eslint-disable-next-line
  }, [CertifyBy, metalColor, daimond, colorStone]);

  const getMetalPurity = () => {

    // @ts-ignore
    const uniqueArray = data?.products_customisation?.customizable_metals[metalType]?.filter((item, index) => {
      // @ts-ignore
      const currentIndex = data?.products_customisation?.customizable_metals[metalType]?.findIndex(obj => obj.metal_purity_id === item.metal_purity_id);
      return currentIndex === index;
    });

    return (
      uniqueArray?.map(
        (ele) => (
          <div className="item-radio" key={uuid()}
            onClick={() => {
              if (ele?.metal_purity_id != metalPurity) {
                setIitialLoading(true)
                setMetalPurity(ele?.metal_purity_id)
                setMetalColor("")
              }
            }}>
            <input type="radio"
              value={ele?.metal_purity_id}
              name="metal-purity"
              defaultChecked={metalPurity === ele?.metal_purity_id ? true : false}
            />
            <label htmlFor="metal-purity">
              <span className="item-name">{ele?.metal_purity_name}</span>
            </label>
          </div>
        )
      )
    )
  }

  const getMetalColor = () => {
    // @ts-ignore
    const uniqueArray = data?.products_customisation.customizable_metals[metalType]?.filter((item) =>
      item.metal_purity_id == metalPurity
    );
    return (
      uniqueArray?.map(
        (ele) => (
          <div className="item-radio" key={uuid()}
            onClick={() => {
              setIitialLoading(true)
              setMetalColor(ele?.metal_type_id)
            }}>
            <input type="radio"
              value={ele?.metal_type_id}
              name="metal-color"
              defaultChecked={metalColor === ele?.metal_type_id ? true : false}
            />
            <label htmlFor="metal-color">
              <span className="item-name">{ele?.metal_type_name}</span>
            </label>
          </div>
        )
      )
    )
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailRatingReview)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailCustomisePopup)}
        />
      </Head>
      {/* <main> */}
      <div className="page-wrapper customise-product-modal">
        {/* <Modal
            className="customise-product-modal"
            open={isModal}
            onClose={toggleModal}
            dimmer={false}
            headerName="Customize This Product"
            >
          */}
        <div className="modal-content">
          <form noValidate={true} onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {
                data?.products_customisation?.customizable_metals &&
                <div className="d-col" style={{alignItems:'center' }}>
                  <h6>
                    Metal Type <span className="asterisk"> *</span>
                  </h6>
                  {/* <div className="item"> */}
                  {Object.keys(data?.products_customisation?.customizable_metals).map(
                    (ele) => (
                      <div className="item-radio" key={uuid()}
                        onClick={() => {
                          if (ele != metalType) {
                            setIitialLoading(true)
                            setMetalPurity("")
                            setMetalColor("")
                            setMetalType(ele)
                          }
                        }}>
                        <input type="radio" id={ele} name="metal-type"
                          value={ele}
                          defaultChecked={metalType === ele ? true : false} />
                        <label htmlFor="metal-type">
                          <span className="item-name">{ele}</span>
                        </label>
                      </div>
                    )
                  )}
                </div>
                // </div>
              }

              {
                data?.products_customisation?.customizable_metals &&
                <div className="d-col" style={{alignItems:'center' }}>
                  <h6>
                    Metal Purity <span className="asterisk"> *</span>
                  </h6>
                  {/* <div className="item"> */}
                  {metalType ?
                    getMetalPurity() : <></>}
                  {/* </div> */}
                </div>
              }

              {
                data?.products_customisation?.customizable_metals &&
                <div className="d-col" style={{alignItems:'center' }}>
                  <h6>
                    Metal Color <span className="asterisk"> *</span>
                  </h6>
                  {/* <div className="item"> */}
                  {metalPurity ?
                    getMetalColor() : <></>}
                  {/* </div> */}
                </div>
              }

              {data?.products_customisation?.customizable_diamonds?.length > 0 ? (
                <div className="d-col" style={{alignItems:'center' }}>
                  <h6>
                    Diamond <span className="asterisk"> *</span>
                  </h6>
                  {/* <div className="item"> */}
                  {data?.products_customisation?.customizable_diamonds.map(
                    (ele) => (
                      <div className="item-radio" key={uuid()} onClick={() => setDiamond(ele?.diamond_quality_id)}>
                        <input type="radio" id={ele?.diamond_quality_id}
                          name="diamond"
                          value={ele?.diamond_quality_id}
                          defaultChecked={daimond === ele?.diamond_quality_id ? true : false} />
                        <label htmlFor="diamond">
                          <span className="item-name">{ele?.diamond_quality_name}</span>
                        </label>
                      </div>
                    )
                  )}
                  {/* </div> */}
                </div>) : <></>}

              {data?.products_customisation?.customizable_color_stones
                ?.length > 0 ? (
                <div className="d-col" style={{alignItems:'center' }}>
                  <h6>
                    Color Stone <span className="asterisk"> *</span>
                  </h6>
                  {/* <div className="item"> */}
                  {data?.products_customisation?.customizable_color_stones.map(
                    (ele) => (
                      <div className="item-radio" key={uuid()} onClick={() => setColorStone(ele?.color_stone_id)}>
                        <input type="radio"
                          id={ele?.color_stone_id}
                          name="color-stone"
                          value={ele?.color_stone_id}
                          defaultChecked={colorStone === ele?.color_stone_id ? true : false} />
                        <label htmlFor="color-stone">
                          <span className="item-name">{ele?.color_stone_name}</span>
                        </label>
                      </div>
                    )
                  )}
                  {/* </div> */}
                </div>
              ) : <></>}

              <div className="d-col">
                <div className="inner-group">
                  {details?.website_product_detail?.product_certificate
                    ?.length > 0 ? (
                    <div className="certified-section">
                      <label>Certify By</label>
                      <div className="item form-group">
                        {details?.website_product_detail?.product_certificate?.map(
                          (pc, pcIndex) => (
                            <div
                              key={`pc_${pcIndex}`}
                              className="item-radio"
                              onClick={() => setCertifyBy(pc?._id)}
                            >
                              <input
                                type="radio"
                                id={pc?._id}
                                name={"certificate"}
                                value={pc?._id}
                                defaultChecked={CertifyBy === pc?._id ? true : false}
                                className={
                                  CertifyBy === pc?._id ? "selected" : ""
                                }
                              />
                              <CustomImage
                                src={pc?.image?.path}
                                alt={pc?.image?.name}
                                title={pc?.image?.name}
                                height="33px"
                                width="37px"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* <div className="d-col option-remark">
                <label>Remark</label>
                <textarea
                  name="remark"
                  rows={5}
                  value={Remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="form-control"
                  placeholder="Add Remark"
                />
              </div> */}
              <div className="d-col d-space-between">
                <div className="d-col-2">
                  {/* <button
                    // onClick={onSubmit}
                    type="submit"
                    className=" btn btn-primary"
                  >
                    Save
                  </button> */}
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
        {/*
          </Modal> */}
      </div>
      {/* </main> */}
    </>
  );
};

export default CustomiseProductPopup;
