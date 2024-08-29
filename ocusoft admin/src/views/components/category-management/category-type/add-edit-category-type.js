// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import { Column } from 'primereact/column';
import { CBadge } from '@coreui/react'
import { DataTable } from 'primereact/datatable';
import { Permission } from 'src/shared/enum/enum';

import { cilCheckCircle, cilList, cilXCircle, cilBook } from '@coreui/icons';
import Loader from "../../common/loader/loader"
import { useToast } from '../../../../shared/toaster/Toaster';
import permissionHandler from 'src/shared/handler/permission-handler';
import ImageCropModal from "../../../../modal/ImageCropModal";
import { imageDimension } from 'src/shared/constant/image-dimension';

const CategoryTypeAddEdit = () => {
    let history = useHistory();

    const [displayDialog, setDisplayDialog] = useState(false);
    const [uploadingImgType] = useState('');
    const logoWidth = imageDimension.BANNER.width;
    const logoHeight = imageDimension.BANNER.height;

    const [masterForm, setMasterForm] = useState({
        code: '',
        name: '',
        template: '',
        is_active: 1,
        filter: '',
        tag_line: '',
    });
    const [categoryTypeImages, setCategoryTypeImages] = useState({
        desktop: { url: '', noPicture: false, obj: null, uuid: '' },
        mobile: { url: '', noPicture: false, obj: null, uuid: '' },
        logo: { url: '', noPicture: false, obj: null, uuid: '' },
    });

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [filterSequence, setFilterSequence] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();

    useEffect(() => {
        if (id) getCategoryDataById();
    }, []);

    const getCategoryDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.CATEGORY_TYPE_SHOW);
    }

    const getFilterSequenceData = categoryType => {
        if (permissionHandler(Permission.CATEGORY_LIST)) {
            let resObj = { parent_id: categoryType };
            setIsLoading(true);
            API.getMasterList(getFilterSequenceRes, resObj, true, Constant.GETCATEGORY);
        }
    }

    const getFilterSequenceRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                const resValOriginal = response.data.original
                setFilterSequence(resValOriginal?.data)
                setTotalRecords(resValOriginal?.recordsTotal)
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                let resVal = response.data;
                let obj = {
                    name: resVal?.name ?? '',
                    code: resVal?.code ?? '',
                    is_active: resVal?.is_active ?? '',
                    tag_line: resVal?.tag_line ?? '',
                    image: resVal?.category_image ?? '',
                }

                if (resVal?.entity_id) getFilterSequenceData(resVal.entity_id);
                setMasterForm({ ...obj })
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { },
    }

    const setFormImageData = imgData => {
        setDisplayDialog(false);
        setErrors({ ...error, [uploadingImgType]: '' });
        setCategoryTypeImages({
            ...categoryTypeImages,
            [uploadingImgType]: {
                url: imgData.url,
                noPicture: imgData.noPicture,
                obj: imgData.obj
            }
        });
    }

    const tempLateHeader = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    Cateogry Details
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>
        </div>
    );

    const editData = (rowData) => {
        history.push(`/category/edit/?id=${rowData._id}&&type=1`)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {
                    permissionHandler(Permission.CATEGORY_UPDATE) && (
                        <a title="View" className="mr-2" onClick={() => editData(rowData)}>
                            <CIcon icon={cilBook} size="lg" />
                        </a>
                    )
                }
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const categoryNameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData?.category_type?.name ?? Constant.NO_VALUE}
            </React.Fragment>
        )
    }

    const statusBodyTemplate = rowData => {
        const statusIcon = rowData?.is_active === Constant.StatusEnum.active ? cilCheckCircle : cilXCircle;
        const statusClass = rowData?.is_active === Constant.StatusEnum.active ? "text-success" : "text-danger";

        return (
            <button title="Change Status" onClick={e => { e.preventDefault(); }} className={`btn btn-link ${statusClass}`}>
                <CIcon icon={statusIcon} size="lg" />
            </button>
        );
    }

    const onRowReorder = (e) => {
        let obj = { 'uuid': filterSequence[e.dragIndex].uuid, 'newposition': e.dropIndex + 1, 'oldposition': e.dragIndex + 1 }
        setIsLoading(true)

        API.MoveData(moveStatusRes, obj, true, Constant.MOVEFILTER);
    }

    // moveStatusRes Response Data Method
    const moveStatusRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)

                getFilterSequenceData()
                setIsLoading(false)

            }
        },
        error: (error) => {
            showError(error.meta.message)

            setIsLoading(false)

        },
        complete: () => {
        },
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">View Category type</h5>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" maxLength="255" name="name" value={masterForm.name} required />
                                    <label>Name</label>

                                </span>
                                <p className="error">{error['name']}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" maxLength="255" name="code" value={masterForm.code} required />
                                    <label>Code</label>
                                </span>
                                <p className="error">{error['code']}</p>
                            </div>

                            {
                                masterForm.image && (
                                    <div className="col-md-12 mt-2 mb-3">
                                        <h4>Image</h4>
                                        <img src={masterForm.image} width={100} height={100} />
                                    </div>
                                )
                            }
                        </div>

                        {id && permissionHandler(Permission.CATEGORY_LIST) &&
                            <div className="col-md-12 mb-3 d-flex align-items-center custom-checkbox">
                                <div className="datatable-responsive-demo custom-react-table">
                                    <div className="card">
                                        <DataTable value={filterSequence} className="p-datatable-responsive-demo" header={tempLateHeader} showGridlines responsiveLayout="scroll" paginator={filterSequence.length > 0} reorderableColumns onRowReorder={onRowReorder}
                                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                                            currentPageReportTemplate={`Showing {first} to {last} of {totalRecords}`} rows={Constant.DT_ROW} rowsPerPageOptions={Constant.DT_ROWS_LIST}

                                        >
                                            <Column field="name" header="Name" body={nameBodyTemplate}></Column>
                                            <Column field="name" header="Category Type" body={categoryNameBodyTemplate}></Column>
                                            {permissionHandler(Permission.CATEGORY_STATUS) &&
                                                <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                                            }
                                            {(permissionHandler(Permission.CATEGORY_UPDATE) || permissionHandler(Permission.CATEGORY_DELETE)) &&
                                                <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
                                            }
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            displayDialog && (
                                <ImageCropModal
                                    visible={displayDialog}
                                    logoWidth={logoWidth}
                                    logoHeight={logoHeight}
                                    onCloseModal={() => setDisplayDialog(false)}
                                    cropImageData={imageData => setFormImageData(imageData)}
                                />
                            )
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CategoryTypeAddEdit