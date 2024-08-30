import { DATE_TIME_FORMAT, DEFAULT_PRIMARY_COLOR, DOMAIN_STRING_ARRAY, GLOBAL_FILE_PATHS, LOCAL_STORAGE_KEY, pathsToHideHeaderAndFooter } from '@/constant/common';
import { ApolloError } from '@apollo/client';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

export async function checkCORSForImages(imageUrls: string[]) {
	const corsIssues: string[] = [];

	// Function to check CORS for a single image
	async function checkCORSForImage(url: string) {
		try {
			await fetch(url, { method: 'HEAD' }); // Use HEAD method to avoid downloading the entire image
		} catch (error) {
			// Check if the error is related to CORS
			if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
				corsIssues.push(url);
			}
		}
	}

	// Use Promise.all to fetch images concurrently
	await Promise.all(imageUrls.map(checkCORSForImage));

	return corsIssues;
}

export function convertToUrlArray(urlString: string) {
	const urlArray = urlString.replace(/\s/g, '').split(',');
	const trimmedUrlArray = urlArray.map(url => url.trim());
	return trimmedUrlArray;
}

export async function decryptToken(token: string) {
	try {
		const decodedData = atob(token);
		// Split the decoded data to retrieve individual parts
		return decodedData.split(":");
	} catch (error) {
		return null
	}
}

export function formatNumber(num: number) {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'm';
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'k';
	}
	return num.toString();
}

export const getConvertTimeFormat = (timeString: string) => {
	const [hoursStr, minutesStr, secondsStr] = timeString.split(' ');

	// Convert hours, minutes, and seconds to numbers
	const hours = parseInt(hoursStr) || 0;
	const minutes = parseInt(minutesStr) || 0;
	const seconds = parseInt(secondsStr) || 0;

	// Construct the formatted time string
	let formattedTime = '';
	if (hours > 0) {
		formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
	}
	if (minutes > 0) {
		formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
	}
	if (seconds > 0) {
		formattedTime += `${seconds} second${seconds > 1 ? 's' : ''}`;
	}

	return formattedTime.trim();
};

export const isCurrentTimeOver = (timezone: string, endDate: string) => {
	if (!timezone) {
		return ''
	}
	// Combine date and time into a single string
	const endTime = moment.utc(endDate).tz(timezone)
	// Get the current system time in the specified timezone
	const currentDateTime = moment().tz(timezone);

	// Check if the current system time is before the target date and time
	return currentDateTime.isAfter(endTime);
};

export const isDateBetween = (date: string, time: string, timezone: string, endDate: string) => {
	if (!date || !time || !timezone) {
		return ''
	}

	// Combine date and time into a single string
	const targetDateTimeString = `${date} ${time}`;
	// Get the current system time in the specified timezone
	const currentDateTime = moment().tz(timezone);
	const endTime = moment.utc(endDate).tz(timezone)

	// Parse the target date and time in the specified timezone
	const targetDateTime = moment.tz(targetDateTimeString, DATE_TIME_FORMAT.format5, timezone);
	// Check if the current system time is before the target date and time
	return currentDateTime.isBetween(targetDateTime, endTime)
};

export const handleGraphQLErrors = (error: ApolloError | undefined) => {
	const errorMessage = (error?.graphQLErrors?.[0]?.extensions?.meta as { message: string })?.message ?? ''
	errorMessage && toast.error(errorMessage);
}

export const handleDownloadCsv = () => {
	  const link = document.createElement('a');
	  link.href = GLOBAL_FILE_PATHS.sampleCsv;
	  link.download = 'sample.csv';
	  document.body.appendChild(link);
	  link.click();
	  document.body.removeChild(link);
}

export const detectBrowser = () => {
	const userAgent = navigator.userAgent.toLowerCase();
	
	if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) {
	  return 'Safari';
	} else if (userAgent.indexOf('firefox') !== -1) {
	  return 'Mozilla Firefox';
	} else if (userAgent.indexOf('chrome') !== -1) {
	  return 'Google Chrome';
	} else {
	  return 'Unknown';
	}
};

/*
enteredTime : Entered time in HH:mm format
currentTime : Current time in HH:mm format
*/
export const timeValidator = (enteredTime : string, currentTime : string) => {
	const [enteredHour, enteredMinute] = enteredTime.split(':').map(Number);
    // Parse current time
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);

    // Compare entered time with current time
    if (enteredHour < currentHour || (enteredHour === currentHour && enteredMinute <= currentMinute)) {
        return false; // Entered time is in the past
    }

    return true; // Entered time is in the future
}

export const capitalizeFirstLetter = (string : string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const removeAuthCookie = () =>{
	Cookies.remove(LOCAL_STORAGE_KEY.authToken)
}

export const setDynamicDefaultStyle = (primaryColor : string) => {
	if (typeof window !== 'undefined') {
	  const root = document.documentElement;
	  localStorage.setItem(LOCAL_STORAGE_KEY.primaryColor, primaryColor);
	  root.style.setProperty('--primary-color', primaryColor);
	}
};
  
export const getDefaultPrimaryColor = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY.primaryColor) ?? DEFAULT_PRIMARY_COLOR;
};

export const getMinDateForTimezone = (dateString: string) => {
  const [day, month, year] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date;
};

export const getPopupStyleCustomization = (): string => {
	const left = window.screen.width / 2 - 500 / 2;
	const top = window.screen.height / 2 - 549 / 2;
	return `toolbar=no, width=500, height=549, top=${top}, left=${left}`;
};

export const checkToShowHeaderAndFooter = (path : string) => {
	return pathsToHideHeaderAndFooter.includes(path);
}

export const checkIsBrandDomain = (host : string | null) =>{
	const domainString = DOMAIN_STRING_ARRAY;
	const subdomain = host?.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').split('.');
	if (subdomain?.includes('whi')) {
		return true;
	}
	if (subdomain?.every((element) => domainString.includes(element))) {
		return false;
	} else {
		return true;
	}
}