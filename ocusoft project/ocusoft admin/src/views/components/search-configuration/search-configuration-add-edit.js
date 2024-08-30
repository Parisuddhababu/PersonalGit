import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useState, useEffect } from "react";
import CIcon from "@coreui/icons-react";
import { InputText } from "primereact/inputtext";
import { cilCheck, cilXCircle, cilPlus, cilTrash } from "@coreui/icons";
import { useHistory } from "react-router-dom";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";

import { API } from "../../../services/Api";
import * as Constant from "../../../shared/constant/constant";
import Loader from "../common/loader/loader";
import { useToast } from "../../../shared/toaster/Toaster";
import { uuid } from "src/shared/handler/common-handler";

const SearchConfigurationAddEdit = () => {
	let history = useHistory();
	const { showError, showSuccess } = useToast();
	const accountId = localStorage.getItem("account_id");
	const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
	const unitPopularSearch = { name: '', link: '', active: true };

	const [errors, setErrors] = useState({});
	const [accountData, setAccountData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [masterForm, setMasterForm] = useState({ popularSearch: [unitPopularSearch], account: '' });

	useEffect(() => {
		getAccountData();
	}, []);

	useEffect(() => {
		setMasterForm({ ...masterForm, ["account"]: accountId });
	}, [accountData]);

	useEffect(() => {
		if (masterForm.account) getSearchConfigurationById(masterForm.account);
	}, [masterForm.account]);

	const getSearchConfigResponse = {
		cancel: () => { },
		success: response => {
			setIsLoading(false);
			setErrors({});

			if (response?.meta?.status && response.data) {
				let responseData = response.data;
				let _popularSearch = [];

				if (responseData?.popular_search?.length) {
					_popularSearch = responseData.popular_search.map(searchObj => {
						return {
							name: searchObj.name,
							link: searchObj.link,
							active: searchObj.is_active == 1 ? true : false,
						};
					});
				} else {
					_popularSearch.push(unitPopularSearch);
				}

				setMasterForm({ ...masterForm, popularSearch: _popularSearch });
			}
		},
		error: err => {
			setIsLoading(false);
			if (err?.meta?.message) showError(err.meta.message);
		},
		complete: () => { },
	};

	const getSearchConfigurationById = id => {
		setIsLoading(true);
		API.getMasterDataById(getSearchConfigResponse, null, true, id, Constant.POPULAR_SEARCH_BY_ID);
	};

	const handleAccountChange = e => {
		setMasterForm({ ...masterForm, ["account"]: e.target.value });
		setErrors({ ...errors, account: '' });
	};

	const getAccountData = () => {
		API.getAccountDataByLoginId(getAccountDataResponse, null, true);
	};

	const getAccountDataResponse = {
		cancel: () => { },
		success: (response) => {
			if (response.meta.status_code === 200) {
				let resVal = response.data;
				setAccountData(resVal);
			}
		},
		error: (error) => { },
		complete: () => { },
	};

	const handleValidation = () => {
		let formIsValid = true, _errors = {};

		if (!masterForm.account) {
			_errors["account"] = "account is required.";
			formIsValid = false;
		}

		const _popularSearch = masterForm.popularSearch;

		_errors["popularSearch"] = [];
		for (let i = 0; i < _popularSearch.length; i++) {
			const searchObj = _popularSearch[i];
			_errors["popularSearch"][i] = {};

			if (!searchObj.name) {
				_errors["popularSearch"][i]["name"] = "name feild is required.";
				formIsValid = false;
			}

			if (!searchObj.link) {
				_errors["popularSearch"][i]["link"] = "link feild is required.";
				formIsValid = false;
			}
		}

		setErrors({ ..._errors });
		return formIsValid;
	}

	const handlePopularSearchInputChange = (searchIndex, searchKey, searchValue) => {
		const _popularSearch = masterForm.popularSearch;
		_popularSearch[searchIndex][searchKey] = searchValue;
		setMasterForm({ ...masterForm, popularSearch: _popularSearch });
	}

	const handleCancelAction = e => {
		e.preventDefault();
		history.push("/dashboard");
	};

	const updateSearchConfigResponse = {
		cancel: () => { },
		success: response => {
			setIsLoading(false);
			if (response?.meta?.status) {
				if (response?.meta?.message) showSuccess(response.meta.message);
			}
		},
		error: err => {
			setIsLoading(false);
			if (err.errors) {
				Object.values(err.errors).map(errMessage => {
					showError(errMessage);
				});
			} else if (err?.meta?.message) {
				showError(err.meta.message);
			}
		},
		complete: () => { },
	};

	const handleSubmit = e => {
		e.preventDefault();

		if (handleValidation()) {
			const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');

			let formData = new FormData();
			formData.append("account_id", _accountId);

			for (let i = 0; i < masterForm.popularSearch.length; i++) {
				formData.append(`popular_search[${i}][name]`, masterForm.popularSearch[i].name);
				formData.append(`popular_search[${i}][link]`, masterForm.popularSearch[i].link);
				formData.append(
					`popular_search[${i}][is_active]`,
					masterForm.popularSearch[i].active ? 1 : 0
				);
			}

			setIsLoading(true);
			API.addMaster(updateSearchConfigResponse, formData, true, Constant.POPULAR_SEARCH_CREATE);
		}
	};

	const addPopuplarSearch = () => {
		const _popularSearch = masterForm.popularSearch;
		_popularSearch.push({ name: '', link: '', active: 1 });
		setMasterForm({ ...masterForm, popularSearch: _popularSearch });
	};

	const handleDeletePopularSearch = index => {
		const _popularSearch = masterForm.popularSearch;
		_popularSearch.splice(index, 1);
		setMasterForm({ ...masterForm, popularSearch: _popularSearch });
	};

	const accountDataTemplate = option => {
		return (
			<>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
		)
	}

	return (
		<div>
			{isLoading && <Loader />}

			<form name="subMasterFrm" noValidate>
				<div className="card">
					<div className="card-header">
						<h5 className="card-title">Search Configurations</h5>
					</div>

					<div className="card-body">
						<p className="col-sm-12 text-right">
							Fields marked with <span className="text-danger">*</span> are mandatory.
						</p>
						{
							adminRole === "SUPER_ADMIN" && (
								<div className="row">
									<div className="col-md-6 mb-3">
										<span className="p-float-label custom-p-float-label">
											<Dropdown
												value={masterForm.account}
												className="form-control"
												options={accountData}
												onChange={handleAccountChange}
												itemTemplate={accountDataTemplate}
												valueTemplate={accountDataTemplate}
												optionLabel="company_name"
												optionValue="_id"
												filter
												filterBy="company_name,code"
											/>
											<label>
												HCP<span className="text-danger">*</span>
											</label>
										</span>
										<p className="error">{errors["account"]}</p>
									</div>
								</div>
							)
						}

						{
							masterForm?.popularSearch?.map((searchObj, searchIndex) => {
								const popularSearchLength = masterForm.popularSearch.length;

								return (
									<div className="row" key={uuid()}>
										<div className="col-md-4 mb-3">
											<span className="p-float-label custom-p-float-label display-count">
												<InputText
													className="form-control"
													name={"name_" + searchIndex}
													value={searchObj.name}
													onChange={e =>
														handlePopularSearchInputChange(
															searchIndex,
															"name",
															e.target.value
														)
													}
												/>

												<label>Name <span className="text-danger">*</span></label>
											</span>

											<p className="error">
												{errors?.["popularSearch"]?.[searchIndex]?.["name"] ?? ''}
											</p>
										</div>

										<div className="col-md-4 mb-3">
											<span className="p-float-label custom-p-float-label display-count">
												<InputText
													className="form-control"
													name={"link_" + searchIndex}
													value={searchObj.link}
													onChange={e =>
														handlePopularSearchInputChange(
															searchIndex,
															"link",
															e.target.value
														)
													}
												/>

												<label>Link <span className="text-danger">*</span></label>
											</span>

											<p className="error">
												{errors?.["popularSearch"]?.[searchIndex]?.["link"] ?? ''}
											</p>
										</div>

										<div className="col-md-2 mb-3">
											<label className="mr-2" style={{ fontSize: "10px" }}>Status</label>
											<div className="row">
												<div className="col-md-6">
													<label style={{ fontSize: "15px" }}>Active</label>

													<RadioButton
														value={searchObj.active}
														checked={searchObj.active}
														name={`search_${searchIndex}}`}
														style={{ marginLeft: "40px" }}
														onChange={e => {
															handlePopularSearchInputChange(
																searchIndex,
																"active",
																e.target.checked
															)
														}}
													/>
												</div>

												<div className="col-md-6">
													<label style={{ fontSize: "15px" }}>Inactive</label>

													<RadioButton
														value={!searchObj.active}
														checked={!searchObj.active}
														name={`search_${searchIndex}`}
														style={{ marginLeft: "26px" }}
														onChange={e => {
															handlePopularSearchInputChange(
																searchIndex,
																"active",
																!e.target.checked
															)
														}}
													/>
												</div>
											</div>
										</div>

										<div className="col-md-2">
											<div style={{ textAlign: "center", marginTop: "10%" }}>
												{
													searchIndex === popularSearchLength - 1 &&
													popularSearchLength < 5 && (
														<a
															title="Add"
															className="mr-2 cursor-pointer"
															onClick={addPopuplarSearch}
														>
															<CIcon icon={cilPlus} size="lg" />
														</a>
													)
												}
												{
													searchIndex > 0 && (
														<button
															type="button"
															className="btn btn-link mr-2 text-danger"
															title="Delete"
															onClick={() => handleDeletePopularSearch(searchIndex)}
														>
															<CIcon icon={cilTrash} size="lg" />
														</button>
													)
												}
											</div>
										</div>
									</div>
								);
							})}
					</div>

					<div className="card-footer">
						<button
							className="btn btn-primary mb-2 mr-2"
							onClick={e => { handleSubmit(e); }}
						>
							<CIcon icon={cilCheck} className="mr-1" /> Save
						</button>

						<button
							className="btn btn-danger mb-2"
							onClick={e => { handleCancelAction(e) }}
						>
							<CIcon icon={cilXCircle} className="mr-1" /> Cancel
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SearchConfigurationAddEdit;
