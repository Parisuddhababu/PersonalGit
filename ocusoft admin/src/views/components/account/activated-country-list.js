import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CIcon from '@coreui/icons-react';
import { cilCheck } from '@coreui/icons';

import { API } from "src/services/Api";
import * as Constant from "../../../shared/constant/constant"
import Loader from '../common/loader/loader';
import { useToast } from 'src/shared/toaster/Toaster';
import { MultiSelect } from 'primereact/multiselect';

const ActivatedCountryList = () => {
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const { showSuccess, showError } = useToast();

    const [countryList, setCountryList] = useState([]);
    const [allCountryList, setAllCountryList] = useState([]);
    const [selectedCountryList, setSelectedCountryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCountryList();
        getAllCountryList();
    }, []);

    const getCountryList = () => {
        if (id) {
            const data = { account_id: id };
            API.getMasterList(onGetCountryListResponse, data, true, Constant.ACCOUNT_COUNTRY_LIST);
        }
    }

    const onGetCountryListResponse = {
        cancel: () => { },
        success: response => {
            let _countryList = [];
            let _selectedCountryList = [];

            if (response?.meta?.status && response?.data?.length > 0) {
                _countryList = response.data;
                _selectedCountryList = response.data.map(country => country.country_id);

                _countryList.sort((countryObj1, countryObj2) => {
                    let sorting1 = +countryObj1.sorting;
                    let sorting2 = +countryObj2.sorting;

                    if (sorting1 < sorting2) return -1;
                    if (sorting1 > sorting2) return 1;
                    return 0;
                });
            }

            setCountryList([..._countryList]);
            setSelectedCountryList([..._selectedCountryList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getAllCountryList = () => {
        API.getDrpData(onGetAllCountryListResponse, null, true, Constant.COUNTRY_LIST_ACTIVE);
    }

    const onGetAllCountryListResponse = {
        cancel: () => { },
        success: response => {
            let _allCountryList = [];
            if (response?.meta?.status && response?.data?.length > 0) {
                _allCountryList = response.data;
            }

            setAllCountryList([..._allCountryList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const onRowReorder = e => {
        let obj = {
            uuid: countryList[e.dragIndex]._id,
            newposition: e.dropIndex + 1,
            oldposition: e.dragIndex + 1
        };
        setIsLoading(true);

        API.MoveData(moveCountryResponse, obj, true, Constant.SORT_ACCOUNT_COUNTRY_LIST);
    }

    const moveCountryResponse = {
        cancel: () => {
            setIsLoading(false);
        },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                showSuccess(response.meta.message);
                getCountryList();
            }
        },
        error: (error) => {
            showError(error.meta.message);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const handleCountryChange = countryIdList => {
        setSelectedCountryList(countryIdList);
    }

    const nameBodyTemplate = rowData => {
        return (
            <>{rowData?.country?.name ?? rowData?.name ?? ''}</>
        )
    }

    const onSubmit = e => {
        e.preventDefault();
        if (selectedCountryList?.length > 0) {
            const data = { account_id: id, country_id: [ ...selectedCountryList ] };
            API.addMaster(addCountryResponse, data, true, Constant.CREATE_ACCOUNT_COUNTRY);
        }
    }

    const addCountryResponse = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                showSuccess(response.meta.message);
                getCountryList();
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="container">
                <div className="row">
                    <div className="col-md-10">
                        <MultiSelect
                            value={selectedCountryList}
                            options={allCountryList}
                            onChange={e => handleCountryChange(e.value)}
                            optionLabel={"name"}
                            optionValue={"_id"}
                            className={"form-control"}
                            placeholder={"Select countries"}
                            filter
                            filterBy={"name"}
                        />
                    </div>

                    <div className="col-md-2">
                        <button
                            className="btn btn-primary mb-2 mr-2"
                            disabled={allCountryList.length === 0 || selectedCountryList.length === 0}
                            onClick={e => onSubmit(e)}
                        >
                            <CIcon icon={cilCheck} /> Save
                        </button>
                    </div>
                </div>

                <div className="row mt-4 d-flex justify-content-center">
                    <DataTable
                        value={countryList}
                        stripedRows
                        className="p-datatable-responsive-demo w-50"
                        showGridlines
                        responsiveLayout="scroll"
                        reorderableColumns
                        onRowReorder={onRowReorder}
                    >
                        <Column rowReorder style={{ width: '3em' }} />
                        <Column field="name" header="Name" body={nameBodyTemplate} />
                    </DataTable>
                </div>
            </div>
        </>
    )
}

export default ActivatedCountryList;
