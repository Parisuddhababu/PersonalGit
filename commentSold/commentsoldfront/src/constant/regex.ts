export const EMAIL_REGEX =
  /^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/;
export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#!@$%^&]).{8,40}$/;
export const PHONE_NUMBER_REGEX = /^\d{4,12}$/;
export const FIRST_AND_LAST_NAME_PATTERN = /^[a-zA-Z]+$/;
export const NAME_MINLENGTH = 3;
export const ONLY_CHARACTERS = /^[a-zA-Z]*$/;
export const ONLY_NUMBER = /^[0-9\b]+$/;
export const STRING_WITH_WHITESPACE_ONLY = /^[a-zA-Z,][a-zA-Z,\s]*$/;
export const OTP_REGEX = /^\d{1,6}$/;
export const BLANK_SPACE = /^[a-z0-9]+( [a-z0-9]+)*$/gi;
export const GST_NUM_VALIDATION = /\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]/;
export const TRIMMED_STRING = /^\S(?:.*\S)?$/;
export const NAME_STRING = /^[^\s\d][^\d]*(?:\s[^\s\d][^\d]*)*$/;
export const CARD_NUMBER = /^\d{16}$/
export const CARD_CODE = /^\d{3}$/
export const CARD_MONTH = /^(0[1-9]|1[0-2])$/
export const CARD_YEAR = /^\d{4}$/
export const FULL_NAME = /^[a-zA-Z ]*$/;
export const BRAND_NAME_VALIDATION = /^[a-z]+$/

export const IMAGES_VALIDATION = /^https?:\/\//
export const EMAIL_VALIDATION = /^([\w\.-]+(?:\+\d+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,})(?:,\s*[\w\.-]+(?:\+\d+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,})*$/

export const sortOrder = 'desc';
export const sortBy = 'created_at';
export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;
export const PASSWORD_REGEX1 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,40}$/;
export const ALLOW400CHAR = /^(?:[^\n]*\n){0,3}.{0,397}$/
export const ALLOW50CHAR = /^.{0,50}$/
export const ALLOW200CHAR = /^.{0,200}$/

export const TIKTOK_CLIENT_ID_REGEX = /^c_[a-zA-Z0-9]{10,}$/