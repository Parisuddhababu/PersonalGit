import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Data, onContactDetails, setSideBar } from "../store/regFormSlice";
import { useForm } from "react-hook-form";
/*initial data for contact details*/
export interface contactDetailsValues {
  premise: string;
  Colony: string;
  City: string;
  Country: string;
  State: string;
  District: string;
  pincode: string;
  email: string;
  checkBox: boolean;
  premiseSame: string;
  ColonySame: string;
  CountrySame: string;
  StateSame: string;
  citySame: string;
  pincodeSame: string;
  emailSame: string;
  checkBoxSame: boolean;
}

const ContactDetails = () => {
  const { register, handleSubmit, formState, getValues, setValue } =
    useForm<contactDetailsValues>({
      mode: "all",
    });
  const storeData = useSelector((item: { regForm: Data }) => item?.regForm);

  const { errors } = formState;
  const [checked, setChecked] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [states, setStates] = useState<string>(
    storeData.contactDetails[0]?.State
  );
  const [perStates, setPerStates] = useState<string>("");
  const [districts, setDistricts] = useState<string>(
    storeData.contactDetails[0]?.District
  );
  const [perDist, setPerDist] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [countrie, setCountry] = useState<string>("");
  const [countrieSame, setCountrySame] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  /*check box for permenent adress */

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked === true) {
      setValue("premiseSame", getValues("premise"));
      setValue("ColonySame", getValues("Colony"));
      setValue("CountrySame", getValues("Country"));
      setValue("StateSame", getValues("State"));
      setValue("citySame", getValues("District"));
      setValue("pincodeSame", getValues("pincode"));
    }
    setChecked(event.target.checked);
    setShowForm((showForm) => !showForm);
  };
  /*submit handler */
  const submitHandler = (e: contactDetailsValues) => {
    dispatch(onContactDetails(e));
    //loc
    localStorage.setItem("conDetLocStorage", JSON.stringify(e));
    navigate("/uploadDocs");
    window.location.reload();
    setChecked(false);
  };
  /*for api*/
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
      });
    /*dispatching sidebar value*/
    dispatch(setSideBar("contact"));
  }, []);

  useEffect(() => {
    if (storeData.contactDetails[0]?.State.length > 1) {
      const cities = data
        .filter((i: { subcountry: string }) => i.subcountry === states)
        .map((city: { name: string }) => city.name);
      setCities(cities);
    }
  });

  const country = data.filter(
    (i: { country: string }) => i.country === "India"
  );
  const state = country.map((i: { subcountry: string }) => i.subcountry);
  const eachState = Array.from(new Set(state));

  const backHandler = () => {
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="bg-cover p-1 mx-40">
      <form
        noValidate
        onSubmit={(...args) => void handleSubmit(submitHandler)(...args)}
      >
        {/* contact details */}
        <h1 className="mt-5 mb-4 text-3xl font-bold text-black-600 font-serif">
          Contact Details
        </h1>
        <h3 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
          Correspondence Details
        </h3>
        <div className="grid lg:grid-cols-4 sm:grid-cols-1 ">
          {/* Premise No./Name */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Premise No./Name
            </label>
            <input
              type="text"
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              {...register("premise", {
                required: {
                  value: true,
                  message: `name is required`,
                },
                value: storeData.contactDetails[0]?.premise,
              })}
            />
            <p style={{ color: "red" }}> {errors.premise?.message}</p>
          </div>
          {/* Sub Locality/Colony */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Sub Locality/Colony
            </label>
            <input
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              type="text"
              {...register("Colony", {
                required: {
                  value: true,
                  message: `colony is required`,
                },
                value: storeData.contactDetails[0]?.Colony,
              })}
            />
            <p style={{ color: "red" }}> {errors.Colony?.message}</p>
          </div>

          {/* Country*/}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              Country
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              id="Country"
              {...register("Country", {
                required: {
                  value: true,
                  message: "Please select nationality",
                },
                onChange: (e) => {
                  setCountry(e.target.value);
                },
                value: storeData.contactDetails[0]?.Country,
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              <option value="india">india</option>
            </select>
            {countrie === "" && (
              <p style={{ color: "red" }}>{errors.Country?.message}</p>
            )}
          </div>
          {/* State */}
          <div className="mx-2">
            <label
              className="mt-5 mb-4 text-blue-600 font-serif "
              htmlFor="state"
            >
              State
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              defaultValue={storeData.contactDetails[0]?.State}
              id="state"
              {...register("State", {
                required: {
                  value: true,
                  message: "Please select category",
                },
                onChange: (e) => {
                  setStates(e.target.value);
                  const cities = data
                    .filter(
                      (i: { subcountry: string }) =>
                        i.subcountry === e.target.value
                    )
                    .map((city: { name: string }) => city.name);
                  setCities(cities);
                },
              })}
            >
              <option selected value={""}>
                --select--
              </option>
              {eachState.map((i) => {
                if (i === storeData.contactDetails[0]?.State) {
                  return (
                    <option key={i} value={i} selected>
                      {i}
                    </option>
                  );
                } else {
                  return (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                }
              })}
            </select>
            {states === "" && (
              <p style={{ color: "red" }}>{errors.State?.message}</p>
            )}
          </div>
          {/* District */}
          <div className="mx-2">
            <label
              className="mt-5 mb-4 text-blue-600 font-serif "
              htmlFor="district"
            >
              District
            </label>
            <select
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              defaultValue={storeData.contactDetails[0]?.District}
              id="district"
              {...register("District", {
                required: {
                  value: true,
                  message: "Please select district",
                },
                onChange: (e) => {
                  setDistricts(e.target.value);
                },
                value: storeData.contactDetails[0]?.District,
              })}
            >
              <option selected value={""}>
                --select--
              </option>

              {cities.map((i) => {
                if (storeData.contactDetails[0]?.District === i) {
                  return (
                    <option key={i} value={i} selected>
                      {i}
                    </option>
                  );
                } else {
                  return (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                }
              })}
            </select>
            {districts === "" && (
              <p style={{ color: "red" }}>{errors.District?.message}</p>
            )}
          </div>
          {/* pincode */}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">
              pincode
            </label>
            <input
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              defaultValue={storeData.contactDetails[0]?.pincode}
              type="tel"
              {...register("pincode", {
                required: {
                  value: true,
                  message: `pincode is required `,
                },
                validate: {
                  number: (value) => !isNaN(+value),
                  length: (value) => value.length === 6,
                },
                value: storeData.contactDetails[0]?.pincode,
              })}
            />
            <p style={{ color: "red" }}>{errors.pincode?.message}</p>
            {errors.pincode?.type === "number" && (
              <p style={{ color: "red" }}>pincode must be only numbers</p>
            )}
            {errors.pincode?.type === "length" && (
              <p style={{ color: "red" }}>pincode must be 6 digits only</p>
            )}
          </div>
          {/* email*/}
          <div className="mx-2">
            <label className="mt-5 mb-4 text-blue-600 font-serif ">email</label>
            <input
              className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              defaultValue={storeData.contactDetails[0]?.email}
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: `email is required`,
                },
                validate: {
                  matchPattern: (v) =>
                    /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,5})+$/.test(v) ||
                    "Email address must be a valid address",
                },
                value: storeData.contactDetails[0]?.email,
              })}
            />
            <p style={{ color: "red" }}>{errors.email?.message}</p>
          </div>
        </div>
        {/* permenent details */}
        <div className="mx-2">
          {/* Same as permenent Adress */}
          <div className="m-3">
            <label className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
              Same as permenent Adress
              <input
                type="checkbox"
                checked={checked}
                onChange={checkboxHandler}
                className="w-5 h-5 font-bold text-red-600 bg-gray-100 border-gray-300  rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </label>
            {<p style={{ color: "red" }}>{errors.checkBox?.message}</p>}
          </div>
          {showForm && (
            <div className="grid lg:grid-cols-4 sm:grid-cols-1 ">
              {/* Premise No./Name */}
              <div className="mx-2">
                <label className="mt-5 mb-4 text-blue-600 font-serif ">
                  Premise No./Name
                </label>
                <input
                  type="text"
                  className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  {...register("premiseSame", {
                    required: {
                      value: true,
                      message: `name is required`,
                    },
                    value: storeData.contactDetails[0]?.premiseSame,
                  })}
                />
                <p style={{ color: "red" }}> {errors.premiseSame?.message}</p>
              </div>
              {/*Sub Locality/Colony */}
              <div className="mx-2">
                <label className="mt-5 mb-4 text-blue-600 font-serif ">
                  Sub Locality
                </label>
                <input
                  className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  type="text"
                  {...register("ColonySame", {
                    required: {
                      value: true,
                      message: `colony is required`,
                    },
                    value: storeData.contactDetails[0]?.ColonySame,
                  })}
                />
                <p style={{ color: "red" }}> {errors.ColonySame?.message}</p>
              </div>
              {/* Country */}
              <div className="mx-2">
                <label className="mt-5 mb-4 text-blue-600 font-serif ">
                  Country
                </label>
                <select
                  className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  id="Country"
                  {...register("CountrySame", {
                    required: {
                      value: true,
                      message: "Please select nationality",
                    },
                    onChange: (e) => {
                      setCountrySame(e.target.value);
                    },
                    value: storeData.contactDetails[0]?.CountrySame,
                  })}
                >
                  <option selected value={""}>
                    --select--
                  </option>
                  <option value="india">india</option>
                </select>
                {countrieSame === "" && (
                  <p style={{ color: "red" }}>{errors.CountrySame?.message}</p>
                )}
              </div>
              {/* State */}
              <div className="mx-2">
                <label
                  className="mt-5 mb-4 text-blue-600 font-serif "
                  htmlFor="state"
                >
                  State
                </label>
                <select
                  className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  id="state"
                  {...register("StateSame", {
                    required: {
                      value: true,
                      message: "Please select state",
                    },
                    onChange: (e) => {
                      setPerStates(e.target.value);
                    },
                    value: storeData.contactDetails[0]?.StateSame,
                  })}
                >
                  <option selected value="">
                    --select--
                  </option>
                  {eachState.map((i) => {
                    if (i === storeData.contactDetails[0]?.StateSame) {
                      return (
                        <option key={i} value={i} selected>
                          {i}
                        </option>
                      );
                    } else {
                      return (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      );
                    }
                  })}
                </select>
                {perStates === "" && (
                  <p style={{ color: "red" }}>{errors.StateSame?.message}</p>
                )}
              </div>
              {/* citysame */}
              <div className="mx-2">
                <label
                  className="mt-5 mb-4 text-blue-600 font-serif "
                  htmlFor="citySame"
                >
                  city
                </label>
                <select
                  className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  id="citySame"
                  {...register("citySame", {
                    required: {
                      value: true,
                      message: "Please select city",
                    },
                    onChange: (e) => {
                      setPerDist(e.target.value);
                    },
                    value: storeData.contactDetails[0]?.citySame,
                  })}
                >
                  <option selected value="">
                    --select--
                  </option>
                  {cities.map((i) => {
                    if (storeData.contactDetails[0]?.citySame === i) {
                      return (
                        <option key={i} value={i} selected>
                          {i}
                        </option>
                      );
                    } else {
                      return (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      );
                    }
                  })}
                </select>
                {perDist === "" && (
                  <p style={{ color: "red" }}>{errors.citySame?.message}</p>
                )}
              </div>
              {/* pincode */}
              <div className="mx-2">
                <label className="mt-5 mb-4 text-blue-600 font-serif ">
                  pincode
                </label>
                <input
                  defaultValue={storeData.contactDetails[0]?.pincodeSame}
                  type="tel"
                  className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  {...register("pincodeSame", {
                    required: {
                      value: true,
                      message: `pincode is required *`,
                    },
                    validate: {
                      number: (value) => !isNaN(+value),
                      length: (value) => value.length === 6,
                    },
                    value: storeData.contactDetails[0]?.pincodeSame,
                  })}
                />
                <p style={{ color: "red" }}>{errors.pincodeSame?.message}</p>
                {errors.pincodeSame?.type === "tel" && (
                  <p style={{ color: "red" }}>pincode must be only numbers</p>
                )}
                {errors.pincodeSame?.type === "length" && (
                  <p style={{ color: "red" }}>pincode must be 6 digits only</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="text-center mx-auto">
          <button
            className="text-white mt-4 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            onClick={backHandler}
          >
            Back
          </button>
          <button className="text-white mt-4 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
export default ContactDetails;
