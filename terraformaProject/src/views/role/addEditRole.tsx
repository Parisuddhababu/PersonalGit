import React, { useCallback, useEffect, useState } from 'react';
import { RoleEditProps, RoleInput } from 'src/types/role';
import { useFormik } from 'formik';
import TextInput from '@components/textInput/TextInput';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { CREATE_ROLE, UPDATE_ROLE } from '@framework/graphql/mutations/role';
import { useMutation } from '@apollo/client';
import { RoleCreateRes, UpdateRoleDataType } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import { Cross } from '@components/icons/icons';
import useValidation from '@framework/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
const AddEditRole = ({ isRoleModelShow, onSubmitRole, onClose, roleVal, isRoleEditable, roleObj }: RoleEditProps) => {
	const { t } = useTranslation();
	const [updateRoleData, updateLoading] = useMutation(UPDATE_ROLE);
	const [createRoleData, loading] = useMutation(CREATE_ROLE);

	const initialValues: RoleInput = {
		role: roleVal || '',
	};

	const { addRoleValidationSchema } = useValidation();
	const formik = useFormik({
		initialValues,
		validationSchema: addRoleValidationSchema,
		onSubmit: (values) => {
			if (isRoleEditable) {
				UpdateRoleDataVal(values);
			} else {
				createRole(values);
			}
		},
	});

	/**
	 *
	 * @param values Method used for create role API
	 */
	const createRole = (values: RoleInput) => {
		createRoleData({
			variables: { roleData: {
				description: values.role,
				name: values.role,
			}},
		})
			.then((res) => {
				const data = res.data as RoleCreateRes;
				toast.success(data.createRole.message);
				onSubmitRole();
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message);
			});
	};

	/**
	 *
	 * @param values Method used for update role
	 */
	const UpdateRoleDataVal = (values: RoleInput) => {
		updateRoleData({
			variables: {
				roleData: {
					name: values.role,
					description: values.role,
				},
				roleId: roleObj.uuid,
			},
		})
			.then((res) => {
				const data = res.data as UpdateRoleDataType;
				toast.success(data.updateRole.message);
				onSubmitRole();
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message);
			});
	};
	const [addClass, setAddClass] = useState(false);

	useEffect(() => {
		if (isRoleModelShow) {
			setTimeout(() => {
				setAddClass(true);
			}, 100);
		}
	}, [isRoleModelShow]);
	const OnBlurRole = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal ${isRoleModelShow ? '' : 'hidden'}`}>
			<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
				<div className='w-full mx-5 sm:max-w-[780px]'>
					{/* <!-- Modal content --> */}
					<div className='relative bg-white shadow rounded-xl'>
						{/* <!-- Modal header --> */}
						<div className='flex items-center justify-between px-5 py-6 mt-10 border-b bg-accents-2 rounded-t-xl'>
							<p className='font-bold text-baseColor'>{isRoleEditable ? 'Update Role' : t('Add New Role')}</p>
							<Button onClick={onClose} label={t('')}  title={`${t('Close')}`}>
								<span className='text-xl-22'><Cross className=' text-error' /></span>
							</Button>
						</div>
						{/* <!-- Modal body --> */}
						<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
							<form className='bg-white rounded-b-xl' onSubmit={formik.handleSubmit}>
								<div className='p-5 border-b border-solid border-border-primary max-h-[calc(100vh-260px)] overflow-auto'>
									<TextInput placeholder={t('Role Name')} name='role' onChange={formik.handleChange} onBlur={OnBlurRole} value={formik.values.role} error={formik.errors.role && formik.touched.role ? formik.errors.role : ''} label={t('Role')} required={true} />
								</div>
								<div className='flex justify-end p-5'>
									<Button className='btn-primary btn-normal w-full md:w-auto min-w-[160px]' type='submit' label={t('Submit')} disabled={loading?.loading || updateLoading?.loading}  title={`${t('Submit')}`}></Button>
								</div>
							</form>
						</WithTranslateFormErrors>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEditRole;
