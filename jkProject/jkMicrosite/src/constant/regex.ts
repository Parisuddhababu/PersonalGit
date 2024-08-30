/* eslint-disable */
export const EMAIL_REGEX =
  /^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/;
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&]).{8,40}$/;
export const PHONENUMBER_REGEX =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,8}$/im;
export const NAME_MAXLENGTH = 40;
export const NAME_MINLENGTH = 3;
export const ONLY_CHARACTERS = /^[a-zA-Z]*$/;
export const SPECIAL_CHARCATER = /^[a-z0-9 ](?!.*?[^\na-z0-9 ]{2}).*?[a-z0-9 ]$/gmi;
export const ONLY_NUMBER = /^[0-9\b]+$/;
export const PINCODE_REGEX = /^(\d{6})$/;
export const FIRSTNAME_MAXLENGTH = 40;
export const LASTNAME_MAXLENGTH = 40;
export const OTP_MAXLENGTH = 40;
export const STRING_WITH_WHITESPACE_ONLY = /^[a-zA-Z,][a-zA-Z,\s]*$/;
export const OTP_REGEX = /^[0-9]{1,6}$/;
export const BLANK_SPACE = /^[a-z0-9]+( [a-z0-9]+)*$/gi;
export const GST_NUM_VALIDATION = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
export const TRIMMED_STRING = /^\S(?:.*\S)?$/;


