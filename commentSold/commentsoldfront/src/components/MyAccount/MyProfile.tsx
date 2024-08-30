import React, { useCallback, useEffect, useState } from "react";
import FormValidationError from "../FormValidationError/FormValidationError";
import { IMyProfile, IMyProfileProps } from "@/types/components";
import { SubmitHandler, useForm } from "react-hook-form";
import useValidation from "@/framework/hooks/validations";
import { GET_PROFILE } from "@/framework/graphql/queries/myProfile";
import { UPDATE_PROFILE } from "@/framework/graphql/mutations/myProfile";
import { useMutation, useQuery } from "@apollo/client";
import { SelectedOption } from "@coreui/react-pro/dist/esm/components/multi-select/types";
import { GET_COUNTRIES } from "@/framework/graphql/queries/country";
import { Country, ICountryData } from "@/types/pages";
import useLoadingAndErrors from "@/framework/hooks/useLoadingAndErrors";
import Select from "react-select";
import { toast } from "react-toastify";

const MyProfile = ({ data }: { data: IMyProfileProps }) => {
  const { data: getCountryList } = useQuery(GET_COUNTRIES, {
    variables: { sortBy: "name", sortOrder: "ASC" },
  });
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [countryData, setCountryData] = useState<ICountryData[]>();
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCodeId: "",
  };
  const { myAccountValidations } = useValidation();
  const {
    register,
    handleSubmit,
    setValue: setValue1,
    formState: { errors },
    getValues,
  } = useForm<IMyProfile>({ defaultValues });
  const [updateProfile, { error: updateProfileError, loading: uLoading }] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE }],
  });
  const loadingStates = [uLoading];
  const errorStates = [updateProfileError];
  useLoadingAndErrors(loadingStates, errorStates);

  const onSubmit: SubmitHandler<IMyProfile> = async (data) => {
    updateProfileFunction(data);
  };

  const onCountryChange = useCallback(
    (selectedOption: SelectedOption) => {
      setValue1("countryCodeId", selectedOption?.value?.toString()!);
      setSelectedCountry(selectedOption?.value?.toString());
    },
    [selectedCountry]
  );

  useEffect(() => {
    if (data) {
      setValue1("firstName", data?.getProfile?.data.first_name);
      setValue1("lastName", data?.getProfile?.data.last_name);
      setValue1("email", data?.getProfile?.data?.email);
      setValue1("phoneNumber", data?.getProfile?.data?.phone_number);
      setValue1("countryCodeId", data?.getProfile?.data?.country_code_id);
      setSelectedCountry(data?.getProfile?.data?.country_code_id);
    }
  }, [data]);

  useEffect(() => {
    if (getCountryList && getCountryList?.fetchCountries) {
      setCountryData(getCountryList?.fetchCountries?.data?.CountryData);
    }
  }, [getCountryList]);

  // update profile
  const updateProfileFunction = async (data: IMyProfile) => {
    updateProfile({
      variables: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        countryCodeId: data.countryCodeId,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.updateProfile?.meta.statusCode === 200 || data.updateProfile?.meta.statusCode === 201) {
          toast.success(data.updateProfile?.meta.message);
        }
      })
      .catch(() => {
        return;
      });
  };

  return (
    <div className="card-wrapper spacing-20">
      <h2 className="h3 spacing-40">My Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col col-3">
            <div className="form-group spacing-40">
              <label htmlFor="firstName">First Name*</label>
              <input {...register("firstName", myAccountValidations.firstName)} type="text" name="firstName" id="firstName" placeholder="Enter First Name" className="form-control" />
              <FormValidationError errors={errors} name="firstName" />
            </div>
          </div>
          <div className="col col-3">
            <div className="form-group spacing-40">
              <label htmlFor="lastName">Last Name*</label>
              <input {...register("lastName", myAccountValidations.lastName)} type="text" name="lastName" id="lastName" placeholder="Enter Last Name" className="form-control" />
              <FormValidationError errors={errors} name="lastName" />
            </div>
          </div>
          <div className="col col-3">
            <div className="form-group spacing-40">
              <label htmlFor="userEmail">Email ID*</label>
              <input
                {...register("email", myAccountValidations.email)}
                type="email"
                name="email"
                id="userEmail"
                value={getValues("email")}
                placeholder="Enter email"
                className="form-control"
                disabled
              />
              <FormValidationError errors={errors} name="email" />
            </div>
          </div>
          <div className="col col-3">
            <div className="form-group spacing-40">
              <label htmlFor="phoneNumber">Mobile Number*</label>
              <div className="phone-wrapper form-control">
                <Select
                  {...register("countryCodeId")}
                  placeholder="Country Code"
                  className="countryCode"
                  id="countryCodeId"
                  name="countryCodeId"
                  aria-label="country Code"
                  value={selectedCountry && { label: `+ ${selectedCountry}` }}
                  onChange={(e) => onCountryChange(e as SelectedOption)}
                  options={countryData?.map((country: Country) => ({
                    value: country?.phone_code,
                    label: `${country?.phone_code + "  "} ${"  " + country?.name}`,
                  }))}
                />
                <input {...register("phoneNumber", myAccountValidations.phoneNumber)} type="text" name="phoneNumber" id="phoneNumber" placeholder="Enter Mobile Number" className="userMobile" />
              </div>
              <FormValidationError errors={errors} name="phoneNumber" />
            </div>
          </div>
        </div>
        <div>
          <button className="btn btn-primary">Update</button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
