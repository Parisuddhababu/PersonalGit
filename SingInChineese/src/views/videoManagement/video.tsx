import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '@assets/images/logo.png';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import useDisableDevTools from 'src/hooks/useDisableDevTools';

const VideoPage = () => {
	useDisableDevTools();
	const params = useParams();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [videoSrc, setVideoSrc] = useState<string>('');

	useEffect(() => {
		if (params?.slug) {
			setIsLoading(true);
			APIService.getData(`${URL_PATHS.teacher}/videos/${params?.slug}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						setVideoSrc(response?.data?.data?.fileUrl);
					}
				})
				.catch((err) => toast.error(err?.response?.data?.message))
				.finally(() => setIsLoading(false));
		}
	}, []);
	return (
		<>
			<header className='bg-white shadow z-50'>
				{isLoading && <Loader />}
				<nav className='flex items-center justify-between p-5' aria-label='Global'>
					<div className='flex flex-1 justify-between'>
						<div className='flex items-center'>
							<Link to='/'>
								<img className='h-14 w-auto' src={logo} alt='Sing In Chinese' />
							</Link>
						</div>
					</div>
				</nav>
			</header>
			<div>
				<video controls controlsList='nodownload noremoteplayback' disablePictureInPicture onContextMenu={(e) => e.preventDefault()} className='bg-gray-100 object-cover w-full max-h-[90vh]' src={videoSrc}>
					<track kind='captions' />
				</video>
			</div>
		</>
	);
};

export default VideoPage;
