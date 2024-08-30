import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'src/config/constant';
import { verifyAuth } from 'src/utils/helpers';
import { Content, Sidebar } from '../components/index';
import Header from '@components/header/Header';
import Breadcrumb from '@components/breadcrumb/Breadcrumb';
import Footer from '@components/footer';

const DefaultLayout = () => {
	const navigate = useNavigate();
	const [sideBarShow, setSideBarshow] = useState(true);
	const [isActive, setIsActive] = useState(false);
	const showHideBar = () => {
		setSideBarshow(!sideBarShow);
	};

	React.useEffect(() => {
		if (!verifyAuth) {
			navigate(`/${ROUTES.login}`);
		}
	}, [navigate]);

	const sidebarNavClick = () => {
		if (window.innerWidth < 640) {
			setSideBarshow((prev: boolean) => !prev);
		}
	};
	return (
		<div className='flex flex-col h-screen'>
			{/* <Header /> */}
			<Header showHandler={showHideBar} />
			<div className='flex flex-1 max-h-full overflow-y-auto  '>
				<Sidebar isActive={isActive} setIsActive={setIsActive} show={sideBarShow} onClick={sidebarNavClick} />
				<div className='flex flex-1 flex-col'>
					<Breadcrumb />
					<Content />
					<Footer />
				</div>
			</div>
		</div>
	);
};

export default DefaultLayout;
