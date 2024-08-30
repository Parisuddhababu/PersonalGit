import React, { useEffect, useState } from "react";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Modal from "@components/Modal";
import { ICouponView1Props, ICouponData, ICouponForm } from "@templates/Cart/components/Coupon";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { ICoupon } from "@components/Hooks/addtoCart";
import SafeHtml from "@lib/SafeHTML";
import { useForm, Controller } from "react-hook-form";
import { Message } from "@constant/errorMessage";
import FormValidationError from "@components/FormValidationError";
import useCurrencySymbol from '@components/Hooks/currencySymbol/useCurrencySymbol';

const ICoupon1 = ({ onClose, updateCoupon, isModal, cart_id, coupon_code }: ICouponView1Props) => {

  const { getCoupon, applyCoupon } = useAddtoCart()
  const [couponData, setCouponData] = useState<ICouponData[]>()
  const currencySymbol = useCurrencySymbol();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ICouponForm>({
    defaultValues: {
      coupon_code: ""
    },
  });

  useEffect(() => {
    getCouponData() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCouponData = async () => {
    const response = await getCoupon()
    if (response?.meta?.status_code == 200) {
      setCouponData(response?.data?.original?.data)
    }
  }

  const applyCouponList = async (code: string) => {
    const obj = {
      coupon_code: code,
      cart_id: cart_id,
    };
    const response = await applyCoupon(obj as ICoupon)
    if (response?.meta?.status_code == 200) {
      // showSuccess(response?.meta?.message);
      toggleModal()
      updateCoupon()
    }
  }

  const toggleModal = () => {
    onClose();
  };


  const submitForm = async (data: ICouponForm) => {
    applyCouponList(data?.coupon_code)
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.cartCoupon)} />
      </Head>
      <Modal className="available-coupen-popup" headerName="Apply Coupon" open={isModal} onClose={toggleModal} dimmer={false}>
        <div className="modal-content">
          <div className="apply-coupon-sec">
            <p className="apply-coupon-text">Apply Coupon Code</p>
            <form noValidate={true} onSubmit={handleSubmit(submitForm)}>
              <>
                <Controller
                  name="coupon_code"
                  control={control}
                  rules={{
                    required: Message.COUPON_CODE_REQUIRED,
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        id={field.name}
                        {...field}
                        autoFocus={true}
                        className="form-control"
                        placeholder="Apply Coupon"
                      />
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="coupon_code" />
              </>
              <button className="btn btn-primary btn-small" type="submit">Apply</button>
            </form>
          </div>
          <div className="coupon-section">
            {couponData?.map((data: ICouponData, dIndex) => (
              <div className="coupon-section-container" key={dIndex}>
                <div className="coupon-offer">
                  <h3 className="offer-text">{data?.discount}{data?.discount_type ? '%' : currencySymbol} OFF</h3>
                </div>
                <div className="coupon-detail">
                  <div className="coupon-detail-top">
                    <h5 className="coupon-id">{data?.code}</h5>
                    {
                      coupon_code == data?.code ?
                        <a href="#">Applied</a>
                        :
                        <a href="#" onClick={() => applyCouponList(data?.code)}>Apply</a>
                    }
                  </div>
                  <p className="coupon-details-para">
                    <SafeHtml html={data?.description} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ICoupon1;
