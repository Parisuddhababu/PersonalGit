import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { IProductDetails } from "@type/Pages/productDetails";
import { ICustomiseProductHookProps } from "@components/Hooks/customiseProductDetails";
import ErrorHandler from "@components/ErrorHandler";
import { checkNullEmptyString } from "@util/common";
import { useState } from "react";
import { useToast } from "@components/Toastr/Toastr";

const useCustomiseProductDetails = () => {
  const [customDetails, setCustomDetails] = useState<IProductDetails | null>(
    null
  );
  const { showError } = useToast();

  const getCustomiseProductData = async (
    oldData: IProductDetails,
    data: ICustomiseProductHookProps
  ) => {
    const obj: ICustomiseProductHookProps = {
      product_id: oldData?.website_product_detail?._id,
      new_size_id: data?.new_size_id,
      // hall_mark_charge: data?.hall_mark_charge,
      diamond_quality_id: data?.diamond_quality_id,
      metal_purity_id: data?.metal_purity_id,
      metal_type_id: data?.metal_type_id,
      metal_type: data?.metal_type,
      color_stone_id: data?.color_stone_id,
      // stamping_charge: data?.stamping_charge,
      remark: data?.remark,
      certify_by_id: data?.certify_by_id,
    };
    if (checkNullEmptyString(obj?.new_size_id)) delete obj.new_size_id;
    // if (checkNullEmptyString(obj?.hall_mark_charge))
    //   delete obj.hall_mark_charge;
    if (checkNullEmptyString(obj?.diamond_quality_id))
      delete obj.diamond_quality_id;
    if (checkNullEmptyString(obj?.metal_purity_id)) delete obj.metal_purity_id;
    if (checkNullEmptyString(obj?.metal_type_id)) delete obj.metal_type_id;
    if (checkNullEmptyString(obj?.color_stone_id)) delete obj.color_stone_id;
    // if (checkNullEmptyString(obj?.stamping_charge)) delete obj.stamping_charge;
    if (checkNullEmptyString(obj?.remark)) delete obj.remark;
    if (checkNullEmptyString(obj?.certify_by_id)) delete obj.certify_by_id;
    return await pagesServices.postPage(APICONFIG.PRICE_BREAKUP, data).then(
      async (result) => {
        const temp = oldData;
        if (result.meta && result.meta.status_code == 200) {
          // setisLoading(true);
          if (result.data.total_price) {
            temp.price_breakup.total_price = result.data.total_price;
          }
          if (result.data.total_diamond_price) {
            temp.price_breakup.total_diamond_price =
              result.data.total_diamond_price;
          }
          if (result.data.diamond_details) {
            temp.website_product_detail.diamond_details =
              result.data.diamond_details_for_productdetail;
          }
          if (result.data.diamond_details) {
            temp.price_breakup.diamond_details =
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
            temp.price_breakup.total_metal_price =
              result.data.total_metal_price;
          }
          if (result.data.total_color_stone_price) {
            temp.price_breakup.total_color_stone_price =
              result.data.total_color_stone_price;
          }
          if (result.data.original_total_price) {
            temp.price_breakup.original_total_price =
              result.data.original_total_price;
          }
          if (result.data.metal_type) {
            temp.price_breakup.metal_type =
              result.data.metal_type;
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
          // if (result.data.stamping_charge) {
          //   temp.price_breakup.stamping_charge = result.data.stamping_charge;
          //   temp.price_breakup.hallmark_charge =
          //     result?.data?.hallmark_charge || "0";
          // }
          if (result.data.metal_rate) {
            temp.price_breakup.metal_rate = result.data.metal_rate;
          }
          temp.price_breakup.labour_rate = result?.data?.labour_rate;
          temp.price_breakup.labour_charge = result?.data?.labour_charge;
          setCustomDetails({ ...oldData, ...temp });
          return {
            newData: { ...oldData, ...temp },
            customiseObj: obj,
          };
        }
      },
      (error) => {
        ErrorHandler(error, showError);
      }
    );
  };
  const sizeChange = async (props: any) => {
    const result = await pagesServices.postPage(
      APICONFIG.PRICE_BREAKUP,
      props?.data
    );
    const temp = props?.oldData;
    if (result.meta && result.meta.status_code == 200) {
      // setisLoading(true);
      if (result.data.total_price) {
        temp.price_breakup.total_price = result.data.total_price;
      }
      if (result.data.total_diamond_price) {
        temp.price_breakup.total_diamond_price =
          result.data.total_diamond_price;
      }
      if (result.data.diamond_details) {
        temp.website_product_detail.diamond_details =
          result.data.diamond_details_for_productdetail;
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
      if (result.data.labour_charge) {
        temp.price_breakup.labour_charge = result.data.labour_charge;
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
      // if (result.data.stamping_charge) {
      //   temp.price_breakup.stamping_charge = result.data.stamping_charge;
      //   temp.price_breakup.hallmark_charge =
      //     result?.data?.hallmark_charge || "0";
      // }
      if (result.data.metal_rate) {
        temp.price_breakup.metal_rate = result.data.metal_rate;
      }
      if (result.data.net_weight) {
        temp.price_breakup.net_weight = result.data.net_weight;
      }
      temp.price_breakup.labour_rate = result?.data?.labour_rate;
      temp.price_breakup.labour_charge = result?.data?.labour_charge;
    }
    return { ...props?.oldData, ...temp };
  };
  return {
    customDetails,
    getCustomiseProductData,
    sizeChange,
  };
};

export default useCustomiseProductDetails;
