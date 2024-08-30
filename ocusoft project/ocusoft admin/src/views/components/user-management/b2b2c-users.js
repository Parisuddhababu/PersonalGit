// eslint-disable-next-line
import React from 'react';
import UserManagementList from "./common/user-management-list"
import { CommonMaster, UserEnum, UserUrlEnum, Permission } from 'src/shared/enum/enum';

const B2B2CUsers = () => {
    return (
        <div>
            <UserManagementList masterName={CommonMaster.B2B2C_USERS} routerName={UserUrlEnum[UserEnum.B2B2C_USERS]} type = {UserEnum.B2B2C_USERS} 
            View={Permission.B2B2C_USER_SHOW} Delete={Permission.B2B2C_USER_DELETE} Status={Permission.B2B2C_USER_STATUS} Approve={Permission.B2B2C_USER_APPROVE} EmailVerify={Permission.B2B2C_USER_VERIFY_EMAIL}/>
        </div>
    )
}

export default B2B2CUsers
