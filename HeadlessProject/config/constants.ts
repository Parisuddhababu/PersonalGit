export const passRegex =
  /(?=.{8,})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])).*/

export const priceNumRegex = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/

export const skuRegex = /^[a-zA-Z0-9!@#$%^&*()\-=_+~`[\]{}|;:',.<>/?\\ ]{0,64}$/

export const emailRegex = /^\S+@\S+\.\S+$/

export const shopCountry = 'United States'
export const shopCountryCode = 'US'
