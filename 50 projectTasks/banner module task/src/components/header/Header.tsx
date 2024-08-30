import React from 'react';
import { ROUTES } from '@config/constant';
import { Link, useNavigate } from 'react-router-dom';
import { destroyAuth } from '@utils/helpers';
import logo from '@assets/images/logo.png';
import defaultUser from '@assets/images/default-user-image.png';

const Header = () => {
	const navigate = useNavigate();

	const logOut = () => {
		destroyAuth();
		navigate(`/${ROUTES.login}`);
	};

	return (
		<header className='bg-white shadow z-10'>
			<nav className='flex items-center justify-between px-4 py-2' aria-label='Global'>
				<Link to='/'>
					<img className='h-16 w-auto' src={logo} alt='Sing In Chines' />
				</Link>
				<div className='flex flex-1 justify-end'>
					<div className='flex items-center space-x-3'>
						<div className='font-medium dark:text-white text-right'>
							<h6>Amit Admin</h6>
							<button onClick={logOut} className='text-sm font-semibold leading-4 text-primary hover:text-secondary'>
								Log out
							</button>
						</div>
						<Link to={ROUTES.profile}>
							<img className='w-10 h-10 rounded-full' src={defaultUser} alt='' />
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
