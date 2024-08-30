// export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,16}$/
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,20}$/

export const EMAIL_REGEX=  /^[a-zA-Z0-9]+([._][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([._][a-zA-Z0-9]+)*\.[a-zA-Z]{2,7}$/

export const PHONE_REGEX=/^\d{10}$/

// export const NAME_VALIDATION= /^[a-zA-Z\s]+$/
export const NAME_VALIDATION = /^(?! +$)[A-Za-z\s]+$/

export const SPACE_REGEX=/^[a-zA-Z][a-zA-Z\s]*$/

export const SUBSCRIBER_LOCATIONS = /^(?! +$)[A-Za-z\d\s]+$/
