import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IDeletePopupProps } from ".";
import { useCallback } from "react";

const DeletePopup = (props: IDeletePopupProps) => {

  const toggleModal = useCallback((isDelete: boolean) => {
    props?.onClose();
    props?.isDelete(isDelete)
  }, [props]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.modalPopup)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.deletePopup)}
        />
      </Head>
        <section className="modal modal-active delete-popup">
          <div className="modal-container">
              <div className="modal-header">
                <h2>DELETE</h2>
                <i className="osicon-close close-btn" role="button" aria-label="close-btn" onClick={() => {
                    toggleModal(false);
                  }}></i>
              </div>
              <div className="modal-content">
                <span>{props?.message}</span>
              </div>
              <div className="modal-footer">
                <div className="bottom-buttons">
                  <button className="btn btn-border-small" onClick={() => {
                    toggleModal(true);
                  }}>YES</button>
                  <button className="btn btn-primary" onClick={() => {
                    toggleModal(false);
                  }}>NO</button>
                </div>
              </div>
          </div>
        </section>
    </>
  );
};

export default DeletePopup;
