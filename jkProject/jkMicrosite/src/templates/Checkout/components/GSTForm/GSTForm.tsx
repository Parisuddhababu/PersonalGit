import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormValidationError from "@components/FormValidationError";
import { TRIMMED_STRING } from "@constant/regex";
import { Message } from "@constant/errorMessage";
import { IGSTFormData, IGSTFormProps } from ".";
import Modal from "@components/Modal";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Cookies from "js-cookie";

const GSTForm: React.FC<IGSTFormProps> = ({
  getGstInformation,
  visable,
  onCloseModal,
  setIsGst,
  isEdit, currentBusinessName, currentGstNumber
}) => {

  const defaultData : IGSTFormData= {
    businessName: "",
    gstNumber: ""
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    //@ts-ignore
  } = useForm<IGSTFormData>(defaultData);

  const Validations = {
    businessName: {
      required: Message.BUSINESS_NAME_REQUIRE,
      pattern: {
        value: TRIMMED_STRING,
        message: Message.WHITE_SPACE,
      },
    },
    gstNumber: {
      required: Message.GST_NUMBER_REQUIRED,
      pattern: {
        value: TRIMMED_STRING,
        message: Message.WHITE_SPACE,
      },
    },
  };

  useEffect(()=>{
    if(isEdit){
     setValue("businessName",currentBusinessName!)
     setValue("gstNumber",currentGstNumber!)
   }else{
     reset()
   }
  // eslint-disable-next-line
 },[isEdit,currentBusinessName,currentGstNumber,visable])

  const onSubmit = (data: IGSTFormData) => {
    Cookies.set("businessName", data.businessName);
    Cookies.set("gstNumber", data.gstNumber);
    Cookies.set("isGst","1")
    getGstInformation(data.businessName, data.gstNumber);
    onCloseModal();
    setIsGst(1);
    reset();
  };

  const onClose = () => {
    reset();
    onCloseModal();
    if(!isEdit){
    setIsGst(0);
    }
  };

  return (
    <>
      <Modal
        className="gst-popup"
        open={visable}
        onClose={() => onClose()}
        dimmer={false}
        headerName="Your GST/VAT Information"
      >
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-row form-content">
              <div className="d-col d-col-1">
                <div className="form-group">
                  <label htmlFor="businessName">Business Name*</label>
                  <input
                    {...register("businessName", Validations.businessName)}
                    type="text"
                    name="businessName"
                    className="form-control"
                    id="businessName"
                  />
                  <FormValidationError errors={errors} name="businessName" />
                </div>
              </div>
            </div>
            <div className="d-row form-content">
              <div className="d-col d-col-1">
                <div className="form-group">
                  <label htmlFor="gstNumber">GST/VAT Number*</label>
                  <input
                    {...register("gstNumber", Validations.gstNumber)}
                    type="text"
                    name="gstNumber"
                    className="form-control"
                    id="gstNumber"
                  />
                  <FormValidationError errors={errors} name="gstNumber" />
                </div>
              </div>
            </div>
            <button type="submit" className=" btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </Modal>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.gstFormPopup)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
    </>
  );
};

export default GSTForm;
