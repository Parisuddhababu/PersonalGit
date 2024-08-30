import { shopCountry } from "config/constants"

export const isNonNullRecord = (
  item: unknown
): item is Record<string, unknown> => {
  return typeof item === 'object' && item !== null
}

export const isItemWithKeys = (
  item: unknown
): item is Record<string, unknown> | unknown[] => {
  return isNonNullRecord(item) || Array.isArray(item)
}

export const itemHasKey = (item: unknown, key: string): boolean => {
  if (!isItemWithKeys(item)) {
      return false
  }
  return key in item
}

export const itemHasKeys = (item: unknown, keys: string[]): boolean => {
  if (!isItemWithKeys(item)) {
      return false
  }
  let result = true
  keys.forEach((key) => {
      if (!(key in item)) {
          result = false
      }
  })
  return result
}

// Retrieve object value by path
export const deepValue = (
  obj: unknown,
  path: string[],
  defaultValue?: unknown
) => {
  if (!path || !isItemWithKeys(obj)) {
      return defaultValue
  }
  let result: any = obj
  for (const key of path) {
      if (!itemHasKey(result, key) || typeof result[key] === 'undefined') {
          return defaultValue
      }
      result = result[key]
  }
  return result
}

export const getCountryCode = (code?: string, countries?: any) => {
  const selectesShopCode = countries
  ?.find((country) => country?.two_letter_abbreviation === code)
  ?.full_name_locale?.toString()
  return selectesShopCode ?? shopCountry
}

export const getRegionLabelFromId = (regionId?: string | null, countries?: any, selectedCountryId?: any) => {
  const selectesShopCode = countries
  ?.find((country) => country?.two_letter_abbreviation === selectedCountryId)
  ?.available_regions?.find((reg) => reg?.id === Number(regionId))?.name
  return selectesShopCode ?? ''
}