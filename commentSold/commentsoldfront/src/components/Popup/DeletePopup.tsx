import { IDeletePopupProps } from "@/types/components";
import { useCallback } from "react";
import Modal from 'react-modal';

const customStyles = {
    content: {
        maxWidth: 600,
    },
};

const DeletePopup = (props: IDeletePopupProps) => {

    const toggleModal = useCallback((isDelete: boolean) => {
        props?.onClose();
        props?.isDelete(isDelete)
    }, [props]);

    return (
        <Modal
            isOpen={props.isShow}
            onRequestClose={() => toggleModal(false)}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <button onClick={() => toggleModal(false)} className='modal-close'><i className='icon-close'></i></button>
            <div className='modal-body scrollbar-sm modal-sm'>
                <div >
                    {props?.title ? <h3>{props.title}</h3> : <></>}
                    <span>{props?.message}</span>
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
        </Modal>
    );
};

export default DeletePopup;
