import React, { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'src/config/constant';
import { verifyAuth } from 'src/utils/helpers';
import { Content, Sidebar, Header } from '../components/index';
import LoadingIndicator from '@components/loadingIndicator/Loader';

const DefaultLayout = () => {
	const navigate = useNavigate();
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isClose, setIsClose] = useState<boolean>(false);
	const closeDropDown = () => {
		setIsClose(!isClose);
	};

	React.useEffect(() => {
		if (!verifyAuth()) {
			navigate(`/${ROUTES.login}`);
		}
	}, []);

	return (
		<div className='flex flex-col h-screen items-stretch' onClick={closeDropDown} role='none'>
			<Header setIsActive={setIsActive} setIsClose={isClose} />
			<div className='flex main-wrapper flex-1 overflow-auto'>
				<Sidebar isActive={isActive} setIsActive={setIsActive} />
				<Suspense fallback={<LoadingIndicator />}>
					<section className='p-4 bg-slate-50 w-full h-full flex-1 overflow-auto'>
						<Content />
					</section>
				</Suspense>
				{/* <Footer /> */}
			</div>
		</div>
	);
};

export default DefaultLayout;
