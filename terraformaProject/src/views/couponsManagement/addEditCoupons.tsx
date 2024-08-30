import { useMutation, useQuery } from '@apollo/client';
import { DATE_FORMAT, ROUTES } from '@config/constant';
import { CreateCoupon, GetSingleCoupon, UpdateCoupon, UserData, CoponUserData } from '@framework/graphql/graphql';
import { CREATE_COUPON, UPDATE_COUPON } from '@framework/graphql/mutations/couponManagement';
import { GET_COUPON_BY_ID } from '@framework/graphql/queries/couponManagement';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateUpdateCouponProps, UsersDataStructureType } from 'src/types/couponManagement';
import useValidation from '@framework/hooks/validations';
import { useFormik } from 'formik';
import TextInput from '@components/textInput/TextInput';
import { GET_USERS_LIST } from '@framework/graphql/queries/user';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButtonNew from '@components/radiobutton/radioButtonNew';
import { getDateFormat, whiteSpaceRemover } from '@utils/helpers';
import moment from 'moment';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
const AddEditCoupons = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const CouponId = useParams();
	const { data: userData } = useQuery(GET_USERS_LIST);
	const { data: CouponData, refetch } = useQuery(GET_COUPON_BY_ID);
	const [createCoupon] = useMutation(CREATE_COUPON);
	const [updateCoupon] = useMutation(UPDATE_COUPON);
	const { addCoupenValidationSchema } = useValidation();
	const initialValues: CreateUpdateCouponProps = {
		couponName: '',
		couponCode: '',
		startTime: '',
		expireTime: '',
		percentage: 0,
		radio: '',
		couponType: '0',
		isReusable: '',
		applicable: '',
	};
	const [options, setOptions] = useState<UsersDataStructureType[]>([]);
	const [selected, setSelected] = useState<UsersDataStructureType[]>([]);
	/**
	 * Method used for get coupon api with id
	 */
	useEffect(() => {
		if (CouponId?.id) {
			refetch({ getSingleCouponId: parseInt(CouponId.id) }).catch((err) => {
				toast.error(err);
			});
		}
	}, [CouponId?.id]);
	//update coupon function
	function UpdateCoupon(variables: CreateUpdateCouponProps, id: number) {
		if (selected.length !== 0) {
			updateCoupon({
				variables: {
					updateCouponId: id,
					...variables,
				},
			})
				.then((res) => {
					const data = res.data as UpdateCoupon;
					if (data.updateCoupon.meta.statusCode === 200) {
						toast.success(data.updateCoupon.meta.message);

						navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/list`);
						formik.resetForm();
						onCancel();
					} else {
						toast.error(data.updateCoupon.meta.message);
					}
				})
				.catch(() => {
					toast.error(t('Failed to update'));
				});
		}
	}
	// create coupon function
	function CreateCoupon(variables: CreateUpdateCouponProps) {
		if (selected.length !== 0) {
			createCoupon({
				variables: {
					...variables,
					createdBy: 1,
				},
			})
				.then((res) => {
					const data = res.data as CreateCoupon;
					if (data.createCoupon.meta.statusCode === 200 || data.createCoupon.meta.statusCode === 201) {
						toast.success(data.createCoupon.meta.message);
						navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/list`);
						formik.resetForm();
					} else {
						toast.error(data.createCoupon.meta.message);
					}
				})
				.catch(() => {
					toast.error(t('Failed to create'));
				});
		}
	}
	/**setCouponType
	 * Method used for setvalue from coupon data by id selectedUsers
	 */
	useEffect(() => {
		if (CouponData?.getSingleCoupon && CouponId.id) {
			const data = CouponData?.getSingleCoupon?.data as GetSingleCoupon;
			setSelected(
				data?.userList.map((i: UserData) => {
					return { name: i.first_name, code: i.id };
				})
			);
			formik
				.setValues({
					couponName: data?.coupon?.coupon_name,
					couponCode: data?.coupon?.coupon_code,
					startTime: getDateFormat(data?.coupon?.start_time, DATE_FORMAT.simpleDateFormat),
					expireTime: getDateFormat(data?.coupon?.expire_time, DATE_FORMAT.simpleDateFormat),
					percentage: data?.coupon?.percentage,
					couponType: JSON.stringify(data?.coupon?.coupon_type),
					isReusable: JSON.stringify(data?.coupon?.is_reusable),
					applicable: JSON.stringify(data?.coupon?.applicable),
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [CouponData?.getSingleCoupon]);

	const formik = useFormik({
		initialValues,
		validationSchema: addCoupenValidationSchema,
		onSubmit: (values) => {
			const variables = {
				couponName: values.couponName,
				couponCode: values.couponCode,
				couponType: values.couponType === '0' ? 0 : 1,
				startTime: values.startTime,
				expireTime: values.expireTime,
				percentage: values.percentage,
				applicable: values.applicable === '0' ? 0 : 1,
				selectedUsers: selected.map((i) => i.code),
				isReusable: values.isReusable === '0' ? 0 : 1,
			};

			CouponId.id ? UpdateCoupon(variables, +CouponId.id) : CreateCoupon(variables);
		},
	});
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/list`);
	}, []);

	useEffect(() => {
		if (userData?.getUsers) {
			const data = userData?.getUsers?.data as CoponUserData;
			setOptions(
				data?.userList.map((i: UserData) => {
					return { name: i.first_name, code: i.id };
				})
			);
		}
		if (formik.values.applicable === '0' && userData?.getUsers) {
			const data = userData?.getUsers?.data as CoponUserData;
			setSelected(
				data?.userList.map((i: UserData) => {
					return { name: i.first_name, code: i.id };
				})
			);
		}
	}, [formik.values.applicable]);

	const getErrorCoupon = (fieldName: keyof CreateUpdateCouponProps) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	const OnChangeCpnAdEd = useCallback(
		(e: MultiSelectChangeEvent) => {
			setSelected(e.value);
		},
		[setSelected]
	);
	const OnBlurCpn = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div>
			<div className='w-full '>
				<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
					<form className='bg-white shadow-md rounded  pt-6 mb-4 border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
						<div className='flex justify-end pr-8 pb-2'>
							<p>
								{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<div className='grid grid-cols-1 px-8 md:grid-cols-2  gap-4'>
							<div>
								<TextInput required={true} placeholder={t('Offer Name')} name='couponName' onChange={formik.handleChange} onBlur={OnBlurCpn} label={t('Offer Name')} value={formik.values.couponName} error={getErrorCoupon('couponName')} />
							</div>
							<div>
								<TextInput required={true} placeholder={t('Offer Code')} name='couponCode' onChange={formik.handleChange} onBlur={OnBlurCpn} label={t('Offer Code')} value={formik.values.couponCode} error={getErrorCoupon('couponCode')} />
							</div>
							<div>
								<RadioButtonNew
									id={'couponType'}
									checked={formik.values.couponType}
									onChange={formik.handleChange}
									name={'couponType'}
									radioOptions={[
										{ name: t('Percentage'), key: 0 },
										{ name: t('Amount'), key: 1 },
									]}
									label={t('Type')}
									required={true}
									error={formik.errors.couponType && formik.touched.couponType ? formik.errors.couponType : ''}
								/>
							</div>
							<div>
								<TextInput type='number' placeholder={t('Value')} name='percentage' onChange={formik.handleChange} label={formik.values.couponType === '0' ? `${t('Value')}(%)` : t('Value')} value={formik.values.percentage} error={getErrorCoupon('percentage')} />
							</div>

							<div>
								<TextInput required={true} type='date' placeholder={t('start Date')} name='startTime' onChange={formik.handleChange} label={t('Start Date')} value={formik.values.startTime} error={getErrorCoupon('startTime')} min={CouponId.id ? formik.values.startTime : moment().format(DATE_FORMAT.simpleDateFormat)} disabled={!!CouponId.id} />
							</div>
							<div>
								<TextInput required={true} type='date' placeholder={t('End Date')} disabled={!formik.values.startTime} name='expireTime' onChange={formik.handleChange} label={t('End Date')} value={formik.values.expireTime} error={formik.values.startTime && getErrorCoupon('expireTime')} min={formik.values.startTime} />
							</div>
							<div className='mb-4'>
								<RadioButtonNew
									id='isReusable'
									required={true}
									checked={formik.values.isReusable === '' ? '2' : formik.values.isReusable}
									onChange={formik.handleChange}
									name={'isReusable'}
									radioOptions={[
										{ name: t('One Time'), key: 0 },
										{ name: t('Multiple Time'), key: 1 },
									]}
									label={t('Usage')}
									error={getErrorCoupon('isReusable')}
								/>
							</div>
							<div>
								<RadioButtonNew
									id='applicable'
									required={true}
									checked={formik.values.applicable === '' ? '2' : formik.values.applicable}
									onChange={formik.handleChange}
									name={'applicable'}
									radioOptions={[
										{ name: t('All'), key: 0 },
										{ name: t('Selected users'), key: 1 },
									]}
									label={t('Applicable')}
									error={getErrorCoupon('applicable')}
								/>
							</div>

							{formik.values.applicable === '1' && (
								<div className='mb-4'>
									<label htmlFor='selectedUsers' className='ml-1 text-gray-700'>
										{t('Selected users')} <span className='text-red-500  '>*</span>
									</label>
									<div className='mt-3'>
										<MultiSelect value={selected} onChange={OnChangeCpnAdEd} options={options} optionLabel='name' display='chip' placeholder={`${t('Select user')}`} maxSelectedLabels={3} className='w-full md:w-20rem ' />
									</div>
									{formik.values.applicable === '1' && formik.touched.applicable && selected?.length === 0 && <p className='text-red-500'>{t('Please select alteast one user')}</p>}
								</div>
							)}
						</div>
						<div className='btn-group col-span-3 flex items-center py-3 px-5 justify-start bg-slate-100   border border-[#c8ced3]'>
							<Button className='btn-primary btn-normal' type='submit' label={CouponId?.id ? t('Update') : t('Save')} 
							title={`${CouponId?.id ? t('Update') : t('Save')}`} >
								<CheckCircle className='mr-1 text-white ' />
							</Button>
							<Button className='btn-warning btn-normal' label={t('Cancel')} onClick={onCancel} title={`${t('Cancel')}`} >
								<Cross className='mr-1 fill-white' />
							</Button>
						</div>
					</form>
				</WithTranslateFormErrors>
			</div>
		</div>
	);
};
export default AddEditCoupons;
