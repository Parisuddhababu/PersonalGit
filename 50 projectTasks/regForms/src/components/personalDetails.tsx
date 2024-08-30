import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Data,
  onPerDetails,
  setShowIncome,
  setSideBar,
} from "../store/regFormSlice";

export interface perDetailsValues {
  firstName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  nationality: string;
  category: string;
  Income: string;
  gender: string;
  domicile: string;
  phc: string;
  service: string;
  TuitionFee: string;
  parentService: string;
  shipCard: string;
}

const PersonalDetails = () => {
  const { register, handleSubmit, formState } = useForm<perDetailsValues>({
    mode: "all",
  });
  const { errors } = formState;
  const [category, setCategory] = useState<string>("");
  const [income, setIncome] = useState<string>("");
  const [tutionFee, setTutionFee] = useState<string>("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [domicile, setDomicile] = useState("");
  const [phc, setPhc] = useState("");
  const [service, setService] = useState("");
  const [parCertificate, setPerCertificate] = useState("");
  const [shipCard, setShipCard] = useState("");
  const [disable, setDisable] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector((item: { regForm: Data }) => item?.regForm);
  /*submit handler*/
  const submitHandler = (e: perDetailsValues) => {
    dispatch(onPerDetails(e));
    /*storing data in local storage*/
    localStorage.setItem("perDetLocStorage", JSON.stringify(e));
    localStorage.setItem("showIncome", JSON.stringify(data.showIncome));
    navigate("/contactDetails");
  };
  /*for sideBar*/
  useEffect(() => {
    dispatch(setSideBar("personal"));
  }, []);

  return (
    <div className="bg-cover p-1 mx-40">
      <form
        noValidate
        onSubmit={(...args) => void handleSubmit(submitHandler)(...args)}
      >
        {/* PersonalDetails -1*/}
        <h2 className="mt-5 mb-4 text-3xl font-bold text-black-600 font-serif">
          Personal Details
        </h2>
        <div className="grid lg:grid-cols-4 sm:grid-cols-1 ">
          {/* name */}
          <div className="mx-2">
            <label className=" text-blue-600 font-serif ">Name </label>
            <input
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              type="text"
              {...register("firstName", {
                required: {
                  value: true,
                  message: `name is required`,
                },
                validate: {
                  alphabets: (value) => isNaN(+value),
                  matchPattern: (v) =>
                    /^[a-zA-Z ]*$/.test(v) || "Please Enter only alphabets",
                },
                value: data.personalDetails[0]?.firstName,
              })}
            />
            <p style={{ color: "red" }}> {errors.firstName?.message}</p>
            {errors.firstName?.type === "alphabets" && (
              <p style={{ color: "red" }}>name must be in alphabetical</p>
            )}
          </div>
          {/* fatherName */}

          <div className="mx-2">
            <label className="text-blue-600 font-serif ">Father name</label>
            <input
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              defaultValue={data.personalDetails[0]?.fatherName}
              type="text"
              {...register("fatherName", {
                required: {
                  value: true,
                  message: `father name is required`,
                },
                validate: {
                  alphabets: (value) => isNaN(+value),
                  matchPattern: (v) =>
                    /^[a-zA-Z ]*$/.test(v) || "Please Enter only alphabets",
                },
                value: data.personalDetails[0]?.fatherName,
              })}
            />
            <p style={{ color: "red" }}>{errors.fatherName?.message}</p>
            {errors.fatherName?.type === "alphabets" && (
              <p style={{ color: "red" }}>name must be in alphabetical</p>
            )}
          </div>
          {/* motherName */}

          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Mother Name
            </label>
            <input
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              defaultValue={data.personalDetails[0]?.motherName}
              type="text"
              {...register("motherName", {
                required: {
                  value: true,
                  message: `mother name is required`,
                },
                validate: {
                  alphabets: (value) => isNaN(+value),
                  matchPattern: (v) =>
                    /^[a-zA-Z ]*$/.test(v) || "Please Enter only alphabets",
                },
              })}
            />
            <p style={{ color: "red" }}>{errors.motherName?.message}</p>
            {errors.motherName?.type === "alphabets" && (
              <p style={{ color: "red" }}>name must be in alphabetical</p>
            )}
          </div>
          {/* enter Dob */}

          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">DOB</label>
            <input
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              type="date"
              {...register("dob", {
                required: {
                  value: true,
                  message: `date is required`,
                },
                max: {
                  value: `${new Date(
                    new Date().getFullYear() - 18,
                    10,
                    1
                  ).getFullYear()}-12-31`,
                  message: `below 18 years old not eligible`,
                },
                value: data.personalDetails[0]?.dob,
              })}
            />
            <p style={{ color: "red" }}>{errors.dob?.message}</p>
          </div>
          {/* gender */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              gender
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="gender"
              {...register("gender", {
                required: {
                  value: true,
                  message: "Please select gender",
                },
                onChange: (e) => {
                  setGender(e.target.value);
                },
                value: data.personalDetails[0]?.gender,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
            {gender === "" && (
              <p style={{ color: "red" }}>{errors.gender?.message}</p>
            )}
          </div>

          {/* nationality */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              nationality
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="nationality"
              {...register("nationality", {
                required: {
                  value: true,
                  message: "Please select nationality",
                },
                onChange: (e) => {
                  setNationality(e.target.value);
                },
                value: data.personalDetails[0]?.nationality,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="india">india</option>
            </select>
            {nationality === "" && (
              <p style={{ color: "red" }}>{errors.nationality?.message}</p>
            )}
          </div>

          {/* domicile */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              domicile
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="domicile"
              {...register("domicile", {
                required: {
                  value: true,
                  message: "Please select domicile",
                },
                onChange: (e) => {
                  setDomicile(e.target.value);
                },
                value: data.personalDetails[0]?.domicile,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="gujarat">gujarat</option>
              <option value="others">others</option>
            </select>
            {domicile === "" && (
              <p style={{ color: "red" }}>{errors.domicile?.message}</p>
            )}
          </div>

          {/* category */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Category
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="category"
              {...register("category", {
                required: {
                  value: true,
                  message: "Please select category",
                },
                onChange: (e) => {
                  setCategory(e.target.value);
                  if (e.target.value === "SC" || e.target.value === "ST") {
                    setDisable(false);
                  } else {
                    setDisable(true);
                  }
                },
                value: data.personalDetails[0]?.category,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="General">General</option>
              <option value="EWC">EWC</option>
              <option value="SEBC">SEBC</option>
            </select>
            {category === "" && (
              <p style={{ color: "red" }}>{errors.category?.message}</p>
            )}
          </div>
        </div>
        {/* SubCategory Details -2 */}
        <h3 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
          SubCategory Details
        </h3>

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 ">
          {/* phc*/}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Physically handicaped
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="phc"
              {...register("phc", {
                required: {
                  value: true,
                  message: "Please select phc",
                },
                onChange: (e) => {
                  setPhc(e.target.value);
                },

                value: data.personalDetails[0]?.phc,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="yes">yes</option>
              <option value="no">no</option>
            </select>
            {phc === "" && (
              <p style={{ color: "red" }}>{errors.phc?.message}</p>
            )}
          </div>
          {/* service category */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              IN/EX-Servicemen
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="phc"
              {...register("service", {
                required: {
                  value: true,
                  message: "Please select service",
                },
                onChange: (e) => {
                  setService(e.target.value);
                },
                value: data.personalDetails[0]?.service,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="yes">yes</option>
              <option value="no">no</option>
            </select>
            {service === "" && (
              <p style={{ color: "red" }}>{errors.service?.message}</p>
            )}
          </div>
          {/* Tution Details */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Tuition Fee Waiver(Eligible for SC/ST Caste Only)
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="category"
              {...register("TuitionFee", {
                required: {
                  value: true,
                  message: "Please select ",
                },
                onChange: (e) => {
                  setTutionFee(e.target.value);
                },
                value: data.personalDetails[0]?.TuitionFee,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              {disable && (
                <option disabled value="yes">
                  yes
                </option>
              )}
              {!disable && <option value="yes">yes</option>}
              <option value="no">No</option>
            </select>
            {tutionFee === "" && (
              <p style={{ color: "red" }}>{errors.TuitionFee?.message}</p>
            )}
          </div>
        </div>
        {/*Other Information -3*/}
        <h3 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
          Other Information
        </h3>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 ">
          {/*income certificate */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Income As per Income Certificate
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              {...register("Income", {
                required: {
                  value: true,
                  message: "Please select",
                },
                onChange: (e) => {
                  setIncome(e.target.value);
                  if (e.target.value === "Less than 2.5 Lakh") {
                    dispatch(setShowIncome(true));
                  } else {
                    dispatch(setShowIncome(false));
                  }
                },
                value: data.personalDetails[0]?.Income,
              })}
            >
              <option selected value="">
                --select--
              </option>
              {disable && (
                <option disabled value="Less than 2.5 Lakh">
                  Less than 2.5 Lakh( SC/ST Caste Only)
                </option>
              )}
              {!disable && (
                <option value="Less than 2.5 Lakh">
                  Less than 2.5 Lakh( SC/ST Caste Only)
                </option>
              )}
              <option value="2.5 Lakh to 8 Lakh">2.51 Lakh to 8 Lakh</option>

              <option value="Greater than 8 Lakh">Greater than 8 Lakh</option>
            </select>
            <p style={{ color: "red" }}>{errors.Income?.message}</p>
          </div>
          {/*parents certificate */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Do your parents have certificate of services
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="parcert"
              {...register("parentService", {
                required: {
                  value: true,
                  message: "Please select ",
                },
                onChange: (e) => {
                  setPerCertificate(e.target.value);
                },
                value: data.personalDetails[0]?.parentService,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="yes">yes</option>
              <option value="no">no</option>
            </select>
            {parCertificate === "" && (
              <p style={{ color: "red" }}>{errors.parentService?.message}</p>
            )}
          </div>
          {/*ship card*/}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Free Ship Card (Eligible for SC/ST Caste Only)
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="shipCard"
              value={data.personalDetails[0]?.shipCard}
              {...register("shipCard", {
                required: {
                  value: true,
                  message: "Please select ",
                },
                onChange: (e) => {
                  setShipCard(e.target.value);
                },
                value: data.personalDetails[0]?.shipCard,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              {disable && (
                <option disabled value="yes">
                  yes
                </option>
              )}
              {!disable && <option value="yes">yes</option>}
              <option value="no">no</option>
            </select>
            {shipCard === "" && (
              <p style={{ color: "red" }}>{errors.shipCard?.message}</p>
            )}
          </div>
        </div>
        <div className="text-center">
          <button className=" m-3 text-white bg-blue-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
export default PersonalDetails;
