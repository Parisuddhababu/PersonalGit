import { DATE_FORMAT, KEYS } from '@config/constant';
import moment from 'moment';

export const verifyAuth = () => {
	return !!localStorage.getItem(KEYS.authToken);
};

export const destroyAuth = () => {
	localStorage.removeItem(KEYS.authToken);
};

export const authToken = () => {
	return localStorage.getItem(KEYS.authToken);
};

export const getDateFromTimestamp = (date: string) => {
	return moment(moment(parseInt(date)).format()).format(DATE_FORMAT.momentDateTime24Format);
};
export const getDateFormat = (date?: string, formatType?: string) => {
	return moment(date).format(formatType);
};

export const getDateTimeFromTimestamp = (date: string) => {
	return moment(moment(parseInt(date)).format()).format('LTS');
};
export const translationFun = (text: string) => {
	return text;
};
export const whiteSpaceRemover = (event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
	const value: string = event.target.value.trim();
	return value;
};
export const NavlinkReturnFunction =(userType:number,conditionalUserType:number,defaultLink:string,conditionLink:string):string=> {
	if(userType === conditionalUserType){
		return conditionLink;
	}
	return defaultLink;
};

export const conditionReturnFun = (uuid: string) => {
	if (uuid) {
	  return uuid;
	} else {
	  return '';
	}
  }