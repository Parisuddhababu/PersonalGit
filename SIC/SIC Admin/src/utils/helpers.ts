import { APIService } from '@framework/services/api';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, KEYS } from '@config/constant';
import moment from 'moment';
import { toast } from 'react-toastify';
import { GOOGLE_TRANSLATE } from '@config/variables';

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
	return moment(moment(parseInt(date)).format()).format('L');
};

export const getDateTimeFromTimestamp = (date: string) => {
	return moment(moment(parseInt(date)).format()).format('LTS');
};

export const getDateFromUTCstamp = (date: string) => {
	return moment.utc(date).local().format(DEFAULT_DATE_FORMAT);
};
export const getDateTimeFromUTCstamp = (date: string) => {
	return moment.utc(date).local().format(DEFAULT_TIME_FORMAT);
};
export const sortOrder = (data: string) => {
	return data === 'asc' ? 'desc' : 'asc';
};

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

export const minDate = new Date().toISOString().split('T')[0];

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
// Translate traditional to simplified
export const translateText = async (text: string, target: string, source: string) => {
	try {
		const response = await APIService.getDataWithoutAuth(`${GOOGLE_TRANSLATE}?key=${process.env.REACT_APP_GOOGLE_API_KEY}&q=${text}&source=${source}&target=${target}`);

		return response.data.data.translations[0].translatedText;
	} catch (error) {
		toast.error('Error Translation the word');
	}
};
