import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { DeleteConfirmationBoxProps } from ".";
import { Fragment } from "react";

const DeleteConfirmationBox = ({ onClose, onDelete, message }: DeleteConfirmationBoxProps) => {
  return (
    <Fragment>
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
                <i className="osicon-close close-btn" role="button" aria-label="close-btn" onClick={onClose}></i>
              </div>
              <div className="modal-content">
                <span>{message}</span>
              </div>
              <div className="modal-footer">
                <div className="bottom-buttons">
                  <button className="btn btn-border-small" onClick={() => {
                    onDelete();
                  }}>YES</button>
                  <button className="btn btn-primary" onClick={() => {
                    onClose();
                  }}>NO</button>
                </div>
              </div>
          </div>
        </section>
    </Fragment>
  );
};

export default DeleteConfirmationBox;
