// eslint-disable-next-line
import React from 'react';
import UserManagementList from "./common/user-management-list"
import { CommonMaster, UserEnum, UserUrlEnum, Permission } from 'src/shared/enum/enum';

const MicrositeAdminUsers = () => {
    return (
        <div>
            <UserManagementList masterName={CommonMaster.MICROSITE_ADMIN_USERS} routerName={UserUrlEnum[UserEnum.MICROSITE_ADMIN_USERS]} type = {UserEnum.MICROSITE_ADMIN_USERS} 
            Create={Permission.MICROSITE_ADMIN_USER_CREATE} View={Permission.MICROSITE_ADMIN_USER_SHOW} Update={Permission.MICROSITE_ADMIN_USER_UPDATE} Delete={Permission.MICROSITE_ADMIN_USER_DELETE} Status={Permission.MICROSITE_ADMIN_USER_STATUS}/>
        </div>
    )
}

export default MicrositeAdminUsers
