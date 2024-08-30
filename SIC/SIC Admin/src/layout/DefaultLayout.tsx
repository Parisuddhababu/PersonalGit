import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'src/config/constant';
import { verifyAuth } from 'src/utils/helpers';
import { Content, Sidebar, Header } from '../components/index';

const DefaultLayout = () => {
	const navigate = useNavigate();
	const [isActive, setIsActive] = useState(false);
	const [isClose, setIsClose] = useState(false);
	const closeDropDown = () => {
		setIsClose(!isClose);
	};

	React.useEffect(() => {
		if (!verifyAuth()) {
			navigate(`/${ROUTES.login}`);
		}
	}, []);

	return (
		<div className='flex flex-col h-screen items-stretch' onClick={closeDropDown}>
			<Header setIsActive={setIsActive} setIsClose={isClose} />
			<div className='flex main-wrapper flex-1 overflow-auto'>
				<Sidebar isActive={isActive} setIsActive={setIsActive} />
				<main className='p-4 bg-slate-50 w-full h-full flex-1 overflow-auto'>
					<Content />
				</main>
				{/* <Footer /> */}
			</div>
		</div>
	);
};

export default DefaultLayout;
