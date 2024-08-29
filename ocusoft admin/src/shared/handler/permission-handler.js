import { Permission } from "../enum/enum";

const permissionArray = localStorage.getItem("permission");

const permissionHandler = (slug) => {
    if (permissionArray){
        let parseData = JSON.parse(permissionArray);
        // For Dashboard module
        parseData = [...parseData, Permission.SHOW_ALL];
        // For super admin
        if(parseData.indexOf('SUPER_ADMIN') > -1){
            return true
        }
        // For sub admin Single menu
        if (typeof slug === 'string') {
            return parseData.indexOf(slug) > -1 ? true : false;
        }
        // For sub admin Group menu
        if (typeof slug === 'object') {
            return parseData.some( ai => slug.includes(ai) ) ? true : false
        }
        return false
    } 
}

export default permissionHandler
