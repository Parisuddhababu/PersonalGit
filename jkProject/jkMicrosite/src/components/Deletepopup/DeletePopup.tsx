import Modal from "@components/Modal";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IDeletePopupProps } from ".";

const DeletePopup = (props: IDeletePopupProps) => {
  const toggleModal = () => {
    props.onClose();
    props?.isDelete(false)
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
      <Modal
        className=""
        open={true}
        onClose={toggleModal}
        dimmer={false}
        headerName="Delete"
      >
        <div className="modal-content">
          <p className="wrapper-title">{props?.message}</p>
          <div className="btn-wrapper">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                toggleModal();
                props?.isDelete(true)
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                toggleModal();
                props?.isDelete(false)
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeletePopup;
