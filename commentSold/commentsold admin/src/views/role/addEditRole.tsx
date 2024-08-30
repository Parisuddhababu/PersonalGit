import React, { useCallback, useEffect } from 'react';
import { RoleEditProps, RoleInput } from '@type/role';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { CREATE_ROLE, UPDATE_ROLE } from '@framework/graphql/mutations/role';
import { useMutation } from '@apollo/client';
import { RoleCreateRes, UpdateRoleDataType } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import { Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import { Loader } from '@components/index';
const AddEditRole = ({ isRoleModelShow, onSubmitRole, onClose, isRoleEditable, roleObj }: RoleEditProps) => {
	const [updateRoleData, { loading: updateLoader }] = useMutation(UPDATE_ROLE);
	const [createRoleData, { loading: createLoader }] = useMutation(CREATE_ROLE);
	const initialValues: RoleInput = {
		role: '',
		description: ''
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
			variables: {
				roleName: values?.role,
				description: values?.description,
				key: values?.role,
			},
		})
			.then((res) => {
				const data = res?.data as RoleCreateRes;

				if (data?.createRole?.meta?.statusCode === 200) {
					onSubmitRole();
					toast.success(data?.createRole?.meta?.message);
				}
			})
			.catch(() => {
				return;
			});
	};

	/**
	 *
	 * @param values Method used for update role
	 */
	const UpdateRoleDataVal = (values: RoleInput) => {
		updateRoleData({
			variables: {
				uuid: roleObj?.uuid,
				roleName: values?.role,
				description: values?.description
			},
		})
			.then((res) => {
				const data = res?.data as UpdateRoleDataType;
				if (data?.updateRole?.meta?.statusCode === 200) {
					onSubmitRole();
					toast.success(data?.updateRole?.meta?.message);
				}
			})
			.catch(() => {
				return;
			});
	};
	/**
	 * Method handles out side click
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'addedit-role-model' || (event.target as HTMLElement)?.id === 'addedit-role-model-child') {
				onClose();
			}
		});
	}, [isRoleModelShow]);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurRole = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	useEffect(() => {
		if (isRoleEditable && roleObj) {
			formik.setFieldValue('role', roleObj.role_name);
			formik.setFieldValue('description', roleObj.description)
		}
	}, [roleObj, isRoleEditable])


	return (
		<div id='addedit-role-model' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`model-container ${isRoleModelShow ? '' : 'hidden'}`}>
			{(createLoader || updateLoader) && <Loader />}
			<div id='addedit-role-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'model animate-fade-in '}>
				<div className=' model-content'>
					<div className='model-header'>
						<p className='text-lg font-medium text-white  '>{isRoleEditable ? `${('Update Role')} [${roleObj.role_name}]` : ('Add New Role')}</p>
						<Button onClick={onClose} label={('')}>
							<span className='mr-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					{/* <!-- Modal body --> */}
					<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
						<form onSubmit={formik.handleSubmit}>
							<div className='model-body'>
								<div className='mb-4'>
									<TextInput id='role' placeholder={('Role Name')} name='role' onChange={formik.handleChange} onBlur={OnBlurRole} value={formik.values.role} error={formik.errors.role && formik.touched.role ? formik.errors.role : ''} label={('Role')} required={true} />
								</div>
								<div className='mb-4'>
									<TextInput id='description' placeholder={('description')} name='description' onChange={formik.handleChange} onBlur={OnBlurRole} value={formik.values.description} error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} label={('description')} required={true} />
								</div>

							</div>
							<div className='model-footer'>
								<Button className='btn-primary  ' type='submit' label={('Submit')}></Button>
								<Button className='  hover:bg-gray-400 btn-gray ' onClick={onClose} label={('Close')}></Button>
							</div>
						</form>
					</WithTranslateFormErrors>
				</div>
			</div>
		</div>
	);
};

export default AddEditRole;
