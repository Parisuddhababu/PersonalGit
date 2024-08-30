import * as Yup from 'yup';
import { EXCLUDE_SPECIAL_CHARACTERS, VERSION_REGEX } from './regex';
import { Errors } from './errors';
import { CHARACTERS_LIMIT } from './constant';

export const mixedRequired = (message: string) => {
	return Yup.mixed().required(message);
};

export const mixedNotRequired = () => {
	return Yup.mixed().notRequired();
};

export const stringRequired = (message: string) => {
	return Yup.string().required(message);
};

export const stringNotRequired = () => {
	return Yup.string().notRequired();
};

export const stringTrim = (message: string) => {
	return Yup.string().trim().required(message);
};

export const stringMaxLimit = (message: string) => {
	return stringTrim(message).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS);
};

export const stringNoSpecialChar = (message: string) => {
	return stringMaxLimit(message).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED);
};

export const numberRequired = (message: string) => {
	return Yup.number().required(message);
};

export const decimalValueRequired = (message: string) => {
	return stringMaxLimit(message).matches(VERSION_REGEX, Errors.DECIMAL_VALUE);
};

export const UuidValueRequired = (message: string) => {
	return Yup.string().required(message)
}
