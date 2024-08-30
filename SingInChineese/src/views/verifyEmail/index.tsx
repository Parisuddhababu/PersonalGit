import React, { useEffect, useState } from 'react';
import logo from '@assets/images/logo.png';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';

const VerifyEmail = () => {
	const search = useLocation().search;
	const [loading, setLoading] = useState(false);
	const [verifyMessage, setVerifyMessage] = useState('');

	const token = new URLSearchParams(search).get('token');
	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	const verifyToken = () => {
		axios
			.get(`${URL_PATHS.verifyEmail}${token}`)
			.then((response) => {
				setVerifyMessage(response.data.message);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				toast.error(err.response.data.message);
			});
	};

	useEffect(() => {
		verifyToken();
	}, []);

	return (
		<div className='grid place-content-center bg-gray-50 h-screen w-screen'>
			<div className='bg-white shadow-xl rounded-xl p-16 text-center flex flex-col items-center w-1full md:w-[30vw]'>
				<figure>
					<img src={logo} alt='Logo' className='mb-8 max-w-[150px]' />
				</figure>
				{loading ? <Loader /> : <h4 className='text-lg font-medium mb-5'>{verifyMessage}</h4>}
			</div>
		</div>
	);
};
export default VerifyEmail;
