export enum announcementTypeValue {
  push = 'push',
  email = 'email',
  sms = 'sms',
}
export const announcementType = {
  [announcementTypeValue.push]: 'PUSH',
  [announcementTypeValue.email]: 'EMAIL',
  [announcementTypeValue.sms]: 'SMS',
};
export const announcementPlatforms = {
  all: 'ALL',
  android: 'ANDROID',
  ios: 'IOS',
  web: 'WEB',
};
export const announcementStatus = {
  '-1': 'Pending',
  '0': 'In-Progress',
  '1': 'Announced',
};
export enum announcementInclusionValue {
  exclude_selected = 'exclude_selected',
  only_selected = 'only_selected',
  all = 'all',
}
export const announcementInclusion = {
  [announcementInclusionValue.exclude_selected]: 'USER_TO_EXCLUDE',
  [announcementInclusionValue.only_selected]: 'ONLY_SEND_TO',
  [announcementInclusionValue.all]: 'ALL',
};
export const announcementUserRole = {
  USER: 'USER',
  ALL: 'ALL',
};
export const subscriptionValidity = {
  month: 'MONTHLY',
  // 'quarter': 'QUARTERLY',
  year: 'YEARLY',
};
export const subscriptionPlanType = {
  '1': 'TRIAL',
  '0': 'PAID',
};
export enum subscriptionTrialPlanValue {
  yes = '1',
  no = '0',
}
export const subscriptionTrialPlan = {
  [subscriptionTrialPlanValue.yes]: 'YES',
  [subscriptionTrialPlanValue.no]: 'NO',
};
export enum StatusValue {
  active = 'Active',
  inactive = 'Inactive',
}
export const statusList = {
  [StatusValue.active]: 'STATUS_LIST.ACTIVE',
  [StatusValue.inactive]: 'STATUS_LIST.INACTIVE',
};
