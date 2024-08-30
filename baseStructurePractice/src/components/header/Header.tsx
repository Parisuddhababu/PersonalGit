import React, { useEffect, useRef, useState } from 'react';
import { ROUTES } from '@config/constant';
import { Link, useNavigate } from 'react-router-dom';
import { destroyAuth } from '@utils/helpers';
import { Lock, MenuBurger, User } from '@components/icons';
import { DefaultPropsTypes } from 'src/types/common';
import { GET_PROFILE_INFORMATION } from '@framework/graphql/queries/profile';
import { useQuery } from '@apollo/client';
import { GET_SETTINGS_DATA } from '@framework/graphql/queries/settings';
import { toast } from 'react-toastify';
import userimage from '../../assets/images/default-user-image.png';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';

const Header = ({ showHandler }: DefaultPropsTypes) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { data } = useQuery(GET_PROFILE_INFORMATION);
	const { refetch } = useQuery(GET_SETTINGS_DATA);
	const [logo, setLogo] = useState(''); //logo for header
	const [showOptions, setShowOptions] = useState(false); //dropdown condition for profile
	const [show, setShow] = useState(false);
	// Create ref for the dropdown elements
	const profileDropdownRef = useRef<HTMLDivElement | null>(null);
	const languageDropdownRef = useRef<HTMLDivElement | null>(null);

	const languageMouseHandler = (event: MouseEvent) => {
		if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
			setShow(false);
		}
	};

	const profileMouseHandler = (event: MouseEvent) => {
		if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
			setShowOptions(false);
		}
	};

	// Add mousedown event listener to the document
	useEffect(() => {
		document.addEventListener('mousedown', languageMouseHandler);
		document.addEventListener('mousedown', profileMouseHandler);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener('mousedown', languageMouseHandler);
			document.removeEventListener('mousedown', profileMouseHandler);
		};
	}, []);
	/*logout handler to logout */
	const logOut = () => {
		destroyAuth();
		navigate(`/${ROUTES.login}`);
	};
	/*toggle for profile drop down*/
	const handleImageClick = () => {
		setShowOptions((showOptions) => !showOptions);
	};
	const languageHandler = () => {
		setShow((show) => !show);
	};
	/*settings*/
	const refetchSettings = async () => {
		const res = await refetch({
			getDetailId: data?.getProfileInformation?.data?.id,
		});
		if (res) {
			const data = res?.data?.getDetail?.data;
			setLogo(data?.logo);
			sessionStorage.setItem('feviconIcon', data?.favicon);
		}
	};
	useEffect(() => {
		refetchSettings().catch((e) => toast.error(`${e.message}`));
	}, [refetchSettings]);
	/*for fevicon image*/
	const feviconImage = sessionStorage.getItem('feviconIcon') as string;
	(document.getElementById('imgData') as HTMLLinkElement).href = feviconImage;
	// Function to change the language
	const changeLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
		setShow(false); // Close the language dropdown
	};

	const handleProfileOptionClick = () => {
		setShowOptions(false); // Close the profile dropdown
	};
	return (
		<header className='bg-white  z-10 h-[55px] border-b border-[#c8ced3] px-2 pt-2'>
			<nav className=' flex items-center justify-between' aria-label='Global'>
				<div className='flex items-center'>
					<div onClick={showHandler} className='lg:hidden '>
						<MenuBurger className='hover:cursor-pointer text-slate-500 ' fontSize='20px' />
					</div>

					<div className='flex flex-grow justify-end lg:flex-grow-0 '>
						<Link to={`/${ROUTES.app}/${ROUTES.settings}`}>
							<div>
								<img className='h-[25px] w-[103px] ml-4 mr-14 lg:mr-0 ' src={logo} alt='' />
							</div>
						</Link>
					</div>

					<div onClick={showHandler} className='hidden lg:block min-w-[50px] ml-11'>
						<MenuBurger className='hover:cursor-pointer text-slate-500  ' fontSize='20px' />
					</div>

					<div className='hidden lg:block '>
						<Link to={`/${ROUTES.app}/${ROUTES.settings}`} className='text-[#738393]'>
							{t('Settings')}
						</Link>
					</div>
				</div>

				<div className='flex justify-end'>
					<div className='flex items-center space-x-3'>
						<div>
							<h6 onClick={languageHandler} className='cursor-pointer'>
								{i18n.language}
							</h6>
						</div>
						<div>
							{/* language changing dropdown  */}
							{show && (
								<div ref={languageDropdownRef} className={'lang absolute flex flex-col   border border-[#c8ced3]   bg-white min-w-[160px] rounded  font-normal  md:mr-24 top-[42px] right-20'}>
									<a onClick={() => changeLanguage('en')} className=' text-primary border-b border-[#c8ced3] hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] focus:bg-primary text-[0.875rem]'>
										EN
									</a>
									<a onClick={() => changeLanguage('es')} className='  text-primary hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] text-[0.875rem]   '>
										ES
									</a>
								</div>
							)}
						</div>

						<div className='hidden lg:block font-medium dark:text-white text-right'>
							<h6 className='p-auto'>
								{data?.getProfileInformation?.data?.first_name} {data?.getProfileInformation?.data?.last_name}
							</h6>
						</div>
						<div>
							<div className='flex flex-col items-center justify-center mb-auto p-auto'>
								<img onClick={handleImageClick} className='w-8 h-8 rounded-full cursor-pointer mx-3 ' src={userimage} alt='' />
							</div>
							{/* profile drop down  */}
							{showOptions && (
								<div ref={profileDropdownRef} className='absolute flex flex-col   border border-[#c8ced3] top-[42px] right-0 bg-white min-w-[160px] rounded  font-normal text-[#181b1e]  '>
									<a
										onClick={() => {
											navigate(ROUTES.profile);
											handleProfileOptionClick();
										}}
										className=' border-b border-[#c8ced3] hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] focus:bg-primary text-[0.875rem]'
									>
										<User className='fill-[#c8ced3] ml-[8px] mr-[16px] inline-block' fontSize='13px' />
										{t('Profile')}
									</a>
									<a onClick={logOut} className='hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] text-[0.875rem]   '>
										<Lock className='fill-[#c8ced3] ml-[8px] mr-[16px] inline-block' fontSize='13px' />
										{t('Logout')}
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
