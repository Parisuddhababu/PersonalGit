import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useEffect, useState, useRef } from "react";
import CIcon from "@coreui/icons-react";
import CloseIcon from 'src/assets/images/close.svg';
import { CImage } from "@coreui/react";
import { cilPlus, cilTrash, cilCheck, cilCloudUpload } from "@coreui/icons";
import { useToast } from "src/shared/toaster/Toaster";
import { CommonMaster, ADD_EDIT_BASE_CONFIGURATION } from "src/shared/enum/enum";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { API } from 'src/services/Api';
import { Toast } from 'primereact/toast';
import { useLocation, useHistory } from "react-router-dom";
import * as Constant from 'src/shared/constant/constant';
import DeleteModal from '../../common/DeleteModalPopup/delete-modal';
import Loader from "../../common/loader/loader";
import { Dropdown } from "primereact/dropdown";

const AddEditBaseConfig = () => {
    const [pageId, setPageId] = useState("");
    const [sections, setSections] = useState([]);
    const [defaultTemplates, setDefaultTemplates] = useState([]);
    const [defaultPages, setDefaultPages] = useState([]);
    const [defaultComponents, setDefaultComponents] = useState([]);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);
    const [imageIndex, setImageIndex] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [showSectionDeleteModal, setShowSectionDeleteModal] = useState(false);
    const [sectionDeleteObj, setSectionDeleteObj] = useState({});
    const [deleteObj, setDeleteObj] = useState({});
    const [deletingTemplates, setDeletingTemplates] = useState([0, 0, 0, 2]);
    const [errors, setErrors] = useState({ pageName: '', sections: [] });

    const fileUploadRef = useRef(null);
    const { showError, showSuccess } = useToast();
    const toast = useRef(null);
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const history = useHistory();

    useEffect(() => {
        getDefaultPages();
        if (id) {
            getDefaultComponents(id);
        }
        getDefaultTemplates();
    }, []);

    useEffect(() => {
        if (id && defaultTemplates.length > 0) {
            showConfigPages();
        }
    }, [defaultTemplates]);

    const getDefaultPages = () => {
        API.getDrpData(onGetDefaultPagesResponse, null, true, Constant.DEFAULT_PAGES);
    }

    const onGetDefaultPagesResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data) {
                setDefaultPages(response.data);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getDefaultComponents = data => {
        setIsLoading(true);
        API.getMasterDataById(onGetDefaultComponentsResponse, null, true, data, Constant.DEFAULT_COMPONENTS);
    }

    const onGetDefaultComponentsResponse = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                setDefaultComponents(response.data);
            }
            setIsLoading(false);
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { }
    }

    const getDefaultTemplates = () => {
        API.getMasterList(onGetTemplateListResponse, null, true, Constant.DEFAULT_TEMPLATE_LIST);
    }

    const onGetTemplateListResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data?.original?.data) {
                const responseData = response.data.original.data;
                let _templateData = responseData.map(template => {
                    return {
                        title: template['template_title'],
                        date: template['created_at'],
                        isActive: template['is_active'],
                        id: template['_id']
                    };
                });
                setDefaultTemplates([..._templateData]);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const showConfigPages = () => {
        API.getMasterDataById(onShowConfigPagesResponse, null, true, id, Constant.SHOW_PAGE);
    }

    const onShowConfigPagesResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data) {
                setPageData(response.data);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const checkSectionDeletePossible = (sectionId, sectionIndex) => {
        if (sectionId) {
            API.deleteDocument(
                onCheckSectionDeletePossibleResponse,
                null,
                true,
                sectionId,
                Constant.CHECK_DELETE_SECTION_POSSIBLE
            );
        } else {
            removeSection(sectionIndex);
        }
    }

    const onCheckSectionDeletePossibleResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data?.uuid) {
                const sectionId = response.data.uuid;
                const sectionIndex = sections.findIndex(section => section.id === sectionId);
                if (sectionIndex !== null && sectionIndex !== undefined) {
                    removeSection(sectionIndex);
                }
            }
        },
        error: err => {
            showError(err.meta.message);
        },
        complete: () => { }
    }

    const setPageData = responseData => {
        let _sections = [];
        if (responseData?._id) {
            setPageId(responseData?._id);
        }

        let components = responseData?.default_component;
        let sectionObj = {};
        let componentTemplates = [];
        let _selectedSections = [];

        for (let i = 0; i < components.length; i++) {
            if (components[i]?.default_component_template?.length > 0) {
                sectionObj = {};
                sectionObj['id'] = components[i]._id;
                sectionObj['templates'] = defaultTemplates.map(template => {
                    return {
                        title: template['title'],
                        date: template['date'],
                        isActive: template['isActive'],
                        id: template['id']
                    };
                });

                componentTemplates = components[i]?.default_component_template;

                for (let j = 0; j < componentTemplates.length; j++) {
                    let templateId = componentTemplates[j]?.default_templates?._id;

                    if (templateId) {
                        let templateIndex = sectionObj['templates'].findIndex(template => template.id === templateId);
                        sectionObj['templates'][templateIndex]['obtainedId'] = componentTemplates[j]?._id;
                        sectionObj['templates'][templateIndex]['url'] = componentTemplates[j]?.template_images?.[0]?.path;
                        sectionObj['templates'][templateIndex]['noPicture'] = true;
                        sectionObj['templates'][templateIndex]['documentId'] = componentTemplates[j]?.template_images?.[0]?._id;
                    }
                }
                _sections.push(sectionObj);
            }
        }

        _selectedSections = _sections.map(section => section.id);
        setSelectedSections([..._selectedSections]);
        setSections([..._sections]);
    }

    const onPageChange = data => {
        let _errors = errors;

        _errors['pageId'] = "";

        setPageId(data);
        setErrors({ ..._errors });
        getDefaultComponents(data);
    }

    const setSectionName = (data, sectionIndex) => {
        let _sections = sections;
        let _errors = errors;
        let _selectedSections = [];

        _sections[sectionIndex]['id'] = data;
        if (_errors.sections?.[sectionIndex]?.['id']) {
            delete _errors.sections[sectionIndex]['id'];
        }

        _selectedSections = _sections.map(section => section.id);
        setSelectedSections([..._selectedSections]);
        setSections([..._sections]);
        setErrors({ ..._errors });
    }

    const addSection = e => {
        e.preventDefault();
        if (defaultTemplates.length > 0) {
            let _sections = sections;
            let _errors = errors;

            _sections.push({ id: '', templates: [...defaultTemplates] });
            _errors.sections.push({ id: '', templates: [] });

            if (_errors['sectionRequired']) {
                delete _errors['sectionRequired'];
            }

            setSections([..._sections]);
            setErrors({ ..._errors });
        } else {
            showError("Please add atleast one template first.");
        }
    }

    const removeSection = index => {
        let _sections = sections;
        let _errors = errors;

        const documentIdArray = [];
        for (let i = 0; i < _sections[index].templates.length; i++) {
            if (_sections[index].templates[i]?.documentId) {
                let documentIdObj = {
                    _id: _sections[index].templates[i].documentId
                };
                documentIdArray.push(documentIdObj);
            }
        }

        if (documentIdArray.length > 0) {
            let obj = {
                urlName: ADD_EDIT_BASE_CONFIGURATION,
                name: "all template images associated with the section",
                sectionIndex: index
            };
            setDeletingTemplates([...documentIdArray]);
            setSectionDeleteObj(obj);
            setShowSectionDeleteModal(true);
        } else {
            _sections.splice(index, 1);
            _errors.sections.splice(index, 1);

            setSections([..._sections]);
            setErrors({ ..._errors });
        }

        let _selectedSections = _sections.map(section => section.id);
        setSelectedSections([..._selectedSections]);
    }

    const openImageModal = (sectionIndex, templateIndex) => {
        setSelectedSectionIndex(sectionIndex);
        setSelectedTemplateIndex(templateIndex);
        const node = document.getElementById("template_image_base_" + templateIndex);
        if (node) {
            node.click();
        }
    }

    const onHandleUpload = e => {
        const targetImg = e.target.files[0];

        if (targetImg) {
            const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
            const imgSize = Constant.IMAGE_SIZE;

            if (fileTypes.includes(targetImg.type) === false) {
                if (fileUploadRef.current) {
                    fileUploadRef.current.value = '';
                }
                showError(Constant.IMAGE_ERR);
            } else {
                if ((targetImg.size / 1000) / 1024 < imgSize) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        let _sections = sections;
                        let _errors = errors;

                        _sections[selectedSectionIndex].templates[selectedTemplateIndex] = {
                            ..._sections[selectedSectionIndex].templates[selectedTemplateIndex],
                            imageId: imageIndex,
                            url: e.target.result,
                            noPicture: true,
                            obj: targetImg
                        }

                        if (_errors?.sections?.[selectedSectionIndex]?.['templateImageRequired']) {
                            delete _errors.sections[selectedSectionIndex]['templateImageRequired'];
                        }

                        setImageIndex(imageIndex + 1);
                        setSections(_sections);
                    };
                    reader.readAsDataURL(targetImg);
                } else {
                    showError(Constant.IMAGE_MAX_SIZE);
                    if (fileUploadRef.current) {
                        fileUploadRef.current.value = '';
                    }
                }
            }
        }
    }

    const removeTemplateImg = (sectionIndex, templateIndex) => {
        let _sections = sections;
        const documentId = _sections?.[sectionIndex]?.templates?.[templateIndex]?.documentId;

        if (id && documentId) {
            let obj = {
                _id: documentId,
                name: 'this template image',
                urlName: ADD_EDIT_BASE_CONFIGURATION,
                sectionIndex,
                templateIndex
            };
            setDeleteObj(obj);
            setIsDeleteModalShow(true);
        } else {
            removeUserUploadedImage(sectionIndex, templateIndex);
        }
    }

    const removeUserUploadedImage = (sectionIndex, templateIndex) => {
        let _sections = sections;

        _sections[sectionIndex].templates[templateIndex] = {
            ..._sections[sectionIndex].templates[templateIndex],
            url: null,
            noPicture: false,
            obj: null,
            obtainedId: null
        }
        setSections([..._sections]);
    }

    const checkTemplateImgDeletePossible = (sectionIndex, templateIndex) => {
        let _sections = sections;
        const obtainedId = _sections?.[sectionIndex]?.templates?.[templateIndex]?.obtainedId;

        if (obtainedId) {
            API.deleteDocument(
                onCheckTemplateImgDeleteResponse,
                null,
                true,
                obtainedId,
                Constant.CHECK_DELETE_TEMPLATE_IMG_POSSIBLE
            );
        } else {
            removeUserUploadedImage(sectionIndex, templateIndex);
        }
    }

    const onCheckTemplateImgDeleteResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data?.uuid) {
                const templateId = response.data.uuid;
                let sectionIndex = null;
                let templateIndex = null;

                for (let i = 0; i < sections.length; i++) {
                    for (let j = 0; j < sections[i].templates.length; j++) {
                        if (sections[i].templates[j]?.obtainedId === templateId) {
                            sectionIndex = i;
                            templateIndex = j;
                            break;
                        }
                    }
                }

                if (sectionIndex !== null && templateIndex !== null) {
                    removeTemplateImg(sectionIndex, templateIndex);
                }
            }
        },
        error: err => {
            showError(err.meta.message);
        },
        complete: () => { }
    }

    const onHandleValidation = () => {
        let formIsValid = true;
        let _errors = errors;

        if (!pageId || pageId.length === 0) {
            _errors['pageId'] = "Please select a page.";
            formIsValid = false;
        }

        if (sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                _errors.sections[i] = {};
                if (!sections[i].id || sections[i].id.length === 0) {
                    _errors.sections[i]['id'] = "Please select a section.";
                    formIsValid = false;
                }

                let imageAdded = false;
                _errors.sections[i]['templates'] = [];
                for (let j = 0; j < sections[i].templates.length; j++) {
                    if (sections[i].templates[j].url) {
                        imageAdded = true;
                    }
                }

                if (!imageAdded) {
                    _errors.sections[i]['templateImageRequired'] = "Please add atleast one template image.";
                    formIsValid = false;
                }
            }
        } else {
            _errors['sectionRequired'] = "Please add atleast one section";
            formIsValid = false;
        }

        setErrors({ ..._errors });
        return formIsValid;
    }

    const onSubmit = e => {
        e.preventDefault();
        if (onHandleValidation()) {
            let data = {};
            data['page_id'] = pageId;
            data['page_component'] = [];

            let formData = new FormData();

            for (let i = 0; i < sections.length; i++) {
                let pageComponentObj = {};

                pageComponentObj['component_id'] = sections[i]['id'];
                pageComponentObj['page_template'] = [];

                for (let j = 0; j < sections[i].templates.length; j++) {
                    let pageTemplateObj = {};

                    if (sections?.[i]?.templates?.[j]?.imageId !== undefined) {
                        pageTemplateObj['template_title'] = sections[i]['templates'][j]['title'];
                        pageTemplateObj['template_code'] = sections[i]['templates'][j]['title'];
                        pageTemplateObj['image_seq_id'] = sections[i]['templates'][j]['imageId'];
                        pageTemplateObj['template_id'] = sections[i]['templates'][j]['id'];
                        pageTemplateObj['is_active'] = 1;

                        pageComponentObj['page_template'].push(pageTemplateObj);
                    } else if (sections?.[i]?.templates?.[j]?.obtainedId) {
                        pageTemplateObj['template_id'] = sections[i]['templates'][j]['id'];
                        pageTemplateObj['document_id'] = sections[i]['templates'][j]['documentId'];
                        pageTemplateObj['is_active'] = 1;

                        pageComponentObj['page_template'].push(pageTemplateObj);
                    }
                }

                data['page_component'][i] = pageComponentObj;
            }

            formData.append('data', JSON.stringify(data));

            for (let i = 0; i < sections.length; i++) {
                sections[i]['templates']?.map(file => {
                    if (file.obj) {
                        const imgFile = new File(
                            [file.obj],
                            `template_img_${file.imageId}_${new Date().getTime()}`,
                            { lastModified: new Date().getTime() }
                        );
                        formData.append(`template_images[${file.imageId}]`, imgFile, file.obj.name);
                    }
                });
            }

            setIsLoading(true);
            const url = id ? `${Constant.UPDATE_PAGE}/${id}` : Constant.CREATE_PAGE;
            API.addMaster(onAddMicrositeConfigResponse, formData, true, url);
        }
    }

    const onAddMicrositeConfigResponse = {
        cancel: () => { },
        success: response => {
            if (response.meta.status) {
                setIsLoading(false);
                showSuccess(response.meta.message);
                history.push('/base-configuration');
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { }
    }

    const onCloseDeleteConfirmation = (value, isDelete, message, data) => {
        setIsDeleteModalShow(value);
        if (isDelete) {
            let _sections = sections;
            const { sectionIndex, templateIndex } = data;
            _sections[sectionIndex].templates[templateIndex] = {
                ..._sections[sectionIndex].templates[templateIndex],
                url: null,
                noPicture: false,
                obj: null,
                obtainedId: null
            }
            setSections([..._sections]);
            showSuccess(message);
        }
    }

    const onSectionDeletedConfirmation = (value, isDeleted, message, data) => {
        setShowSectionDeleteModal(value);
        if (isDeleted) {
            const { sectionIndex } = data;
            let _sections = sections;
            let _errors = errors;

            _sections.splice(sectionIndex, 1);
            _errors.sections.splice(sectionIndex, 1);

            setSections([..._sections]);
            setErrors({ ..._errors });
            showSuccess(message);
        }
    }

    const sectionTemplate = (data, indexData) => {
        const sectionIndex = indexData.rowIndex;

        return (
            <div className="container m-0 p-0 mw-100">
                <div className="text-danger position-relative">
                    <CIcon
                        className="mx-2 position-absolute cursor-pointer"
                        style={{ right: '0', top: '5px' }}
                        icon={cilTrash}
                        title="Delete this section"
                        onClick={() => checkSectionDeletePossible(data?.id, sectionIndex)}
                    />
                </div>

                <div className="row mt-3">
                    <div className="col-md-2 mt-1 ml-3">
                        <span className="h5">Section Name</span>
                    </div>

                    <div className="col-md-3">
                        <Dropdown
                            value={data?.id}
                            className="form-control"
                            options={defaultComponents}
                            optionLabel="component_title"
                            optionValue="_id"
                            onChange={e => setSectionName(e.target.value, sectionIndex)}
                            optionDisabled={section => {
                                if (selectedSections.includes(section._id) && section._id !== data?.id) {
                                    return true;
                                }
                            }}
                        />
                        {
                            errors['sections']?.[sectionIndex]?.['id'] && (
                                <span className="text-danger">{errors['sections'][sectionIndex]['id']}</span>
                            )
                        }
                    </div>
                </div>

                <div className="container m-0 p-0 mt-3">
                    <div className="form-control upload-image-wrap multi-upload-image-wrap" id="base-config-profile-container">
                        {
                            data?.templates.map((fileData, templateIndex) => {
                                return (
                                    <div className="profile mb-3" id="base-config-profile" key={templateIndex}>
                                        <div className="profile-wrapper">
                                            <div id="base-config-add-image-profile">
                                                {
                                                    fileData.url ? (
                                                        <>
                                                            <CImage
                                                                src={fileData.url}
                                                                alt="File"
                                                                className="base-config-template-image"
                                                            />
                                                            {
                                                                fileData.noPicture && (
                                                                    <img
                                                                        src={CloseIcon}
                                                                        className="remove-profile"
                                                                        onClick={() => {
                                                                            checkTemplateImgDeletePossible(
                                                                                sectionIndex,
                                                                                templateIndex
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                        </>
                                                    ) : (
                                                        <div className='p-fileupload'>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                ref={fileUploadRef}
                                                                onChange={e => onHandleUpload(e)}
                                                                id={"template_image_base_" + templateIndex}
                                                            />

                                                            <button
                                                                type='button'
                                                                id="base-config-file-upload"
                                                                className='p-button p-fileupload-choose'
                                                                onClick={() => openImageModal(sectionIndex, templateIndex)}
                                                            >
                                                                <span className='p-button-label p-clickable'>
                                                                    <CIcon size="xl" icon={cilCloudUpload} />
                                                                    <p className="mb-0">Add Image</p>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>

                                            <p className="base-config-template-title">{fileData?.title}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {
                            errors['sections']?.[sectionIndex]?.['templateImageRequired'] && (
                                <div className="text-danger">{errors['sections'][sectionIndex]['templateImageRequired']}</div>
                            )
                        }
                    </div>
                </div>
            </div >
        );
    }

    return (
        <div>
            <Toast ref={toast} />
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{CommonMaster.BASE_CONFIGURATION}</h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="row mt-3">
                            <div className="col-md-2 mt-1">
                                <span className="h4">Page Name</span>
                            </div>

                            <div className="col-md-3">
                                <Dropdown
                                    value={pageId}
                                    className="form-control"
                                    options={defaultPages}
                                    optionLabel="page_title"
                                    optionValue="_id"
                                    filter
                                    filterBy="page_title"
                                    disabled={id}
                                    onChange={e => onPageChange(e.target.value)}
                                />
                                {errors['pageId'] && (<span className="text-danger">{errors['pageId']}</span>)}
                            </div>

                            <div className="col-md-7">
                                <button className="btn btn-primary" style={{ float: 'right' }} onClick={e => addSection(e)}>
                                    <CIcon icon={cilPlus} className="mx-1 cursor-pointer" /> Add Section
                                </button>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <DataTable
                                value={sections}
                                className="p-datatable-responsive-demo"
                                id="base-config-table"
                                emptyMessage={null}
                            >
                                <Column field="name" header="Section" body={sectionTemplate}></Column>
                            </DataTable>
                            {errors['sectionRequired'] && (<span className="text-danger">{errors['sectionRequired']}</span>)}
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={e => onSubmit(e)}>
                            <CIcon icon={cilCheck} className="mx-1 cursor-pointer" /> Save
                        </button>
                    </div>
                </div>
            </form>

            <DeleteModal
                visible={isDeleteModalShow}
                onCloseDeleteModal={onCloseDeleteConfirmation}
                deleteObj={deleteObj}
                name="Edit Base Configuration"
                dataName="editBaseConfiguration"
            />

            <DeleteModal
                visible={showSectionDeleteModal}
                onCloseDeleteModal={onSectionDeletedConfirmation}
                deleteObj={sectionDeleteObj}
                deleteDataArr={deletingTemplates}
                deleteEndPoint={Constant.DELETE_MULTIPLE_TEMPLATES}
                dataName={'uuids'}
                name="all template images associated with the section"
            />
        </div>
    );
}

export default AddEditBaseConfig;
