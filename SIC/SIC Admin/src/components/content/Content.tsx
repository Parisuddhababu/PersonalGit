import React from 'react';
import { Outlet } from 'react-router-dom';

const Content = () => {
	return <Outlet />;
};

export default React.memo(Content);
