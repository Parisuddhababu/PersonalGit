import { APIService } from '@framework/services/api';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, FILE_TYPE, KEYS, fileTypeEnum } from '@config/constant';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Errors } from '@config/errors';
import axios from 'axios';

/* function to verify the Auth */
export const verifyAuth = () => {
	return !!localStorage.getItem(KEYS.authToken);
};

/* function to destroy the Auth */
export const destroyAuth = () => {
	localStorage.removeItem(KEYS.authToken);
	localStorage.removeItem(KEYS.UserDetails);
	localStorage.removeItem(KEYS.role);
	localStorage.removeItem(KEYS.permissions);
};

/**
 * @return token from localStorage
 */
export const authToken = () => {
	return localStorage.getItem(KEYS.authToken);
};

/* function to get the date from time stamp */
export const getDateFromTimestamp = (date: string) => {
	return moment(moment(parseInt(date)).format()).format('L');
};

/* function to get the time from time stamp */
export const getDateTimeFromTimestamp = (date: string) => {
	return moment(moment(parseInt(date)).format()).format('LTS');
};

/**
 * @return date from UTC time stamp
 * @param date as string
 */
export const getDateFromUTCstamp = (date: string) => {
	return moment.utc(date).local().format(DEFAULT_DATE_FORMAT);
};

/**
 * @return time from UTC time stamp
 * @param date as string
 */
export const getDateTimeFromUTCstamp = (date: string) => {
	return moment.utc(date).local().format(DEFAULT_TIME_FORMAT);
};

/**
 * @return date by sorting
 * @param data as string
 */
export const sortOrder = (data: string) => {
	return data === 'asc' ? 'desc' : 'asc';
};

/* function to export the CSV data report*/
export const exportCsv = (data: string, fileName: string) => {
	const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	const currentTime = new Date().getTime();
	a.download = `${fileName}-${currentTime}`;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(a);
};

/* function for disabled the date typing */
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
 * @return file Extension for url
 * @param url as string
 */
export const getFileTypeFromUrl = (url: string) => {
	const match = RegExp(/\.([a-zA-Z0-9]+)(?:\?.*)?$/).exec(url);
	if (match) {
		return match[1].toLowerCase();
	} else {
		return null;
	}
};

/**
 * @return file Name for url
 * @param url as string
 */
export const getFileNameFromUrl = (url: string): string => {
	const urlObject = new URL(url);
	const pathname = urlObject.pathname;
	const fileNameWithExtension = pathname.substring(pathname.lastIndexOf('/') + 1);
	return fileNameWithExtension;
};

/**
 * @return Reset manual input fields.
 * @param array of input ids.
 */
export const resetInputManually = (fields: string[]) => {
	fields.forEach((field) => {
		const inputField = document.getElementById(field) as HTMLInputElement;
		inputField.value = '';
	});
};

/**
 * @return Generate Random Secure number.
 */
export const generateSecureRandomNumber = () => {
	const array = new Uint32Array(1);
	if (window?.crypto) {
		window.crypto.getRandomValues(array);
	}
	const randomNumber = array[0].toString();
	return randomNumber;
};

/**
 * @return Generate Random UUID.
 */
export const generateUuid = () => {
	return generateSecureRandomNumber();
};

/**
 * Get gif file dimensions
 * @param file
 */
export function getGifDimensions(file: File, callback: (dimensions: { width: number; height: number }) => void): void {
	const reader = new FileReader();

	reader.onload = (event: ProgressEvent<FileReader>) => {
		const img = new Image();

		img.onload = () => {
			const dimensions = {
				width: img.width,
				height: img.height,
			};

			callback(dimensions);
		};

		if (typeof event.target?.result === 'string') {
			img.src = event.target.result;
		}
	};

	reader.readAsDataURL(file);
}

/**
 * @return the data by translate the text.
 * @param text as string.
 * @param target as string.
 * @param source as string.
 */
export const translateText = async (text: string, target: string, source: string) => {
	const GOOGLE_TRANSLATE = process.env.REACT_APP_GOOGLE_TRANSLATE;
	const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
	try {
		const response = await APIService.getDataWithoutAuth(`${GOOGLE_TRANSLATE}?key=${GOOGLE_API_KEY}&q=${text}&source=${source}&target=${target}`);
		return response?.data?.data?.translations[0].translatedText;
	} catch (error) {
		toast.error('Error Translation the word');
	}
};

/* custom function for type validation for file upload either audio or video */
export const typeValidation = (file: File, type: string) => {
	if (file === undefined) {
		return;
	}
	const fileTypes = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];
	if (!fileTypes.includes(file.type)) {
		toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
	}
};

/* custom function for type validation for file upload */
export const typeValidationAudio = (file: File, type: string[], message: string) => {
	if (file === undefined) {
		return;
	}
	if (!type.includes(file.type)) {
		toast.error(message);
	}
};

export const reloadPage = () => {
	return window.location.reload();
};

export const moveData = (isMoving: boolean, newUuid: string, oldUuid: string) => {
	return isMoving ? newUuid : oldUuid;
};

/**
 * Method is used to export child detail csv
 * @param link
 */
export const downloadCSVFile = (data: string) => {
	const url = data;
	axios({
		url,
		method: 'GET',
		responseType: 'blob',
	})
		.then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'Child Detail.csv');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch((error) => {
			toast.error('Error downloading the file.', error);
		});
};

/**
 * Method used to change the date format in mm/dd/yyyy
 */
export const dateFormat = (date: string) => {
	return moment(date).format('MM/DD/YYYY');
};
