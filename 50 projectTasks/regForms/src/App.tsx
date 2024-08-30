import React from "react";
import PersonalDetails from "./components/personalDetails";
import ContactDetails from "./components/contactDetails";
import Upload from "./components/uploads";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ErrorPage from "./components/errorPage";
import Preview from "./components/preview";
import { useSelector } from "react-redux";
import { Data } from "./store/regFormSlice";

function App() {
  const state = useSelector((state: { regForm: Data }) => state.regForm);
  return (
    <div className="flex flex-row flex-wrap ">
      <div className="bg-cover 1/4 h-screen bg-zinc-400 p-4 fixed">
        <h1 className="mt-5 mb-4 text-xl font-bold  text-blue-600 font-serif">
          Registration Form
        </h1>
        <div>
          <div className=" mt-2 mb-2">
            <h3
              className={`h-auto p-1 m-1 w-auto text-center bg-black-400  font-serif  ${
                state.isPersonalDetail ? "bg-blue-500" : ""
              }`}
            >
              Personal Details
            </h3>
          </div>
          <div className="mt-2 mb-2">
            <h3
              className={`h-auto p-1 m-1 w-auto  text-center font-serif ${
                state.isContactDetail ? "bg-blue-500" : ""
              }`}
            >
              Contact Details
            </h3>
          </div>
          <div className="mt-2 mb-2">
            <h3
              className={`h-auto p-1 m-1 w-auto text-center font-serif ${
                state.isUploads ? "bg-blue-500" : ""
              }`}
            >
              Uploads
            </h3>
          </div>
          <div className="mt-2 mb-2">
            <h3
              className={`h-auto p-1 m-1 w-auto text-center font-serif  ${
                state.isPreview ? "bg-blue-500" : ""
              }`}
            >
              Preview
            </h3>
          </div>
        </div>
      </div>
      <div>
        <div className="container bg-cover w-3/4 h-screen p-4 mx-40 ">
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<ErrorPage />}></Route>
              <Route path="/" element={<PersonalDetails />} />
              <Route path="/contactDetails" element={<ContactDetails />} />
              <Route path="/uploadDocs" element={<Upload />}></Route>
              <Route path="/preView" element={<Preview />}></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
