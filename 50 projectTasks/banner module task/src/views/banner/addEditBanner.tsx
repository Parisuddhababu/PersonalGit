import React, { useCallback, useEffect, useState } from "react";
import TextInput from "@components/input/TextInput";
import { BannerEditProps } from "src/types/banner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_BANNER,
  UPDATE_BANNER,
} from "@framework/graphql/mutations/banner";
import { toast } from "react-toastify";
import { GET_BANNER_DETAILS_BY_ID } from "@framework/graphql/queries/banner";
import { Check, Cross } from "@components/icons";

const AddEditBanner = ({
  isShowAddEditForm,
  isBannerEditable,
  onSubmitBanner,
  onClose,
  bannerObj,
}: BannerEditProps) => {
  const [createBanner] = useMutation(CREATE_BANNER);
  const [updateBanner] = useMutation(UPDATE_BANNER);
  const { refetch } = useQuery(GET_BANNER_DETAILS_BY_ID);
  const [status, setStatus] = useState(1);

  /*initial values*/
  const initialValues = {
    bannerTitle: "",
    bannerImage: "",
    status: "",
  };

  /*status handler*/
  const statusChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (+event.target.value === 1) {
      setStatus(1);
    }
    if (+event.target.value === 0) {
      setStatus(0);
    }
  };

  /*creating image or file*/
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://basenodeapi.demo.brainvire.dev/media/uploadImages",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();

        return data.data.url;
      } else {
        toast.error("Failed to upload file");
        return "";
      }
    } catch (error) {
      toast.error("Failed to upload file");
      return "";
    }
  };

  /*validations */
  const validationSchema = Yup.object({
    bannerTitle: Yup.string().required("please enter banner title"),
    bannerImage: Yup.mixed()
      .required("please select file")
      .test(
        "fileFormat",
        "Unsupported file format",
        (value) => value && ["image/jpeg", "image/png"].includes(value.type)
      )
      .test(
        "fileSize",
        "File size is too large Accept Only 2 Mb or lessthen 2 Mb Image",

        (value) => value && value.size <= 2000000
      ),
  });

  /*submit form*/
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      let bannerImageUrl = formik.values.bannerImage;

      if (typeof values.bannerImage !== "string") {
        bannerImageUrl = await uploadFile(values.bannerImage);
      }
      if (isBannerEditable) {
        updateBanner({
          variables: {
            updateBannerId: bannerObj.id,
            bannerTitle: values.bannerTitle,
            bannerImage: bannerImageUrl,
            status: +status,
          },
        })
          .then((res) => {
            const data = res.data;
            if (data?.updateBanner?.meta?.statusCode === 200) {
              toast.success(data?.updateBanner?.meta?.message);
            } else {
              toast.error(data?.updateBanner?.meta?.message);
            }
            onSubmitBanner();
          })
          .catch(() => {
            toast.error("Failed to update the role");
          });
      } else {
        createBanner({
          variables: {
            bannerTitle: values.bannerTitle,
            bannerImage: bannerImageUrl,
            createdBy: 1,
            status: +status,
          },
        })
          .then((res) => {
            const data = res.data;
            if (data?.createBanner?.meta?.statusCode === 201) {
              toast.success(data?.createBanner?.meta.message);
            } else {
              toast.error(data?.createBanner?.meta.message);
            }
            onSubmitBanner();
          })
          .catch(() => {
            toast.error("Failed to create role");
          });
      }
    },
  });
  /*bannerImage*/
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const imageHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        formik.setFieldValue("bannerImage", file);
        setBannerImageUrl(URL.createObjectURL(file));
      }
    },
    [formik]
  );
  /*get single banner detail*/
  const refetchBannerdata = useCallback(async () => {
    const res = await refetch({ getBannerDetailId: bannerObj.id });
    if (res) {
      const data = res?.data?.getBannerDetail?.data;
      formik.setValues({
        bannerTitle: data?.banner_title,
        bannerImage: data?.banner_image,
        status: data?.status,
      });
    }
  }, [bannerObj.id, formik, refetch]);
  useEffect(() => {
    refetchBannerdata().catch((e) => toast.error(`${e.message}`));
  }, [refetchBannerdata]);

  return (
    <div>
      <div
        id='defaultModal'
        tabIndex={-1}
        data-modal-show={true}
        aria-hidden='false'
        className={
          "fixed top-0 left- right-0 z-50  w-2/3  h-auto p-4 overflow-x-hidden overflow-y-auto md:inset-0  backdrop-blur-sm m-auto "
        }>
        <div className='p-3'>
          {/* <!-- Modal content --> */}
          <div className='relative bg-white rounded-lg '>
            {/* <!-- Modal header --> */}
            <div className='flex items-start justify-between p-4 border-b rounded-t bg-red-500'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {isBannerEditable ? "Edit banner" : "Add new"}
              </h3>
              <button onClick={onClose}>X</button>
            </div>
            {/* <!-- Modal body --> */}
            <form
              onSubmit={formik.handleSubmit}
              className='w-full bg-white shadow-lg rounded-lg p-8 mb-5'>
              <div className='mb-4'>
                <div className='flex items-center justify-center w-full'>
                  <label
                    htmlFor='imageFile'
                    className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                        <img
                          style={{ height: 150, width: 200 }}
                          alt=''
                          src={
                            bannerImageUrl
                              ? bannerImageUrl
                              : formik.values.bannerImage
                          }
                        />
                        {!bannerImageUrl && !formik.values.bannerImage && (
                          <div>
                            <h3 className='text-yellow-500 font-bold'>
                              Browse
                            </h3>
                            <span className='font-semibold text-center'>
                              for a banner image to upload
                            </span>
                          </div>
                        )}
                      </p>
                    </div>
                    <div className='hidden'>
                      <TextInput
                        type='file'
                        id='imageFile'
                        placeholder={"Banner image"}
                        name='bannerImage'
                        onChange={imageHandler}
                        error={formik.errors.bannerImage as string}
                      />
                    </div>
                    <p className='text-red-500'>{formik.errors.bannerImage}</p>
                  </label>
                </div>
                <TextInput
                  type='text'
                  label={"banner title"}
                  placeholder={"Banner Title"}
                  name='bannerTitle'
                  onChange={formik.handleChange}
                  value={formik.values.bannerTitle}
                  error={formik.errors.bannerTitle as string}
                />
              </div>

              <div>
                <label className='font-bold text-gray-900 px-1 py-4  mb-1'>
                  Status
                </label>
                <div className='font-serif px-4  '>
                  <input
                    type='radio'
                    id='active'
                    value={1}
                    defaultChecked
                    name='Status'
                    onChange={statusChangeHandler}
                  />
                  <label htmlFor='all' className='font-serif px-4 py-4 mx-1 '>
                    Active
                  </label>
                </div>
                <div className=' font-serif px-4  '>
                  <input
                    type='radio'
                    id='InActive'
                    value={0}
                    name='Status'
                    onChange={statusChangeHandler}
                  />

                  <label
                    htmlFor='android'
                    className='font-serif px-4 py-4 mx-1 '>
                    InActive
                  </label>
                </div>
              </div>
              <button
                type='submit'
                className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 m-1'>
                <Check className='inline-block mr-1' /> Yes
              </button>
              <button onClick={onClose} className='btn btn-warning'>
                <Cross className='inline-block mr-1' /> No
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBanner;
