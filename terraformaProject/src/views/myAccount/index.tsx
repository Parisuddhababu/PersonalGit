import React from 'react';
import MyAccountUserDetailsChanges from '@components/myAccount/myAccountUserDetailsChanges';
import UpdatedHeader from '@components/header/updatedHeader';

const MyAccount = () => {
	return (
		<>
			<UpdatedHeader />
			<MyAccountUserDetailsChanges />
		</>
	);
};

export default MyAccount;