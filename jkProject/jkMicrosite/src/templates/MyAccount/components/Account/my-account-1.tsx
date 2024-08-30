import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IAccountPageForm } from "@templates/MyAccount/components/Account/index";
import FormValidationError from "@components/FormValidationError";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, ONLY_NUMBER, PHONENUMBER_REGEX } from "@constant/regex";
import ReactTagInput from "@components/ReactTagInputComponent/ReactTagInput";

const MyAccountSection1 = () => {
  const [defaultValues] = useState({
    name: "",
    company_website: "",
    contact_person: "",
    emails: "",
    mobile: "",
    nature_of_organization: "",
    gst_number: "",
    registration_number: "",
    designation: "",
    selected_designation_name: "",
    business_relationship_period: 0,
    nature_of_org_others: "",
    fax: "",
    bank_name: "",
    account_number: "",
    ifsc: "",
    visiting_card: "",
    country: "",
  });

  const {
    control,
    reset,
    clearErrors,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAccountPageForm>({ defaultValues });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<IAccountPageForm> = (data) => {
    console.log("This is data prop", data)
  };

  const Validations = {
    name: {
      required: Message.COMPANY_NAME_REQUIRED,
    },
    contact_person: {
      required: Message.NAME_REQUIRED,
    },
    company_website: {
      required: Message.COMPANY_WEBSITE_REQUIRED,
    },
    nature_of_organization: {
      required: Message.NATURE_OF_ORGANIZATION_REQUIRED,
    },
    nature_of_org_others: {
      required: Message.NATURE_OF_ORGANIZATION_OTHERS_REQUIRED,
    },
    business_relationship_period: {
      pattern: { value: ONLY_NUMBER, message: Message.ALLOW_ONLY_NUMBER },
    },
    mobile: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
    email: {
      required: Message.EMAIL_REQUIRED,
      pattern: {
        value: EMAIL_REGEX,
        message: Message.EMAIL_PATTERN,
      },
    },
    gst_number: {
      required: Message.GST_NUMBER_REQUIRED,
    },
    bank_name: {
      required: Message.BANKER_NAME_REQUIRED,
    },
    account_number: {
      required: Message.ACCOUNT_NUMBER_REQUIRED,
    },
    ifsc: {
      required: Message.IFSC_REQUIRED,
    },
    registration_number: {
      required: Message.REGISTRATION_NUMBER_REQUIRED,
    },
    selected_designation_name: {
      required: Message.DESIGNATION_NAME_REQUIRED,
    },
  };

  const setValueFunctionInReactHookForm = (name: any, data: any) => {
    setValue(name, data);
    clearErrors(name);
  };

  return (
    <>
      <section className="bank_details">
        <div className="container">
          <div className="firm_details">
            <form>
              <h4 className="sort-info__title">Firm Details</h4>
              <div className="d-row">
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      Company Name <em>*</em>
                    </label>
                    <input
                      {...register("name", Validations.name)}
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Jewellerskart"
                    />
                    <FormValidationError errors={errors} name="name" />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>Contact Person</label>
                    <input
                      {...register(
                        "contact_person",
                        Validations.contact_person
                      )}
                      type="text"
                      className="form-control"
                      name="contact_person"
                      placeholder="Gopinath"
                    />
                    <FormValidationError
                      errors={errors}
                      name="contact_person"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>
                      Mobile Number <em>*</em>
                    </label>
                    <Controller
                      control={control}
                      name="mobile"
                      rules={Validations.mobile}
                      render={({ field }) => (
                        <>
                          <ReactTagInput
                            {...field}
                            className="form-control"
                            setValueFunctionInReactHookForm={
                              setValueFunctionInReactHookForm
                            }
                            errors={errors}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>Email Address</label>
                    <Controller
                      control={control}
                      name="emails"
                      rules={Validations.email}
                      render={({ field }) => (
                        <>
                          <ReactTagInput
                            {...field}
                            className="form-control"
                            setValueFunctionInReactHookForm={
                              setValueFunctionInReactHookForm
                            }
                            errors={errors}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      {...register(
                        "company_website",
                        Validations.company_website
                      )}
                      type="text"
                      className="form-control"
                      name="company_website"
                      placeholder="https://www.jewellerskart.com/"
                    />
                    <FormValidationError
                      errors={errors}
                      name="company_website"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form__control">
                    <label>Visiting Card</label>
                    <div className="file-upload">
                      <input
                        {...register("visiting_card")}
                        ref={fileInputRef}
                        type="file"
                        name="visiting_card"
                        id="uploadFile"
                      />
                      <FormValidationError
                        errors={errors}
                        name="visiting_card"
                      />

                      <i className="jkm-file-upload file-upload-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="sort-info__title">Account Information</h4>
              <div className="d-row">
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      Select Nature of Organization<em>*</em>
                    </label>
                    <select
                      className="form-control custom-select"
                      {...register(
                        "nature_of_organization",
                        Validations.nature_of_organization
                      )}
                    >
                      <option value="">Proprietorship</option>
                      <option>Software Engineer</option>
                      <option>Content Writer</option>
                    </select>
                    <FormValidationError
                      errors={errors}
                      name="nature_of_organization"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>
                      GSTIN Number<em>*</em>
                    </label>
                    <input
                      {...register("gst_number", Validations.gst_number)}
                      type="text"
                      className="form-control"
                      name="gst_number"
                      placeholder="123456789000000"
                    />
                    <FormValidationError errors={errors} name="gst_number" />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>Business Registration No.</label>
                    <input
                      {...register(
                        "registration_number",
                        Validations.registration_number
                      )}
                      type="text"
                      className="form-control"
                      name="registration_number"
                      placeholder="SKY1234567890"
                    />
                    <FormValidationError
                      errors={errors}
                      name="registration_number"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      Select Nature of Organization<em>*</em>
                    </label>
                    <select
                      className="form-control custom-select"
                      {...register(
                        "nature_of_org_others",
                        Validations.nature_of_org_others
                      )}
                    >
                      <option value="">Promoter</option>
                      <option>Software Engineer</option>
                      <option>Content Writer</option>
                    </select>
                    <FormValidationError
                      errors={errors}
                      name="nature_of_org_others"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      Name of Promoter<em>*</em>
                    </label>
                    <input
                      {...register(
                        "selected_designation_name",
                        Validations.selected_designation_name
                      )}
                      type="text"
                      className="form-control"
                      name="selected_designation_name"
                      placeholder="Gopinath"
                    />
                    <FormValidationError
                      errors={errors}
                      name="selected_designation_name"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>Business Relationship Period</label>
                    <select
                      className="form-control custom-select"
                      {...register(
                        "business_relationship_period",
                        Validations.business_relationship_period
                      )}
                    >
                      <option value="">20</option>
                      <option>15</option>
                      <option>10</option>
                    </select>
                    <FormValidationError
                      errors={errors}
                      name="business_relationship_period"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group ">
                    <label>Fax Number</label>
                    <input
                      {...register("fax")}
                      type="text"
                      className="form-control"
                      name="fax"
                      placeholder="1234567890"
                    />
                    <FormValidationError errors={errors} name="fax" />
                  </div>
                </div>
              </div>
              <h4 className="sort-info__title">Bank Details</h4>
              <div className="d-row">
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      Banker Name<em>*</em>
                    </label>
                    <input
                      {...register("bank_name", Validations.bank_name)}
                      type="text"
                      className="form-control"
                      name="bank_name"
                      placeholder="Kotak Bank"
                    />
                    <FormValidationError errors={errors} name="bank_name" />
                  </div>
                </div>
                <div className="d-col d-col-2 invalid">
                  <div className="">
                    Account Number<em>*</em>
                    <input
                      {...register(
                        "account_number",
                        Validations.account_number
                      )}
                      type="text"
                      className="form-control"
                      name="account_number"
                      placeholder="12345678900000"
                    />
                    <FormValidationError
                      errors={errors}
                      name="account_number"
                    />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      IFSC Code<em>*</em>
                    </label>
                    <input
                      {...register("ifsc", Validations.ifsc)}
                      type="text"
                      className="form-control"
                      name="ifsc"
                      placeholder="DENA1234567"
                    />
                    <FormValidationError errors={errors} name="ifsc" />
                  </div>
                </div>
              </div>
              <div className="d-row">
                <div className="d-col d-col-1 mb-0">
                  <button
                    type="button"
                    className="btn btn-secondary btn-small mb-0 mr-40"
                    onClick={(e) => {
                      handleSubmit(onSubmit)(e);
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small reset"
                    onClick={() => {
                      reset((formValues) => ({
                        ...formValues,
                        name: "test",
                      }));
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccountSection1;
