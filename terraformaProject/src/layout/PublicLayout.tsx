import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, USER_TYPE } from 'src/config/constant';
import { NavlinkReturnFunction, verifyAuth } from 'src/utils/helpers';
import { Content } from '../components/index';
import DecryptionFunction from 'src/services/decryption';

const PublicLayout = () => {
	const navigate = useNavigate();
	
	React.useEffect(() => {
		const encryptedUserType = localStorage.getItem('userType');
		const userType = encryptedUserType && DecryptionFunction(encryptedUserType);
		if (verifyAuth()&&userType) {
			navigate(NavlinkReturnFunction(+userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`));
		}
		
	}, []);

	return (
		<div className='h-[100%]'>
			<Content />
		</div>
	);
};

export default PublicLayout;
