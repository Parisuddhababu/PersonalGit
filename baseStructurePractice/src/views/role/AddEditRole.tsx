import React from 'react';
import { RoleEditProps, RoleInput } from 'src/types/role';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/input/TextInput';
import { CREATE_ROLE_DATA, UPDATE_ROLE_DATA } from '@framework/graphql/mutations/role';
import { useMutation } from '@apollo/client';
import { RoleCreateRes, UpdateRoleDataType } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import { Close } from '@components/icons';
import { useTranslation } from 'react-i18next';
import useValidation from '@components/hooks/validation';
import Button from '@components/button/button';

const AddEditRole = ({ onSubmitRole, onClose, roleVal, isRoleEditable, roleObj }: RoleEditProps) => {
	const [updateRoleData] = useMutation(UPDATE_ROLE_DATA);
	const [createRoleData] = useMutation(CREATE_ROLE_DATA);
	const { t } = useTranslation();

	/*initial values*/
	const initialValues: RoleInput = {
		role: roleVal || '',
	};
	const { roleValidation } = useValidation();
	/*submit form*/
	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(roleValidation),
		onSubmit: (values) => {
			if (isRoleEditable) {
				UpdateRoleDataVal(values);
			} else {
				createRole(values);
			}
		},
	});
	/*to create role*/
	const createRole = (values: RoleInput) => {
		createRoleData({
			variables: {
				roleName: values.role.trim(),
				key: values.role,
			},
		})
			.then((res) => {
				const data = res.data as RoleCreateRes;

				if (data.createRole.meta.statusCode === 200) {
					toast.success(data.createRole.meta.message);
				} else {
					toast.error(data.createRole.meta.message);
				}
				onSubmitRole();
			})
			.catch(() => {
				toast.error(t('Failed to create role'));
			});
	};
	/* update role*/
	const UpdateRoleDataVal = (values: RoleInput) => {
		updateRoleData({
			variables: {
				updateRoleId: roleObj?.id,
				roleName: values.role.trim(),
				key: values.role,
			},
		})
			.then((res) => {
				const data = res.data as UpdateRoleDataType;
				if (data.updateRole.meta.statusCode === 200) {
					toast.success(data.updateRole.meta.message);
				} else {
					toast.error(data.updateRole.meta.message);
				}
				onSubmitRole();
			})
			.catch(() => {
				toast.error(t('Failed to update the role'));
			});
	};

	return (
		<div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'fixed top-0 left- right-0 z-50  w-full h-auto p-2 overflow-x-hidden overflow-y-auto md:inset-0  backdrop-blur-sm backdrop-contrast-50 shadow-black shadow-2xl'}>
			<div className='flex justify-center'>
				{/* <!-- Modal content --> */}
				<div className='relative bg-white rounded-lg w-[31rem] h-[14rem] mt-4'>
					{/* <!-- Modal header --> */}
					<div className='flex items-start justify-between p-4 border-b rounded-t bg-[#BB3F42]'>
						<h3 className='text-xl text-white'>{isRoleEditable ? t('Update Role') : t('Add New Role')}</h3>
						<Button onClick={onClose} label={t('')}>
							<Close className='mr-1 text-red-500' />
						</Button>
					</div>
					{/* <!-- Modal body --> */}
					<form className='bg-white s rounded px-8 pt-3 pb-4 mb-4' onSubmit={formik.handleSubmit}>
						<div className='mb-2'>
							<TextInput placeholder={t('Role Name')!} name='role' label={t('Role')} onChange={formik.handleChange} value={formik.values.role} error={formik.errors.role} required />
						</div>

						<div className=' flex items-end justify-end space-x-2 px-1 mt-4'>
							<Button className='btn-primary btn-normal ' type='submit' label={t('Submit')}></Button>
							<Button className=' btn-normal hover:bg-gray-400 btn-gray ' onClick={onClose} label={t('Close')}></Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditRole;
