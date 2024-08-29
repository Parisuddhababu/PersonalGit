import { MultiSelect } from "primereact/multiselect";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";

import ImageModal from "src/views/components/common/ImageModalPopup/image-modal";

const PageConfiguration = forwardRef((props, ref) => { // NOSONAR
    const [imageData, setImageData] = useState({});
    const [websiteSettings, setWebsiteSettings] = useState([]);
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);
    const [selectedWebsiteSettings, setSelectedWebsiteSettings] = useState([]);

    useEffect(() => {
        const setFn = setPageAndSectionData;
        const { websiteSettings, selectedWebsiteSettings } = props;
        if (websiteSettings && selectedWebsiteSettings) setFn(selectedWebsiteSettings, websiteSettings);
    }, [props]);

    useImperativeHandle(ref, () => {
        return {
            getSelectedWebsiteSettings: () => {
                return selectedWebsiteSettings;
            },
        }
    }, [selectedWebsiteSettings]);

    const setPageAndSectionData = (_selectedWebsiteSettings, _websiteSettings) => {
        const selectedPageIdArray = _selectedWebsiteSettings.map(page => page.id);

        for (const pageObj of _websiteSettings) {
            if (!selectedPageIdArray.includes(pageObj.id) && pageObj.isCompulsory) {
                let _pageObj = { id: pageObj.id, title: pageObj.title, components: [] };

                const compulsoryComponents = pageObj.components.filter(component => {
                    return component.isCompulsory;
                }).map(component => {
                    return { id: component.id, title: component.title, template: null };
                });

                if (compulsoryComponents?.length > 0) {
                    _pageObj.components = compulsoryComponents;
                }

                _selectedWebsiteSettings.push(_pageObj);
            } else if (selectedPageIdArray.includes(pageObj.id)) {
                const allComponents = pageObj.components;
                const selectedPageIndex = _selectedWebsiteSettings.findIndex(page => page.id === pageObj.id);
                const selectedPageObj = _selectedWebsiteSettings[selectedPageIndex];
                const selectedComponents = selectedPageObj.components.map(component => component.id);

                let nonSelectedCompulsoryComponents = allComponents.filter(component => {
                    return (!selectedComponents.includes(component.id) && component.isCompulsory);
                }).map(component => {
                    return { id: component.id, title: component.title, template: null };
                });

                if (nonSelectedCompulsoryComponents?.length > 0) {
                    selectedPageObj.components = [
                        ...selectedPageObj.components,
                        ...nonSelectedCompulsoryComponents,
                    ];

                    _selectedWebsiteSettings[selectedPageIndex] = selectedPageObj;
                }
            }
        }

        setSelectedWebsiteSettings([..._selectedWebsiteSettings]);
        setWebsiteSettings([...props.websiteSettings]);
    }

    const findSelectedPages = () => {
        let selectedPages = [];
        selectedPages = selectedWebsiteSettings?.map(page => page.id);

        for (const page of websiteSettings) {
            if (!selectedPages.includes(page.id) && page.isCompulsory) selectedPages.push(page.id);
        }

        return selectedPages;
    }

    const handlePageConfigChange = selectedPageList => {
        let _selectedWebsiteSettings = selectedWebsiteSettings;

        for (const selectedPageId of selectedPageList) {
            const pageObj = websiteSettings.find(page => page.id === selectedPageId);
            const selectedPageObj = selectedWebsiteSettings.find(page => page.id === selectedPageId);

            if (selectedPageObj) {
                continue;
            } else {
                const newPageObj = { id: pageObj.id, title: pageObj.title, components: [] };

                for (const components of pageObj.components) {
                    if (components.isCompulsory) {
                        let componentObj = {
                            id: components.id,
                            title: components.title,
                            template: null,
                        }
                        newPageObj.components.push(componentObj);
                    }
                }

                _selectedWebsiteSettings.push(newPageObj);
            }
        }

        _selectedWebsiteSettings.forEach((page, index, pageObj) => {
            if (!selectedPageList.includes(page.id)) pageObj.splice(index, 1);
        });

        setSelectedWebsiteSettings([..._selectedWebsiteSettings]);
    }

    const handleCloseImageModal = () => {
        setImageData({});
        setShowFullScreenImage(false);
    }

    return (
        <fieldset className="fieldset mb-4 d-none">
            <legend className="legend">Pages Configuration</legend>

            {
                websiteSettings?.length > 0 ? (
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <span className="p-float-label custom-p-float-label">
                                <MultiSelect
                                    filter
                                    optionValue="id"
                                    filterBy="title"
                                    optionLabel="title"
                                    showSelectAll={false}
                                    options={websiteSettings}
                                    value={findSelectedPages()}
                                    className="form-control hide-close-icon"
                                    optionDisabled={page => page.isCompulsory}
                                    onChange={e => { handlePageConfigChange(e.value); }} // NOSONAR
                                />

                                <label>Select Page <span className="text-danger">*</span></label>
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center no-data">Data unavailable</div>
                )
            }

            <ImageModal visible={showFullScreenImage} imgObj={imageData} onCloseImageModal={handleCloseImageModal} />
        </fieldset>
    );
})

export default PageConfiguration;
