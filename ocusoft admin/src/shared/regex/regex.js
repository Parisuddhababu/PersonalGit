//  Common regex

export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#!@$%^&]).{8,40}$/;
export const EMAIL_REGEX = /^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/;
export const PHONENUMBER_REGEX = /^\+?[(]?\d{3}\)?[-\s\.]?\d{3}[-\s\.]?\d{3,8}$/im;
export const ONLY_NUMBER = /^[0-9\b]+$/;
export const ONLY_TWO_DEGITS = /^\d{1,2}$/
export const ONLY_CHARACTERS = /^[a-zA-Z]*$/
export const BLANK_SPACE = /^[^\s]+(\s+[^\s]+)*$/;

export const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/
export const YOUTUBE_URL_REGEX = /^(http:\/\/|https:\/\/)(vimeo\.com|player.vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)(\?.*)?$/
export const TITLE_MAXLENGTH = 100;
export const DESC_MAXLENGTH = 100;
export const CUST_TITLE_MAXLENGTH = 20;
export const CUST_DESC_MAXLENGTH = 450;
export const BENEFIT_TITLE_MAXLENGTH = 30;
export const STORE_TITLE_MAXLENGTH = 10;
export const TESTIMONIAL_TITLE_MAXLENGTH = 40;
export const SPECIAL_CHARCATER = /^[a-z0-9](?!.*?[^\na-z0-9]{2}).*?[a-z0-9]$/gmi;
export const NUMBER_GENERATOR_MAXLENGTH = 10;
export const ONLY_NUMBER_DASH = /^[0-9\-]+$/;
export const PINCODE_REGEX = /[^a-zA-Z0-9]/gm;
export const NAMECODE_MAXLENGTH = 50
export const FIRSTNAME_MAXLENGTH = 40;
export const LASTNAME_MAXLENGTH = 40;
export const DESCRIPTION_MAXLENGTH = 500;
export const PERCENTAGE_REGEX = /^(100(\.00?)?|[\d]?[\d](\.[\d][\d]?)?)$/ //NOSONAR
export const ONLY_LETTERS = /^[a-zA-Z\s]*$/
export const POSTAL_CODE_REGEX = /^[\d]{5,6}$/
export const PINCODE_REGEX2 = /^[a-zA-Z0-9]{5,}$/;
export const PINCODE_REGEX_TEN_CHARECTORS=/^[a-zA-Z0-9]{5,10}$/;