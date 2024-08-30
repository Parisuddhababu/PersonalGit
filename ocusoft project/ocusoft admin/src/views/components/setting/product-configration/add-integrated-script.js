// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { API } from '../../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import Loader from "../../common/loader/loader"
import { cilPlus, cilTrash, cilCheck } from '@coreui/icons';

import * as Constant from "../../../../shared/constant/constant"
import { useToast } from '../../../../shared/toaster/Toaster';
import { uuid } from 'src/shared/handler/common-handler';

const AddIntegratedScript = ({ accountData }) => {
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;
    const primaryAccountId = localStorage.getItem("account_id");
    const { showError, showSuccess } = useToast();
    const unitScript = { id: '', script: '', value: '', position: 1 };
    const loadPositionOptions = [
        { id: 1, position: "Header" },
        { id: 2, position: "Body" },
        { id: 3, position: "Footer" }
    ];

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [scripts, setScripts] = useState([unitScript]);
    const [selectedAccount, setSelectedAccount] = useState('');

    useEffect(() => {
        if (selectedAccount) getIntegratedScriptByAccount();
    }, [selectedAccount]);

    const getIntegratedScriptByAccount = () => {
        setIsLoading(true);
        API.getMasterDataById(getIntegratedScriptsResponse, '', true, selectedAccount, Constant.SHOW_INTEGRATED_SCRIPT);
    }

    const getIntegratedScriptsResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            let _scripts = [];

            if (response?.meta?.status) {
                const responseData = response.data;
                if (responseData?.available_scripts?.length) {
                    const responseScripts = responseData.available_scripts;
                    _scripts = responseScripts.map(scriptObj => {
                        return {
                            id: uuid(),
                            script: scriptObj.script_name ?? '',
                            value: scriptObj.script_value ?? '',
                            position: scriptObj.script_load_at ?? '',
                        };
                    });
                }
            }

            _scripts = _scripts.length > 0 ? _scripts : [unitScript];
            setScripts([..._scripts]);
            setErrors([]);
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
            setScripts([unitScript]);
            setErrors([]);
        },
        complete: () => { },
    }

    const handleAccountChange = value => {
        setSelectedAccount(value);
    }

    const handleValidation = () => {
        let _errors = [];
        let formIsValid = true;

        for (let i = 0; i < scripts.length; i++) {
            const scriptObj = scripts[i];
            _errors[i] = {};

            if (!scriptObj.script) {
                formIsValid = false;
                _errors[i]["script"] = "Script is required.";
            }

            if (!scriptObj.value) {
                formIsValid = false;
                _errors[i]["value"] = "Value is required.";
            }

            if (!scriptObj.position) {
                formIsValid = false;
                _errors[i]["position"] = "Script loading positon is required.";
            }
        }

        setErrors([..._errors]);
        return formIsValid;
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (handleValidation()) {
            const _accountId = (adminRole === 'SUPER_ADMIN') ? selectedAccount : primaryAccountId;
            const data = { account_id: _accountId, available_scripts: [] };

            scripts.forEach(scriptObj => {
                const _scriptObj = {
                    script_name: scriptObj.script,
                    script_value: scriptObj.value,
                    script_load_at: scriptObj.position,
                };

                data["available_scripts"].push(_scriptObj);
            });

            setIsLoading(true);
            API.addMaster(addEditIntegratedScriptResponse, data, true, Constant.INTEGRATED_SCRIPT);
        }
    }

    const addEditIntegratedScriptResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) showSuccess(response.meta.message);
            getIntegratedScriptByAccount();
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const addScriptObj = () => {
        let _scripts = scripts;
        _scripts.push({ ...unitScript, id: uuid() });
        setScripts([..._scripts]);
    }

    const deleteScriptObj = scriptIndex => {
        let _scripts = scripts;
        _scripts.splice(scriptIndex, 1);
        setScripts([..._scripts]);
    }

    const handleScriptChange = (scriptIndex, scriptKey, value) => {
        let _scripts = scripts;
        let _errors = errors;

        _scripts[scriptIndex][scriptKey] = value;
        setScripts([..._scripts]);

        if (_errors?.[scriptIndex]?.[scriptKey]) _errors[scriptIndex][scriptKey] = '';

        setErrors([..._errors]);
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div>
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Integrated Script</h5>
                        </div>
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-xl-12'>
                                    {
                                        adminRole === 'SUPER_ADMIN' && (
                                            <div className="col-md-4 mb-3">
                                                <span className="p-float-label custom-p-float-label">
                                                    <Dropdown
                                                        value={selectedAccount}
                                                        className="form-control"
                                                        options={accountData}
                                                        onChange={e => handleAccountChange(e.target.value)}
                                                        itemTemplate={accountDataTemplate}
                                                        valueTemplate={accountDataTemplate}
                                                        optionLabel="company_name"
                                                        optionValue="_id"
                                                        filter
                                                        filterBy="company_name,code"
                                                    />
                                                    <label>HCP</label>
                                                </span>
                                            </div>
                                        )
                                    }

                                    <fieldset className="fieldset">
                                        <legend className="legend">Integrated Scripts</legend>
                                        {
                                            scripts.map((scriptObj, scriptIndex) => {
                                                return (
                                                    <div className="row" key={scriptObj.id}>
                                                        <div className="col-md-3 mb-3">
                                                            <span className="p-float-label custom-p-float-label">
                                                                <InputText
                                                                    className={"form-control"}
                                                                    value={scriptObj.script}
                                                                    onChange={e => {
                                                                        handleScriptChange(
                                                                            scriptIndex,
                                                                            "script",
                                                                            e.target.value
                                                                        )
                                                                    }}
                                                                />
                                                                <label>Script<span className="text-danger">*</span></label>
                                                            </span>
                                                            <p className="error">{errors?.[scriptIndex]?.script ?? ''}</p>
                                                        </div>

                                                        <div className="col-md-3 mb-3">
                                                            <span className="p-float-label custom-p-float-label">
                                                                <Dropdown
                                                                    value={scriptObj.position}
                                                                    className={"form-control"}
                                                                    options={loadPositionOptions}
                                                                    optionLabel={"position"}
                                                                    optionValue={"id"}
                                                                    onChange={e => {
                                                                        handleScriptChange(
                                                                            scriptIndex,
                                                                            "position",
                                                                            e.target.value
                                                                        )
                                                                    }}
                                                                />

                                                                <label>
                                                                    Load script in<span className="text-danger">*</span>
                                                                </label>
                                                            </span>

                                                            <p className="error">{errors?.[scriptIndex]?.position ?? ''}</p>
                                                        </div>

                                                        <div className="col-md-5 mb-3">
                                                            <span className="p-float-label custom-p-float-label">
                                                                <InputText
                                                                    className={"form-control"}
                                                                    value={scriptObj.value}
                                                                    onChange={e => {
                                                                        handleScriptChange(
                                                                            scriptIndex,
                                                                            "value",
                                                                            e.target.value
                                                                        )
                                                                    }}
                                                                />
                                                                <label>Value<span className="text-danger">*</span></label>
                                                            </span>
                                                            <p className="error">{errors?.[scriptIndex]?.value ?? ''}</p>
                                                        </div>

                                                        <div className="col-md-1 pt-2">
                                                            {
                                                                scriptIndex == 0 ? (
                                                                    <CIcon
                                                                        icon={cilPlus}
                                                                        title="Add script"
                                                                        onClick={() => addScriptObj()}
                                                                        className="text-primary cursor-pointer"
                                                                    />
                                                                ) : (
                                                                    <CIcon
                                                                        icon={cilTrash}
                                                                        title="Delete script"
                                                                        onClick={() => deleteScriptObj(scriptIndex)}
                                                                        className="text-danger cursor-pointer"
                                                                    />
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={e => handleSubmit(e)}>
                            <CIcon icon={cilCheck} className="mr-1" />Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddIntegratedScript
