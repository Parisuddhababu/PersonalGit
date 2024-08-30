import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Data, setSideBar } from "../store/regFormSlice";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
const Preview = () => {
  /*getting data from store*/
  const storeData = useSelector((item: { regForm: Data }) => item?.regForm);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /*submit handler*/
  const submitHandler = () => {
    /*removing data from local storage*/
    localStorage.removeItem("perDetLocStorage");
    localStorage.removeItem("conDetLocStorage");
    localStorage.removeItem("uploadLocStorage");
    navigate("/");
    window.location.reload();
  };
  /*dispatch the boolean value for side bar*/
  useEffect(() => {
    dispatch(setSideBar("preview"));
  }, []);

  return (
    <div className="bg-cover p-1 mx-40">
      <h1 className="mt-5 mb-4 text-3xl font-bold text-blue-600 font-serif">
        Preview Details
      </h1>
      <h1 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
        Personal Details
      </h1>
      {/* personal Details  */}
      <div>
        <div>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            Name: <span>{storeData.personalDetails[0]?.firstName}</span>
          </p>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            fatherName:
            <span>{storeData.personalDetails[0]?.fatherName}</span>
          </p>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            motherName:
            <span>{storeData.personalDetails[0]?.motherName}</span>
          </p>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            Dob:
            <span>{storeData.personalDetails[0]?.dob}</span>
          </p>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            gender:
            <span>{storeData.personalDetails[0]?.gender}</span>
          </p>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            nationality:
            <span>{storeData.personalDetails[0]?.nationality}</span>
          </p>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            domicile:
            <span>{storeData.personalDetails[0]?.domicile}</span>
          </p>
          <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
            category:
            <span>{storeData.personalDetails[0]?.category}</span>
          </p>
        </div>
        {/* subcategory Details */}
        <h3 className="mt-5 mb-4 text-md font-bold text-black-600 font-serif">
          SubCategory Details
        </h3>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Physically handicaped:
          <span>{storeData.personalDetails[0]?.phc}</span>
        </p>

        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          IN/EX-Servicemen:
          <span>{storeData.personalDetails[0]?.service}</span>
        </p>

        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Tution Fee Waiver:
          <span>{storeData.personalDetails[0]?.TuitionFee}</span>
        </p>
        {/* other information */}
        <h3 className="mt-5 mb-4 text-md font-bold text-black-600 font-serif">
          Other Information
        </h3>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Income As per Income Certificate:
          <span> {storeData.personalDetails[0]?.Income}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Do your parents have certificate of services:
          <span> {storeData.personalDetails[0]?.parentService}</span>
        </p>

        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Free Ship Card (Eligible for SC/ST Caste Only):
          <span> {storeData.personalDetails[0]?.shipCard}</span>
        </p>
      </div>
      <br />
      {/* contact Details */}
      <h1 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
        Contact Details
      </h1>
      <div>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Premise No./Name:
          <span>{storeData.contactDetails[0]?.premise}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          colony:
          <span>{storeData.contactDetails[0]?.Colony}</span>
        </p>

        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Country:
          <span>{storeData.contactDetails[0]?.Country}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          State:
          <span>{storeData.contactDetails[0]?.State}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          District:
          <span>{storeData.contactDetails[0]?.District}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          pincode:
          <span>{storeData.contactDetails[0]?.pincode}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          email:
          <span>{storeData.contactDetails[0]?.email}</span>
        </p>
        {/* permenent adress */}
        <h3 className="mt-5 mb-4 text-md font-bold text-black-600 font-serif">
          Permenent Adress
        </h3>
        <br />

        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Premise No./Name:
          <span>{storeData.contactDetails[0]?.premiseSame}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          colony:
          <span>{storeData.contactDetails[0]?.ColonySame}</span>
        </p>

        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          Country:
          <span>{storeData.contactDetails[0]?.CountrySame}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          State:
          <span>{storeData.contactDetails[0]?.StateSame}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          District:
          <span>{storeData.contactDetails[0]?.citySame}</span>
        </p>
        <p className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif">
          pincode:
          <span>{storeData.contactDetails[0]?.pincodeSame}</span>
        </p>
      </div>
      <br />
      {/* upload Photo */}
      <h3 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
        uploaded photo
      </h3>
      <img
        style={{ height: 250, width: 300 }}
        src={
          storeData.uploads[storeData.uploads.length - 1]?.image.url
            ? storeData.uploads[storeData.uploads.length - 1]?.image.url
            : "https://cdn.vectorstock.com/i/preview-1x/32/12/default-avatar-profile-icon-vector-39013212.jpg"
        }
        alt="passphoto"
      />
      <h3 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
        uploaded Transfer certificate
      </h3>
      <div>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div
            style={{
              border: "1px solid rgba(0, 0, 0, 0.3)",
              height: 300,
              width: 300,
            }}
          >
            <Viewer
              fileUrl={
                storeData.uploads[storeData.uploads.length - 1]?.tc.url
                  ? storeData.uploads[storeData.uploads.length - 1]?.tc.url
                  : "https://cdn.vectorstock.com/i/preview-1x/32/12/default-avatar-profile-icon-vector-39013212.jpg"
              }
            />
          </div>
        </Worker>
      </div>
      <h3 className="mt-5 mb-4 text-xl font-bold text-black-600 font-serif">
        uploaded Income certificate
      </h3>
      <div>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div
            style={{
              border: "1px solid rgba(0, 0, 0, 0.3)",
              height: 300,
              width: 300,
            }}
          >
            <Viewer
              fileUrl={
                storeData.uploads[storeData.uploads.length - 1]?.income.url
                  ? storeData.uploads[storeData.uploads.length - 1]?.income.url
                  : "https://cdn.vectorstock.com/i/preview-1x/32/12/default-avatar-profile-icon-vector-39013212.jpg"
              }
            />
          </div>
        </Worker>
      </div>

      <div className="text-center mx-auto">
        <button
          className="m-3 text-white bg-red-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          onClick={() => navigate("/uploadDocs")}
        >
          Back
        </button>
        <button
          className="mt-3 text-white bg-blue-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          onClick={submitHandler}
        >
          submit
        </button>
      </div>
    </div>
  );
};
export default Preview;
