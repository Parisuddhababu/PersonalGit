import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState } from 'react';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import BasicDetails from './basic-details'
import ChangePassword from './change-password';

const Profile = () => {
    const [activeKey, setActiveKey] = useState(1);

    return (
        <>
            <CNav variant="tabs" role="tablist">
                <CNavItem>
                    <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>Basic Details</CNavLink>
                </CNavItem>

                <CNavItem>
                    <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>Change Password</CNavLink>
                </CNavItem>
            </CNav>

            <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                   <BasicDetails />
                </CTabPane>

                <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                    <ChangePassword />
                </CTabPane>              
            </CTabContent>
        </>
    )
}

export default Profile