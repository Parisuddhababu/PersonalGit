// eslint-disable-next-line
import React from 'react';
import UserManagementList from "./common/user-management-list"
import { CommonMaster, UserEnum, UserUrlEnum, Permission } from 'src/shared/enum/enum';

const B2BUsers = () => {
    return (
        <div>
            <UserManagementList masterName={CommonMaster.B2B_USERS} routerName={UserUrlEnum[UserEnum.B2B_USERS]} type = {UserEnum.B2B_USERS} 
            Create={Permission.B2B_USER_CREATE} View={Permission.B2B_USER_SHOW} Update={Permission.B2B_USER_UPDATE} Delete={Permission.B2B_USER_DELETE} Status={Permission.B2B_USER_STATUS} Approve={Permission.B2B_USER_APPROVE} EmailVerify={Permission.B2B_USER_VERIFY_EMAIL}/>
        </div>
    )
}

export default B2BUsers
