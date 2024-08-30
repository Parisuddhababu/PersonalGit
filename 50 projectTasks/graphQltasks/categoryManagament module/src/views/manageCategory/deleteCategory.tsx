import React from "react";
import Button from "@components/button/Button";
import { useTranslation } from "react-i18next";
import { categoryDeleteProps } from "src/types/category";

const DeleteModel = ({ onClose, deleteCategoryData }: categoryDeleteProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        id='changeStatusModel'
        tabIndex={-1}
        data-modal-show={true}
        aria-hidden='false'
        className={
          "fixed top-0 left- right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] backdrop-blur-sm"
        }
      >
        <div className='flex justify-center'>
          <div className='relative w-full max-w-2xl max-h-full bg-slate-200 '>
            {/* <!-- Modal content --> */}
            <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
              <div className='flex items-start justify-between p-4 border-b rounded-t bg-red-500'>
                <h3 className='text-xl font-semibold text-white'>
                  Confirmation
                </h3>
                <Button
                  onClick={onClose}
                  label={t("X")}
                  className='btn btn-primary'
                />
              </div>
            </div>

            <div className='p-6 space-y-6'>
              <p>Are you sure you want to delete?</p>
            </div>
            {/* <!-- Modal footer --> */}
            <div className='flex justify-end'>
              <Button
                onClick={deleteCategoryData}
                label={t("Yes")}
                className='btn btn-primary mx-2'
              />

              <Button
                onClick={onClose}
                label={t("No")}
                className='btn btn-warning mx-2'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModel;
