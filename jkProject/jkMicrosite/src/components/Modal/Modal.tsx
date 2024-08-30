import ReactDom from "react-dom";

// Util and lib
import { IsBrowser } from "@util/common";

import { IModalProps } from "@components/Modal";
import { useRef, useEffect } from "react";

const Modal = ({
  open,
  className,
  children,
  onClose,
  dimmer = true,
  headerName,
}: IModalProps) => {
  const onCloseEvent = () => onClose();
  const ModaltRef = useRef<HTMLDivElement>(null);
  const ModalContentRef = useRef<HTMLDivElement>(null);

  const escapHandle = ({ key }: any) =>
    key === "Escape" && dimmer ? onClose() : void 0;

  useEffect(() => {
    if (IsBrowser) {
      if (open) {
        window.addEventListener("keydown", escapHandle);
        document.body.classList.add("hidden");
      }
      return () => {
        window.removeEventListener("keydown", escapHandle);
        document.body.classList.remove("hidden");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const outSideClick = (event: any) => {
    if (!dimmer) return;
    if (ModalContentRef !== null) {
      if (ModalContentRef?.current !== null) {
        if (!ModalContentRef.current.contains(event.target)) onClose();
      }
    }
  };

  if (!IsBrowser) return <>{""}</>;

  if (!open) return <>{""}</>;

  return (
    open &&
    ReactDom.createPortal(
      <div className="page-wrapper">
        <section
          className={`modal modal-active ${className}`}
          ref={ModaltRef}
          onClick={outSideClick}
        >
          <div className="pop-up-container">
            <div className="modal-wrapper" ref={ModalContentRef}>
              <div className="modal-header" onClick={onCloseEvent}>
                <i className="jkm-close jkms2-close"></i>
                {headerName ? (
                  <>
                    <h3>{headerName}</h3>
                    <div className="line"></div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              {open && children}
            </div>
          </div>
        </section>
      </div>,
      document.body
    )
  );
};

export default Modal;
