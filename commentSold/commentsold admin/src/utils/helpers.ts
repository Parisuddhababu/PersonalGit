import { DATE_FORMAT, KEYS, ROUTES } from '@config/constant';
import { MetaRes } from '@framework/graphql/graphql';
import moment from 'moment';
import { toast } from 'react-toastify';
import DecryptionFunction from '@services/decryption';
/**
 * Method that verify authentication
 * @returns boolean
 */
export const verifyAuth = () => {
	return !!localStorage.getItem(KEYS.authToken);
};
/**
 * Method that destroy authtoken
 */
export const destroyAuth = () => {
	localStorage.removeItem(KEYS.authToken);
};
/**
 * Method used to get authtoken
 * @returns authtoken
 */
export const authToken = () => {
	return localStorage.getItem(KEYS.authToken);
};
/**
 * Method used to get date from time stamp
 * @param date
 * @returns date in 24 hours format
 */
export const getDateFromTimestamp = (date: string) => {
	return moment(moment(parseInt(date)).format()).format(DATE_FORMAT.momentDateTime24Format);
};
/**
 * Method that used to convert date to required format
 * @param date
 * @param formatType
 * @returns return date in given format
 */
export const getDateFromat = (date?: string, formatType?: string) => {
	return moment(date).format(formatType);
};
/**
 *Method used to get date in LTS format
 * @param date
 * @returns date in LTS format
 */
export const getDateTimeFromTimestamp = (date: string) => {
	return moment(moment(parseInt(date)).format()).format('LTS');
};
/**
 * Method used to return string
 * @param text
 * @returns text
 */
export const translationFun = (text: string) => {
	return text;
};
/**
 *Method used to remove white space in input
 * @param event
 * @returns the trimed value
 */
export const whiteSpaceRemover = (event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
	const value: string = event.target.value.trim();
	return value;
};
/**
 * Method used to handle error on API call
 * @param error
 * @param callBack
 */
export const errorHandler = async (error: MetaRes, callBack?: CallableFunction) => {
	const errorData = error;
	if (errorData?.messageCode.includes('INVALID_REFRESH_TOKEN')) {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = `/${ROUTES.login}`;
	} else if (errorData?.messageCode.includes('ACCESS_DENIED')) {
			toast.error(errorData?.message);
			window.location.href = `/${ROUTES.accessDenied}`;
	} else if (Array.isArray(errorData?.errors) && errorData?.errors.length > 0) {
		errorData.errors.forEach((err) => {
			toast.error(err.error);
		});
	} else if (errorData?.message) {
		if (!errorData?.messageCode?.includes('NOT_FOUND')) {
			toast.error(errorData?.message);
		}
	} else {
		const message = 'SOMETHING_WENT_WRONG';
		toast.error(message);
	}

	if (callBack) {
		callBack();
	}
};
/**
 * Method used to handle keyDown event
 * @param e
 * @returns boolean
 */
export const keyDownEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
	if (+e.key >= 0 && +e.key <= 9) {
		e.preventDefault();
	} else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
		e.preventDefault();
	} else {
		return false;
	}
};
/**
 * Method used to set cookie
 * @param name
 * @param value
 * @param days
 */
export function setCookie (name: string, value: string, days: number) {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = 'expires=' + date.toUTCString();
	document.cookie = name + '=' + value + ';' + expires + ';path=/';
}
/**
 * Methid used to get cookies
 * @param name
 * @returns
 */
export function getCookie (name: string) {
	const cookieName = name + '=';
	const cookies = document.cookie.split(';');
	for (const element of cookies) {
		let cookie = element;
		while (cookie.startsWith(' ')) {
			cookie = cookie.substring(1);
		}
		if (cookie.startsWith(cookieName)) {
			return cookie.substring(cookieName.length, cookie.length);
		}
	}
	return '';
}
/**
 * Method used to generate custom UUID using crypto package
 * @returns UUID
 */
export const uuid = (): string => {
	return crypto.randomUUID();
};


/**
 * Method used to generate serial number
 * @param value
 * @param page
 * @param totalRecordsPerPage
 * @returns serial number
 */
export const serialNo = (value: number, page: number, totalRecordsPerPage: number) => {
	if (page !== 0) {
		return value + page * totalRecordsPerPage;
	} else {
		return value;
	}
};
/**
 * Method used to compare timings
 * @param expireTime
 */
export const timeComparisonFun = (expireTime: string) => {
	const currentTimestamp = new Date().toString();
	const convertedCurrentTime = getDateFromat(currentTimestamp, 'YYYY-MM-DD HH:mm:ss');
	return moment(convertedCurrentTime).isAfter(expireTime);
};
/**
 * Method used to get permissions from local storage
 * @returns array of permission
 */
export const getUserPermissions = () => {
	const EncryptedPermissions = localStorage.getItem('permissions');
	const DecryptedPermissions = EncryptedPermissions && DecryptionFunction(EncryptedPermissions);
	const userPermissions = Permissions && JSON.parse(DecryptedPermissions);
	return userPermissions;
};

/**
 * Method used to get year from date
 * @param value
 * @returns year
 */
export const getYear = (value: Date | string): number => {
	const date = new Date(value);
	const year = date.getFullYear();
	return year;
};
