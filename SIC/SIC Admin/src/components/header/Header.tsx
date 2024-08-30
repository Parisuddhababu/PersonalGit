import React, { useEffect, useState } from 'react';
import { ROUTES } from '@config/constant';
import { Link, useNavigate } from 'react-router-dom';
import { destroyAuth } from '@utils/helpers';
import defaultUser from '@assets/images/default-user-image.png';
import { ProfileResponse } from 'src/types/profile';
import logo from '@assets/images/logo.png';
import { MenuBurger, User, Key, Lock } from '@components/icons';
import { HeaderProps } from 'src/types/views';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { ResponseCode } from 'src/interfaces/enum';

const Header = ({ setIsActive, setIsClose }: HeaderProps) => {
	const navigate = useNavigate();
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);

	const toggleDropdown = () => {
		setIsDropDownOpen(!isDropDownOpen);
	};

	const closingDropDown = () => {
		setIsDropDownOpen(false);
	};

	useEffect(() => {
		closingDropDown();
	}, [setIsClose]);

	const logOut = () => {
		APIService.postData(URL_PATHS.logOut, {})
			.then((response) => {
				response.status === ResponseCode.success ? toast.success(response?.data?.message) : toast.error(response?.data?.message);
				destroyAuth();
				navigate(`/${ROUTES.login}`);
			})
			.catch((error) => {
				if (error.response.status === ResponseCode.badRequest) {
					toast.error(error.response.data.message);
					destroyAuth();
					navigate(`/${ROUTES.login}`);
				}
			});
	};
	const data: ProfileResponse = JSON.parse(localStorage.getItem('userDetails') as string);

	return (
		<header className='bg-white shadow z-50' onClick={closingDropDown}>
			<nav className='flex items-center justify-between p-4' aria-label='Global'>
				<div className='flex flex-1 justify-between'>
					<div className='flex items-center'>
						<span className='mr-4 text-lg h-10 w-10 grid place-content-center border rounded-full lg:hidden' onClick={() => setIsActive(true)}>
							<MenuBurger />
						</span>
						<Link to='/'>
							<img className='h-14 w-auto' src={logo} alt='Sing In Chines' />
						</Link>
					</div>
					<div className='flex items-center space-x-3'>
						<div className='text-right'>
							<h6 className='text-sm font-semibold leading-4 text-primary '>{`${data?.firstName}  ${data?.lastName}`}</h6>
						</div>
						<img
							className='w-10 h-10 rounded-full cursor-pointer'
							src={defaultUser}
							alt=''
							onClick={(e) => {
								e.stopPropagation();
								toggleDropdown();
							}}
						/>
						{isDropDownOpen && (
							<div className='absolute flex flex-col   border border-[#c8ced3] top-[88px] right-0 bg-white min-w-[160px] rounded  font-semibold text-[#181b1e] text-[0.775rem] '>
								<Link to={ROUTES.profile} className=' border-b border-[#c8ced3] hover:cursor-pointer  text-primary hover:bg-accent min-w-[180px] px-[10px] py-[10px] '>
									<User className='fill-primary ml-[10px] mr-[10px] inline-block' />
									Profile
								</Link>
								<Link to={ROUTES.profilePassword} className=' border-b border-[#c8ced3] hover:cursor-pointer text-primary hover:bg-accent min-w-[180px] px-[10px] py-[10px]  '>
									<Key className='fill-primary ml-[10px] mr-[10px] inline-block' />
									Change Password
								</Link>
								<a className='text-white bg-primary  hover:cursor-pointer hover:bg-accent min-w-[180px] px-[10px] py-[10px]' onClick={logOut}>
									<Lock className='fill-[#ffffff] ml-[10px] mr-[10px] inline-block' />
									Log Out
								</a>
							</div>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
};

export default React.memo(Header);
