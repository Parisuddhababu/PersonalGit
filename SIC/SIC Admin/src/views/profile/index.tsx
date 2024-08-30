import React, { useCallback } from 'react';
import { User } from '@components/icons';
import TextInput from '@components/textInput/TextInput';
import { ProfileResponse } from 'src/types/profile';
import Button from '@components/button/Button';
import { ROUTES } from '@config/constant';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
	const data: ProfileResponse = JSON.parse(localStorage.getItem('userDetails') as string);

	const navigate = useNavigate();

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, []);

	return (
		<div className='w-full mb-4 bg-white shadow-lg rounded-lg p-3'>
			<div className='flex gap-3 mb-4 '>
				<div className=' w-full'>
					<div className='border-b p-3 flex items-center justify-between'>
						<h6 className='font-medium flex items-center'>
							<User className='inline-block mr-2 text-primary' /> Profile Information
						</h6>
					</div>
					<div className=' grid grid-cols-2 gap-x-4 p-3'>
						<div className='mb-4'>
							<TextInput placeholder='First name' label='First Name' value={data.firstName} disabled />
						</div>
						<div className='mb-4'>
							<TextInput placeholder='Last name' label='Last Name' value={data.lastName} disabled />
						</div>
						<div className='mb-4'>
							<TextInput placeholder='Email' label='Email' value={data.email} disabled />
						</div>
					</div>
				</div>
			</div>
			<div className='flex justify-end gap-2 items-center mt-4 p-3'>
				<Button className='btn-primary btn-large justify-center' onClick={onCancel}>
					Back
				</Button>
			</div>
		</div>
	);
};
export default Profile;
