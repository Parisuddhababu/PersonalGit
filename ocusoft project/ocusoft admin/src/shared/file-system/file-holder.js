import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React from "react";
import { CImage } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilFile } from "@coreui/icons";

import CloseIcon from "src/assets/images/close.svg";

const FileHolder = ({ fileObj, removeFileFn, inputChangeFn, fileUploadFn, refObj, fileName, fileType, acceptType }) => {
    return (
        <div className="form-control upload-image-wrap multi-upload-image-wrap file-upload-document">
            {
                fileObj?.url ? (
                    <div className="profile mb-3">
                        <div className="profile-wrapper">
                            {
                                fileType === "image" ? (
                                    <CImage
                                        alt="File"
                                        src={fileObj.url}
                                        className={`profile-img ${fileObj.obj ? "canvas" : ''}`}
                                    />
                                ) : (
                                    <CIcon alt="File" src={cilFile} className="profile-img" />
                                )
                            }
                        </div>

                        {
                            fileObj?.noPicture && (
                                <img
                                    src={CloseIcon}
                                    className="remove-profile"
                                    onClick={() => { removeFileFn(fileName); }}
                                />
                            )
                        }

                        <input
                            type="file"
                            name={fileName}
                            id="profile_picture"
                            className="form-control"
                            onChange={inputChangeFn}
                        />
                    </div>
                ) : (
                    <div className="p-fileupload">
                        <input
                            type="file"
                            ref={refObj}
                            accept={acceptType}
                            style={{ display: "none" }}
                            onChange={e => { fileUploadFn(e, fileName, fileType); }}
                        />

                        <button
                            type="button"
                            className="p-button p-fileupload-choose"
                            onClick={() => { refObj.current.click(); }}
                        >
                            <span className="p-button-label p-clickable">
                                <CIcon size="xl" icon={cilCloudUpload} />
                                <p className="mb-0">{`Upload ${fileType}`}</p>
                            </span>
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default FileHolder;
