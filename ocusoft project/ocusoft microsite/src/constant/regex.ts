/* eslint-disable */
const currentYear = new Date().getFullYear();
export const EMAIL_REGEX =
  /^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/;
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#!@$%^&]).{8,40}$/;
export const PHONENUMBER_REGEX = /^(\+\d{1,3}[- ]?)?\d{10,12}$/;
export const NAME_MAXLENGTH = 40;
export const NAME_MINLENGTH = 3;
export const ONLY_CHARACTERS = /^[a-zA-Z]*$/;
export const SPECIAL_CHARCATER =
  /^[a-z0-9 ](?!.*?[^\na-z0-9 ]{2}).*?[a-z0-9 ]$/gim;
export const ONLY_NUMBER = /^[0-9\b]+$/;
export const PINCODE_REGEX = /^[a-zA-Z0-9]{5,}$/;
export const FIRSTNAME_MAXLENGTH = 40;
export const LASTNAME_MAXLENGTH = 40;
export const OTP_MAXLENGTH = 40;
export const STRING_WITH_WHITESPACE_ONLY = /^[a-zA-Z,][a-zA-Z,\s]*$/;
export const OTP_REGEX = /^\d{1,6}$/;
export const BLANK_SPACE = /^[a-z0-9]+( [a-z0-9]+)*$/gi;
export const GST_NUM_VALIDATION = /\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]/;
export const TRIMMED_STRING = /^\S(?:.*\S)?$/;
export const NAME_STRING = /^[^\s\d][^\d]*(?:\s[^\s\d][^\d]*)*$/;
export const SCRIPT_AND_DEVIDE = /<([a-z][^>\s\/]*)[^>]*>/gi;
export const CARD_NUMBER = /^\d{16}$/
export const CARD_CODE = /^\d{3}$/
export const CARD_MONTH = /^(0[1-9]|1[0-2])$/
export const CARD_YEAR = /^\d{4}$/
export const FULL_NAME = /^[a-zA-Z ]*$/;
