import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useForm } from "react-hook-form";
import FormValidationError from "@components/FormValidationError";
import { ICancelOrderForm, ICancelPopupProps } from ".";

const CancelOrderPopup = ({ onClose, onCancel }: ICancelPopupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICancelOrderForm>();

  const onSubmit = (data: ICancelOrderForm) => {
    onCancel({ confirmed: true, cancel_reason: data.cancel_reason });
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.modalPopup)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.addressPopup)}
        />
      </Head>
      <section className="modal modal-active new-address-popup">
        <div className="modal-container add-new-address-form-wrap">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="add-new-address-form"
          >
            <div className="modal-header">
              <h2>Cancel Order</h2>
              <i
                className="osicon-close close-btn"
                role="button"
                aria-label="close-btn"
                onClick={onClose}
              ></i>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="cancel_reason" className="control-label">
                  Cancel Reason*
                </label>
                <input
                  {...register("cancel_reason", {
                    required: "Cancel reason is required",
                  })}
                  id="cancel_reason"
                  placeholder="Enter the reason for cancellation"
                  className="form-control"
                />
                <FormValidationError errors={errors} name="cancel_reason" />
              </div>
              <div className="bottom-buttons">
                <button type="submit" className="btn btn-primary">
                  YES
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    onCancel({ confirmed: false, cancel_reason: "" })
                  }
                >
                  NO
                </button>
              </div>
            </div>
            <div className="modal-footer"></div>
          </form>
        </div>
      </section>
    </>
  );
};
export default CancelOrderPopup;
