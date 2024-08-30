import React from 'react';

import NormalSidebar from './NormalSidebar';
import { SideBarProps } from 'src/types/component';

const Sidebar = ({ show, menuHandler, setToggleImage, toggleHeaderImage, logoutConformation }: SideBarProps) => {
	return <NormalSidebar show={show} menuHandler={menuHandler} setToggleImage={setToggleImage} toggleHeaderImage={toggleHeaderImage} logoutConformation={logoutConformation}/>;
};

export default React.memo(Sidebar);
