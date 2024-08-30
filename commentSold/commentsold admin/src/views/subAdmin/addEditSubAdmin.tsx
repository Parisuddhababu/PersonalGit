import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { CreateSubAdmin } from '@type/subAdmin';
import { GET_ROLES_DATA } from '@framework/graphql/queries/role';
import { useMutation, useQuery } from '@apollo/client';
import { DropdownOptionType } from '@type/component';
import { CreateSubAdminRes, RoleDataArr, UpdateSubAdmin } from '@framework/graphql/graphql';
import { CREATE_SUBADMIN, UPDATE_SUBADMIN } from '@framework/graphql/mutations/subAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { GENDER, GENDER_DRP1, ROUTES, STATUS_RADIO, USER_STATUS } from '@config/constant';
import { GET_SUBADMIN_BY_ID } from '@framework/graphql/queries/subAdmin';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';
import { NUMERIC_VALUE } from '@config/regex';
import RadioButton from '@components/radiobutton/radioButton';

const AddEditSubdmin = (): ReactElement => {
	const { refetch: fetchRolesList, loading } = useQuery(GET_ROLES_DATA, { fetchPolicy: 'network-only' });
	const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
	const [createSubAdmin, { loading: createLoader }] = useMutation(CREATE_SUBADMIN);
	const [updateSubAdmin, { loading: updateLoader }] = useMutation(UPDATE_SUBADMIN);
	const navigate = useNavigate();
	const params = useParams();

	const { data: subAdminData, loading: loader } = useQuery(GET_SUBADMIN_BY_ID, {
		variables: { uuid: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const { subAdminValidationSchema } = useValidation();

	/**
	 * Method used for set rol data array for dropdown
	 */
	useEffect(() => {
		fetchRolesList().then((res) => {
			const data = res.data;
			if (data?.fetchRoles?.data?.Roledata) {
				const tempDataArr = [] as DropdownOptionType[];
				data?.fetchRoles?.data?.Roledata.map((data: RoleDataArr) => {
					tempDataArr.push({ name: data.role_name, key: data.uuid });
				});
				setRoleDrpData(tempDataArr);
			}
		});
	}, []);

	/**
	 * Method used for setvalue from subadmin data by id
	 */
	useEffect(() => {
		if (subAdminData && params.id) {
			const data = subAdminData?.fetchSubAdmin?.data;
			let subAdminGender;

            switch (data?.gender) {
                case '1':
                    subAdminGender = GENDER.Male;
                    break;
                case '2':
                    subAdminGender = GENDER.Female;
                    break;
                case '3':
                    subAdminGender = GENDER.Other;
                    break;
                default : 
				    subAdminGender = '';
            }

			formik
				.setValues({
					firstName: data?.first_name,
					lastName: data?.last_name,
					email: data?.email,
					password: data?.password,
					role: data?.RoleData?.uuid,
					phoneNo: data?.phone_number,
					status: data?.status,
					gender: subAdminGender,
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [subAdminData]);

	const initialValues: CreateSubAdmin = {
		role: '',
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		phoneNo: '',
		status: '',
		gender: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: params.id ? subAdminValidationSchema({ params: params.id }) : subAdminValidationSchema({ params: undefined }),
		onSubmit: (values) => {
			if (params.id) {
				updateSubAdmin({
					variables: {
						uuid: params?.id,
						firstName: values?.firstName,
						lastName: values?.lastName,
						role: values?.role,
						gender: values?.gender,
						phoneNumber: values?.phoneNo,
						status: values?.status === '1' ? USER_STATUS.Active : USER_STATUS.Inctive
					},
				})
					.then((res) => {
						const data = res.data as UpdateSubAdmin;
						if (data.updateSubAdmin.meta.statusCode === 200) {
							toast.success(data.updateSubAdmin.meta.message);
							formik.resetForm();
							onCancelSubAdmin();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createSubAdmin({
					variables: {
						firstName: values?.firstName,
						lastName: values?.lastName,
						email: values?.email,
						role: values?.role,
						gender: values?.gender,
						phoneNumber: values?.phoneNo,
						status: values?.status === '1' ? USER_STATUS.Active : USER_STATUS.Inctive,
						password: values?.password
					},
				})
					.then((res) => {
						const data = res.data as CreateSubAdminRes;
						if (data.createSubAdmin.meta.statusCode === 200) {
							toast.success(data.createSubAdmin.meta.message);
							formik.resetForm();
							onCancelSubAdmin();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * Method that redirect to list page
	 */
	const onCancelSubAdmin = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.subAdmin}/${ROUTES.list}`);
	}, []);

	/**
	 * method that handle's password view
	 */
	const handleToggleShowPassword = useCallback(() => {
		setShowPassword((prevState) => !prevState);
	}, []);
	/**
	 * error message handler
	 * @param fieldName
	 * @returns
	 */
	const getErrorSubAdmin = (fieldName: keyof CreateSubAdmin) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	/**
	 * Method that chnages contact number
	 */
	const handleContactNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const input = event.target.value;
		const numericValue = input.replace(NUMERIC_VALUE, '');
		const trimmedNumericValue = numericValue.slice(0, 12);
		formik.setFieldValue('phoneNo', trimmedNumericValue);
	}, []);

	return (
		<div className='card'>
			{(updateLoader || createLoader || loader || loading) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{('Fields marked with')} <span className='error'>*</span> {('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page md:grid-cols-2'>
						<div>
							<TextInput id={'firstName'} onBlur={OnBlur} required={true} placeholder={('First Name')} name='firstName' onChange={formik.handleChange} label={('First Name')} value={formik.values.firstName} error={getErrorSubAdmin('firstName')} />
						</div>
						<div>
							<TextInput id={'lastName'} onBlur={OnBlur} required={true} placeholder={('Last Name')} name='lastName' onChange={formik.handleChange} label={('Last Name')} value={formik.values.lastName} error={getErrorSubAdmin('lastName')} />
						</div>
						<div>
							<TextInput id={'email'} onBlur={OnBlur} required={true} placeholder={('Email')} name='email' onChange={formik.handleChange} label={('Email')} value={formik.values.email} error={getErrorSubAdmin('email')} disabled={!!params.id} />
						</div>
						<div>
							<TextInput id={'phoneNo'} onBlur={OnBlur} type='text' required={true} placeholder={('Mobile Number')} name='phoneNo' onChange={handleContactNumberChange} label={('Mobile Number')} value={formik.values.phoneNo} error={getErrorSubAdmin('phoneNo')} />
						</div>
						{!params.id && <TextInput btnShowHide={showPassword} btnShowHideFun={handleToggleShowPassword} id={'password'} password={true} onBlur={OnBlur} required={true} placeholder={('Password')} name='password' type={showPassword ? 'text' : 'password'} onChange={formik.handleChange} label={('Password')} value={formik.values.password} error={formik.errors.password && formik.touched.password ? formik.errors.password : ''} />}
						<Dropdown placeholder={('-- Select Role --')} required={true} name='role' onChange={formik.handleChange} value={formik.values.role} options={roleDrpData} id='role' label={('Role')} error={formik.errors.role && formik.touched.role ? formik.errors.role : ''} />
						<RadioButton id={'status'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={('Status')} error={getErrorSubAdmin('status')} />
						<RadioButton id={'gender'} required={true} checked={formik.values.gender} onChange={formik.handleChange} name={'gender'} radioOptions={GENDER_DRP1} label={('Gender')} error={getErrorSubAdmin('gender')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={('Cancel')} onClick={onCancelSubAdmin}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditSubdmin;
