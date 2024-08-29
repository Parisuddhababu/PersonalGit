// eslint-disable-next-line
import React from 'react';
import UserManagementList from "./common/user-management-list"
import { CommonMaster, UserEnum, UserUrlEnum, Permission } from 'src/shared/enum/enum';

const AdminUsers = () => {
    return (
        <div>
            <UserManagementList masterName={CommonMaster.ADMIN_USERS} routerName={UserUrlEnum[UserEnum.ADMIN_USERS]} type = {UserEnum.ADMIN_USERS} 
            Create={Permission.ADMIN_USER_CREATE} View={Permission.ADMIN_USER_SHOW} Update={Permission.ADMIN_USER_UPDATE} Delete={Permission.ADMIN_USER_DELETE} Status={Permission.ADMIN_USER_STATUS} />
        </div>
    )
}

export default AdminUsers
