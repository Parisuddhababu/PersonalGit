import React, { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilFullscreen } from "@coreui/icons";
import { Dropdown } from "primereact/dropdown";

import templatePlaceholderImg from "src/assets/images/template-placeholder.png";
import ImageModal from "src/views/components/common/ImageModalPopup/image-modal";

const GeneralConfiguration = props => {
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? '';

    const [imageData, setImageData] = useState({});
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);

    const handleChange = (key, value) => {
        props.handleGeneralConfigChange(key, value);
    }

    const accountDataTemplate = option => {
        return (<>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>);
    }

    const activateFullScreenImage = (e, imageUrl) => {
        e.stopPropagation();
        const _imageData = { path: imageUrl };
        setImageData(_imageData);
        setShowFullScreenImage(true);
    }

    const handleCloseImageModal = () => {
        setImageData({});
        setShowFullScreenImage(false);
    }

    return (
        <>
            <div className="row">
                {
                    adminRole === "SUPER_ADMIN" && (
                        <div className="col-md-4 mt-4">
                            <span className="p-float-label custom-p-float-label" style={{ marginTop: "-12px" }}>
                                <Dropdown
                                    filter
                                    optionValue="_id"
                                    style={{ width: "250px" }}
                                    optionLabel="company_name"
                                    options={props.accountData}
                                    filterBy="company_name,code"
                                    itemTemplate={accountDataTemplate}
                                    valueTemplate={accountDataTemplate}
                                    value={props?.generalDetails?.account ?? ''}
                                    onChange={e => { handleChange("account", e.target.value); }}
                                />
                                <label>HCP</label>
                            </span>
                        </div>
                    )
                }
            </div>

            <div className="d-flex mt-3">
                {
                    props?.defaultTemplates?.map(templateObj => {
                        const { id, imageUrl, key, title } = templateObj;
                        const { template } = props?.generalDetails ?? {};

                        return (
                            <div key={key} className="mr-4 mb-3 d-flex align-items-center custom-checkbox">
                                <div
                                    className={`
                                        d-flex
                                        flex-column-reverse
                                        microsite-config-image
                                        ${template === id ? "selected-microsite-config-image" : '' }`
                                    }
                                >
                                    <div id="microsite-config-image">
                                        <img
                                            width={"100%"}
                                            height={"100%"}
                                            alt={"template"}
                                            className={"m-auto"}
                                            src={imageUrl ?? String(templatePlaceholderImg)}
                                            onClick={() => { handleChange("template", id); }}
                                            onError={e => { e.target.src = String(templatePlaceholderImg); }}
                                        />
                                    </div>

                                    <div className="template-header">
                                        {title?.toUpperCase()?.slice(0, 16) ?? ''}
                                        <span>
                                            {
                                                imageUrl && (
                                                    <CIcon
                                                        size="lg"
                                                        icon={cilFullscreen}
                                                        title="Toggle fullscreen image"
                                                        className="microsite-config-template-img-style"
                                                        onClick={e => { activateFullScreenImage(e, imageUrl); }} // NOSONAR
                                                    />
                                                )
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {<ImageModal visible={showFullScreenImage} imgObj={imageData} onCloseImageModal={handleCloseImageModal} />/* NOSONAR */}
        </>
    );
}

export default GeneralConfiguration;
