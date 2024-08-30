import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Data, onUploads, setSideBar } from "../store/regFormSlice";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface DocumentData {
  image: { name: string }[];
  tc: { name: string }[];
  income: { name: string }[];
}

const Upload = () => {
  const { register, handleSubmit, formState } = useForm<DocumentData>({
    mode: "all",
  });
  const { errors } = formState;
  const [error1, setError1] = useState<boolean>(false);
  const [error2, setError2] = useState<boolean>(false);
  const [error3, setError3] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalShowData, setModalShowData] = useState("");

  const storeData = useSelector((item: { regForm: Data }) => item?.regForm);

  /*for passphoto jpeg*/
  const [image, setImage] = useState<string>(
    storeData.uploads[storeData.uploads.length - 1]?.image.url
  );

  /*for TC pdf */
  const [tc, setTc] = useState<string>(
    storeData.uploads[storeData.uploads.length - 1]?.tc.url
  );
  /*for income pdf */
  const [income, setIncome] = useState<string>(
    storeData.uploads[storeData.uploads.length - 1]?.income.url
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((item: { regForm: Data }) => item.regForm);
  /*submit handler*/
  const submitHandler = (e: DocumentData) => {
    dispatch(
      onUploads({
        image: { name: e.image[0]?.name, url: image },
        tc: { name: e.tc[0]?.name, url: tc },
        income: { name: e.income[0]?.name, url: income },
      })
    );
    localStorage.setItem(
      "uploadLocStorage",
      JSON.stringify({
        image: { name: e.image[0]?.name, url: image },
        tc: { name: e.tc[0]?.name, url: tc },
        income: { name: e.income[0]?.name, url: income },
      })
    );
    navigate("/preView");
  };

  const backHandler = () => {
    navigate("/contactDetails");
    window.location.reload();
  };

  const uploadedImage: any = localStorage.getItem("uploadLocStorage");

  useEffect(() => {
    dispatch(setSideBar("upload"));
  }, []);

  return (
    <div className="bg-cover mx-40 ">
      <h1 className="text-xl font-bold text-violet-600 font-serif mt-5 mb-4 text-center">
        Upload Documents/Images
      </h1>
      <form
        noValidate
        onSubmit={(...args) => void handleSubmit(submitHandler)(...args)}
      >
        <div className="relative overflow-x-auto">
          <table className="table-auto  border-collapse border-spacing-2 border border-slate-500 m-0">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400  ">
              <tr>
                <th className="px-6 font-serif py-3">Document Type</th>
                <th className="px-6 py-3 font-serif">Document size</th>
                <th className="px-6 py-3 font-serif">Choose Document</th>
                <th className="px-6 py-3 font-serif">Document Preview</th>
              </tr>
            </thead>
            <tbody>
              <tr className="px-10">
                <th
                  className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif"
                  scope="row"
                >
                  Photograph
                </th>
                <td className="px-6 py-4 font-serif">
                  Min Size:10kb(jpeg/jpg)
                  <br />
                  Max Size: 100kb(jpeg/jpg)
                </td>
                <td className="px-6 py-4">
                  {/* upload a photo */}
                  <div>
                    <label htmlFor="photo"></label>
                    <input
                      id="photo"
                      type="file"
                      accept="image/"
                      {...register("image", {
                        required: {
                          value: true,
                          message: `image is required`,
                        },
                        onChange(e) {
                          const files = e.target.files;
                          if (
                            files[0]?.size < 100000 &&
                            files[0]?.size > 10000 &&
                            (files[0]?.type === "image/jpeg" ||
                              files[0]?.type === "image/jpg")
                          ) {
                            setError1(false);

                            const reader = new window.FileReader();
                            reader.addEventListener("load", () => {
                              setImage(reader.result as string);
                            });
                            reader.readAsDataURL(files[0]);
                          } else {
                            setError1(true);
                          }
                        },
                      })}
                    />

                    <p style={{ color: "red" }}>{errors.image?.message}</p>
                    {error1 && (
                      <p style={{ color: "red" }}>
                        upload valid Photograph more than 10kb && below 100Kb &
                        (jpeg/jpg) format only
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {uploadedImage?.image?.url && (
                    <img
                      className="w-6 h-6"
                      src={uploadedImage?.image?.url}
                      alt="passphoto"
                    />
                  )}
                  <img
                    style={{ width: 150, height: 100 }}
                    src={
                      image
                        ? image
                        : "https://www.bwillcreative.com/wp-content/uploads/2021/05/Jpeg-File-Icon.jpg"
                    }
                    alt="passphoto"
                    onClick={() => {
                      setModalShowData("photo");
                      setShowModal(true);
                    }}
                  />
                  {showModal ? (
                    <>
                      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                              className="m-3 text-white bg-red-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                              type="button"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                          </div>
                          {/*content*/}
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                              <button
                                className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                              ></button>
                            </div>
                            {/*body*/}

                            <div className="relative p-6 flex-auto">
                              {modalShowData === "photo" && (
                                <img
                                  style={{ width: 250, height: 300 }}
                                  src={
                                    image
                                      ? image
                                      : "https://cdn.vectorstock.com/i/preview-1x/32/12/default-avatar-profile-icon-vector-39013212.jpg"
                                  }
                                  alt="passphoto"
                                />
                              )}
                              {modalShowData === "tc" && (
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                  <div
                                    style={{
                                      border: "1px solid rgba(0, 0, 0, 0.3)",
                                      height: 300,
                                      width: 300,
                                    }}
                                  >
                                    {tc && <Viewer fileUrl={tc} />}
                                  </div>
                                </Worker>
                              )}
                              {modalShowData === "ic" && (
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                  <div
                                    style={{
                                      border: "1px solid rgba(0, 0, 0, 0.3)",
                                      height: 300,
                                      width: 300,
                                    }}
                                  >
                                    {income && <Viewer fileUrl={income} />}
                                  </div>
                                </Worker>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                  ) : null}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif"
                >
                  Transfer Certificate
                </th>
                <td className="px-6 py-4 font-serif">
                  Min Size: 10kb(pdf)
                  <br />
                  Max Size: 200kb(pdf)
                </td>
                <td>
                  {/* upload tc*/}
                  <div>
                    <input
                      type="file"
                      accept="application/pdf"
                      {...register("tc", {
                        required: {
                          value: true,
                          message: `Tc is required`,
                        },
                        onChange(e) {
                          const files = e.target.files as FileList;
                          if (
                            files[0]?.size > 10000 &&
                            files[0]?.size < 200000 &&
                            files[0]?.type === "application/pdf"
                          ) {
                            setError2(false);
                            const reader = new window.FileReader();
                            reader.addEventListener("load", () => {
                              setTc(reader.result as string);
                            });
                            reader.readAsDataURL(files[0]);
                          } else {
                            setError2(true);
                          }
                        },
                      })}
                    />
                    <p style={{ color: "red" }}>{errors.tc?.message}</p>
                    {error2 && (
                      <p style={{ color: "red" }}>
                        {" "}
                        upload valid Pdf more than 10kb && below 200Kb only
                      </p>
                    )}
                  </div>{" "}
                </td>
                <td>
                  <img
                    style={{ width: "auto", height: "auto" }}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/640px-PDF_file_icon.svg.png"
                    alt="tc"
                    onClick={() => {
                      setModalShowData("tc");
                      setShowModal(true);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="text-base leading-relaxed text-blue-500 dark:text-gray-400 font-serif"
                >
                  Income certificate
                </th>
                <td className="font-serif">
                  Min Size: 10kb(pdf)
                  <br />
                  Max Size: 200kb(pdf)
                </td>
                <td>
                  {/* income certificate */}
                  <div>
                    <label></label>
                    <input
                      type="file"
                      accept="application/pdf"
                      {...register("income", {
                        required: {
                          value: data.showIncome,
                          message: `income is required`,
                        },
                        onChange(e) {
                          const files = e.target.files as FileList;
                          if (
                            files[0]?.size > 10000 &&
                            files[0]?.size < 200000 &&
                            files[0]?.type === "application/pdf"
                          ) {
                            setError3(false);
                            const reader = new window.FileReader();
                            reader.addEventListener("load", () => {
                              setIncome(reader.result as string);
                            });
                            reader.readAsDataURL(files[0]);
                          } else {
                            setError3(true);
                          }
                        },
                      })}
                    />
                    <p style={{ color: "red" }}>{errors.income?.message}</p>
                    {error3 && (
                      <p style={{ color: "red" }}>
                        {" "}
                        upload valid Pdf more than 10kb && below 200Kb only
                        upload valid Pdf below 200Kb only
                      </p>
                    )}
                  </div>
                </td>

                <td>
                  <img
                    style={{ width: "auto", height: "auto" }}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/640px-PDF_file_icon.svg.png"
                    alt="income certificate"
                    onClick={() => {
                      setModalShowData("ic");
                      setShowModal(true);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center m-5">
          <button
            className="mx-3 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            onClick={backHandler}
          >
            Back
          </button>
          <button className="mx-3 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
