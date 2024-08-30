import React, { useEffect } from "react";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import { IRemarkView1Props, IRemark } from "@templates/Cart/components/Remark";
import Modal from "@components/Modal";
import { useForm, Controller } from "react-hook-form";
import FormValidationError from "@components/FormValidationError";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { IUpdateCart } from "@components/Hooks/addtoCart";

const IRemark1 = ({
  onClose,
  remark,
  isModal,
  updateData,
  cart_id,
  remarkId,
  remark_index
}: IRemarkView1Props) => {
  const toggleModal = () => {
    onClose();
  };

  const { updateCart } = useAddtoCart();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IRemark>({
    defaultValues: {
      remark: "",
    },
  });

  useEffect(() => {
    setValue("remark", remark); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remark]);

  const submitForm = async (data: IRemark) => {
    const obj = {
      remark: data?.remark,
      cart_item: remarkId,
    };
    const response = await updateCart(obj as IUpdateCart, cart_id, remark_index);
    if (response?.meta?.status_code == 200) {
      toggleModal();
      updateData();
    }
  };
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bookAppointmentPopup)}
        />
      </Head>
      <Modal
        className="book-appointment-popup"
        headerName={remark?.length ? "Edit Remark" : "Add Remark"}
        open={isModal}
        onClose={toggleModal}
        dimmer={false}
      >
        <div className="modal-content">
          <form noValidate={true} onSubmit={handleSubmit(submitForm)}>
            <div className="row">
              <div className="col d-col">
                <div className="form-group">
                  <Controller
                    name="remark"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label>
                          Remark
                        </label>
                        <textarea
                          placeholder="Enter Product Remark"
                          rows={4}
                          cols={50}
                          id={field.name}
                          {...field}
                          autoFocus={true}
                          className="form-control"
                        />
                      </>
                    )}
                  />
                  <FormValidationError errors={errors} name="remark" />
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-upload-design"
              type="submit"
            >
              submit
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};
export default IRemark1;
