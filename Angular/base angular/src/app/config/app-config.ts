import { environment } from '../../environments/environment';

const BASE_URL = environment.apiEndpoint;
const API = '/api';
const API_V1 = environment.apiAdminVersion;
const API_V1_FRONT = environment.apiFrontVersion;
export const GOOGLE_ANALYTICS_ID = "G-T5SKZVZJ71";
export const ENABLE_GOOGLE_ANALYTICS = true;
export const CONFIG = {
  EncrDecrKey: '123456$#@$^@1ERF',
  // oauth
  userAuthURL: BASE_URL + API_V1 + '/oauth/signin',
  forgotPassURL: BASE_URL + API_V1 + '/oauth/password/forgot',
  validateResetPassURL: BASE_URL + API_V1 + '/oauth/password/validate_reset_token',
  resetPassURL: BASE_URL + API_V1 + '/oauth/password/reset',
  // after oauth
  getUserProfileIdURL: BASE_URL + API_V1 + '/user/profile',

  /* CMS MANAGEMENT - API */
  createCmsURL: BASE_URL + API_V1 + '/content_page/create',
  updateCmsURL: BASE_URL + API_V1 + '/content_page/update/',
  getCmsByIdURL: BASE_URL + API_V1 + '/content_page/show/',
  getAllCmsListURL: BASE_URL + API_V1 + '/content_page/list',
  changeCmsStatusURL: BASE_URL + API_V1 + '/content_page/change_status',
  storePageBuilderURL: BASE_URL + API_V1 + '/cms/cms-page-add-edit',
  loadPageBuilderURL: BASE_URL + API_V1 + '/cms/cms-page-load/',
  loadComponentURL: BASE_URL + API_V1 + '/cms/cms-page-preview/',

  /* EMAIL TEMPLATE - API */
  updateEmailURL: BASE_URL + API_V1 + '/email_template/update/',
  getEmailByIdURL: BASE_URL + API_V1 + '/email_template/show/',
  getAllEmailListURL: BASE_URL + API_V1 + '/email_template/list',
  changeEmailStatusURL: BASE_URL + API_V1 + '/email_template/change_status',

  /* FAQ MANAGEMENT - API */
  getAllFaqListURL: BASE_URL + API_V1 + '/faq/list',
  getFaqByIdURL: BASE_URL + API_V1 + '/faq/show/',
  changeFaqStatusURL: BASE_URL + API_V1 + '/faq/change_status',
  getFaqTopicListURL: BASE_URL + API_V1 + '/faq_topic/list',
  deleteFaqURL: BASE_URL + API_V1 + '/faq/delete/',
  updateFaqURL: BASE_URL + API_V1 + '/faq/update/',
  createFaqURL: BASE_URL + API_V1 + '/faq/create',

  /* MANAGE SUBADMIN - API */
  getAllSubadminListURL: BASE_URL + API_V1 + '/subadmin/list',
  getSubadminListForDropdownURL: BASE_URL + API_V1 + '/subadmin/dropdown-list',
  changeSubadminPassURL: BASE_URL + API_V1 + '/subadmin/password/change',
  changeSubadminStatusURL: BASE_URL + API_V1 + '/subadmin/change_status',
  deleteSubadminURL: BASE_URL + API_V1 + '/subadmin/delete/',
  getActiveRoleURL: BASE_URL + API_V1 + '/role/list_active/0',
  getSubadminByIdURL: BASE_URL + API_V1 + '/subadmin/show/',
  updateSubadminURL: BASE_URL + API_V1 + '/subadmin/update/',
  createSubadminURL: BASE_URL + API_V1 + '/subadmin/create',

  /* MANAGE USER - API */
  getAllManageUserListURL: BASE_URL + API_V1 + '/user/list',
  changeManageUserPassURL: BASE_URL + API_V1 + '/user/password/change',
  changeManageUserStatusURL: BASE_URL + API_V1 + '/user/change_status',
  deleteManageUserURL: BASE_URL + API_V1 + '/user/delete/',
  deleteUserProfileURL: BASE_URL + API_V1 + '/user/delete-profile/',
  getManagerUserByIdURL: BASE_URL + API_V1 + '/user/show/',
  updateManageUserURL: BASE_URL + API_V1 + '/user/update/',
  createManageUserURL: BASE_URL + API_V1 + '/user/create',
  importCSVFileURL: BASE_URL + API_V1 + '/import/user-import',
  lockManageUserURL: BASE_URL + API_V1 + '/entity-lock/check-or-lock',
  unlockManageUserURL: BASE_URL + API_V1 + '/entity-lock/unlock-entity',
  downloadSampleImportFileURL: BASE_URL + API_V1 + '/import/sample-user-import-file',

  /* SETTINGS API */
  getSettingsDataURL: BASE_URL + API_V1 + '/configuration/list',
  getSettingsSaveDataURL: BASE_URL + API_V1 + '/configuration/update',
  getSettingsRemoveImageURL: BASE_URL + API_V1 + '/configuration/delete-image/',
  // getSettingsImageDataURL: BASE_URL + API + '/configuration/images',
  getSettingsImageDataURL: BASE_URL + API_V1 + '/config/logo',

  /* MANAGE CATEGORY - API */
  getAllCategoryListURL: BASE_URL + API_V1 + '/category/list',
  getCategoryByIdURL: BASE_URL + API_V1 + '/category/show/',
  changeCategoryStatusURL: BASE_URL + API_V1 + '/category/change_status',
  deleteCategoryURL: BASE_URL + API_V1 + '/category/delete/',
  updateCategoryURL: BASE_URL + API_V1 + '/category/update/',
  createCategoryURL: BASE_URL + API_V1 + '/category/create',
  getCategoryTreeviewURL: BASE_URL + API_V1 + '/category/treeview/ng6',
  createCategoryTreeURL: BASE_URL + API_V1 + '/category/save',
  parentCategoryListURL: BASE_URL + API_V1 + '/category/parent_list/',

  /* SYSTEM PERMISSIONS - API */
  getAllRoleListURL: BASE_URL + API_V1 + '/role/list',
  changeRoleStatusURL: BASE_URL + API_V1 + '/role/change_status',
  createRoleURL: BASE_URL + API_V1 + '/role/create',
  updateRoleURL: BASE_URL + API_V1 + '/role/update/',
  getAllPermissionListURL: BASE_URL + API_V1 + '/permission/list',
  assignPermissionURL: BASE_URL + API_V1 + '/permission/role_assign/',

  updateProfileInfoURL: BASE_URL + API_V1 + '/subadmin/update_profile',
  changeProfilePassURL: BASE_URL + API_V1 + '/oauth/password/change',

  videoUploadURL: BASE_URL + '/front/api/v1/chunk/upload',

  /* MANAGE CONTACT - API */
  getAllContactListURL: BASE_URL + API_V1 + '/contact/list',
  deleteContactURL: BASE_URL + API_V1 + '/contact/delete/',
  changeStatusContactListURL: BASE_URL + API_V1 + '/contact/change-status',

  // Suggestion
  userSuggestionListURL: BASE_URL + API_V1 + '/suggestion/userlist',
  userSuggestionCreateURL: BASE_URL + API_V1 + '/suggestion/store',
  adminSuggestionListURL: BASE_URL + API_V1 + '/suggestion/list',
  suggestionChangeStatusURL: BASE_URL + API_V1 + '/suggestion/update/',
  suggestionDeleteURL: BASE_URL + API_V1 + '/suggestion/delete/',
  getActiveCategoryListURL: BASE_URL + API_V1 + '/category/getchild?parent_id=',
  exportSuggestionExcelURL: BASE_URL + API_V1 + '/export/export_suggetion_excel',
  exportSuggestionPDFURL: BASE_URL + API_V1 + '/export/export_suggetion_pdf',
  exportSuggestionCSVURL: BASE_URL + API_V1 + '/export/export_suggetion_csv',

  /* MANAGE SURVEY - API */
  getSurveyListURL: BASE_URL + API_V1 + '/survey/get_survey_list',
  changeSurveyStatusURL: BASE_URL + API_V1 + '/survey/update_status',
  deleteSurveyURL: BASE_URL + API_V1 + '/survey/delete/',
  getSurveyDetailsByIdURL: BASE_URL + API_V1 + '/survey/get_detailed_survey/',
  getSurveyByIdURL: BASE_URL + API_V1 + '/survey/get_survey/',
  updateSurveyURL: BASE_URL + API_V1 + '/survey/update',
  createSurveyURL: BASE_URL + API_V1 + '/survey/create',
  createSurveyQuestionsURL: BASE_URL + API_V1 + '/survey/add_questions',
  updateSurveyQuestionsURL: BASE_URL + API_V1 + '/survey/update_questions',
  getSurveyQuesAnsByIdURL: BASE_URL + API_V1 + '/survey/get_questions/',
  getAnswerForTextTypeURL: BASE_URL + API_V1 + '/survey/get_text_answers',
  getAnswerForSingleMultipleTypeURL: BASE_URL + API_V1 + '/survey/get_answered_users',
  getSurveyUserReportURL: BASE_URL + API_V1 + '/survey/get_survey_users',
  notifySurveyUserURL: BASE_URL + API_V1 + '/survey/resend_notification',
  getActiveSurveyListURL: BASE_URL + API_V1_FRONT + '/survey/active_surveys',
  updateUserSurveyAnsURL: BASE_URL + API_V1_FRONT + '/survey/save_answers',
  getAnswerDetailsByIdURL: BASE_URL + API_V1_FRONT + '/survey/get_user_answers/',

  /* MANAGE ANNOUNCEMENT - API */
  getAllAnnouncementListURL: BASE_URL + API_V1 + '/annoucement/list',
  createAnnouncementURL: BASE_URL + API_V1 + '/annoucement/create',
  getAnnouncementDetailsByIdURL: BASE_URL + API_V1 + '/annoucement/show',
  getAnnouncementUserDataURL: BASE_URL + API_V1 + '/annoucement/users',
  getAnnouncementUserSelectionListURL: BASE_URL + API_V1 + '/annoucement/user-selection-list',

  /* ACTIVITY TRACKING - API */
  getAllActivityTrackingListURL: BASE_URL + API_V1 + '/log/list',
  deleteActivityURL: BASE_URL + API_V1 + '/log/delete/',

  /* MANAGE BANNER - API */
  getAllBannerListURL: BASE_URL + API_V1 + '/banner/list',
  changeManageBannerStatusURL: BASE_URL + API_V1 + '/banner/change_status',
  deleteManageBannerURL: BASE_URL + API_V1 + '/banner/delete/',
  getManageBannerByIdURL: BASE_URL + API_V1 + '/banner/show/',
  createManageBannerURL: BASE_URL + API_V1 + '/banner/store',
  updateManageBannerURL: BASE_URL + API_V1 + '/banner/update/',

  /* MANAGE SUBSCRIPTION - API */
  getAllManageSubscrptionListURL: BASE_URL + API_V1 + '/plan_manage/list',
  getManagerSubscriptionByIdURL: BASE_URL + API_V1 + '/plan_manage/show/',
  updateManageSubscriptionURL: BASE_URL + API_V1 + '/plan_manage/update/',
  createManageSubscriptionURL: BASE_URL + API_V1 + '/plan_manage/create',
  changeManageSubscriptionStatusURL: BASE_URL + API_V1 + '/plan_manage/change_status',
  deleteManageSubscriptionURL: BASE_URL + API_V1 + '/plan_manage/delete/',

  // Download API
  fileDownloadURL: BASE_URL + API_V1 + '/download',
  exportUsersExcelURL: BASE_URL + API_V1 + '/export/export_users_excel',
  exportUsersPDFURL: BASE_URL + API_V1 + '/export/export_users_pdf',
  exportUsersCSVURL: BASE_URL + API_V1 + '/export/export_users_csv',

  // Manage Location
  /* COUNTRY - API */
  getAllCountryURL: BASE_URL + API_V1 + '/country/list',
  createCountryURL: BASE_URL + API_V1 + '/country/create',
  updateCountryURL: BASE_URL + API_V1 + '/country/update/',
  getCountryByIdURL: BASE_URL + API_V1 + '/country/show/',
  changeCountryStatusURL: BASE_URL + API_V1 + '/country/change_status',
  deleteCountryURL: BASE_URL + API_V1 + '/country/delete/',

  /* STATE - API */
  getAllStateURL: BASE_URL + API_V1 + '/state/list',
  createStateURL: BASE_URL + API_V1 + '/state/create',
  updateStateURL: BASE_URL + API_V1 + '/state/update/',
  getStateByIdURL: BASE_URL + API_V1 + '/state/show/',
  changeStateStatusURL: BASE_URL + API_V1 + '/state/change_status',
  deleteStateURL: BASE_URL + API_V1 + '/state/delete/',
  getActiveCountryURL: BASE_URL + API_V1 + '/country/get_all_country',

  /* CITY - API */
  getAllCityURL: BASE_URL + API_V1 + '/city/list',
  createCityURL: BASE_URL + API_V1 + '/city/create',
  updateCityURL: BASE_URL + API_V1 + '/city/update/',
  getCityByIdURL: BASE_URL + API_V1 + '/city/show/',
  changeCityStatusURL: BASE_URL + API_V1 + '/city/change_status',
  deleteCityURL: BASE_URL + API_V1 + '/city/delete/',
  getActiveStateURL: BASE_URL + API_V1 + '/state/get_all_states',

  /* MANAGE BS MEDIA - API */
  createFolderURL: BASE_URL + API_V1 + '/media-manager/create-folder',
  deleteFolderURL: BASE_URL + API_V1 + '/media-manager/delete-folder',
  getAllMediaFolderAndFileURL: BASE_URL + API_V1 + '/media-manager/get-media',
  uploadBsMediaURL: BASE_URL + API_V1 + '/media-manager/upload-media',
  renameBsMediaURL: BASE_URL + API_V1 + '/media-manager/rename-media',
  moveBsMediaURL: BASE_URL + API_V1 + '/media-manager/move-media',

  /* MANAGE OFFER - API */
  getAllManageOfferListURL: BASE_URL + API_V1 + '/offer/list',
  updateManageOfferURL: BASE_URL + API_V1 + '/offer/update/',
  createManageOfferURL: BASE_URL + API_V1 + '/offer/store',
  changeManageOfferStatusURL: BASE_URL + API_V1 + '/offer/status/',
  deleteManageOfferURL: BASE_URL + API_V1 + '/offer/delete/',
  exportOfferExcelURL: BASE_URL + API_V1 + '/export/export_offer_excel',
  exportOfferPDFURL: BASE_URL + API_V1 + '/export/export_offer_pdf',
  exportOfferCSVURL: BASE_URL + API_V1 + '/export/export_offer_csv',
  getManageOfferByIdURL: BASE_URL + API_V1 + '/offer/show/',
  exportUserExcelURL: BASE_URL + API_V1 + '/export/export_offer_user_excel',
  exportUserPDFURL: BASE_URL + API_V1 + '/export/export_offer_user_pdf',
  exportUserCSVURL: BASE_URL + API_V1 + '/export/export_offer_user_csv',
  getOfferReportListURL: BASE_URL + API_V1 + '/offer/getUserList/',
  getActiveUserURL: BASE_URL + API_V1 + '/offer/getActiveUserList',

  /* Report - API */
  getUserReportListURL: BASE_URL + API_V1 + '/report/list',
  deleteUserReportURL: BASE_URL + API_V1 + '/report/delete?id=',
  changeReportStatusURL: BASE_URL + API_V1 + '/report/status',

  /* Review - API */
  getReviewListURL: BASE_URL + API_V1 + '/reviews/list',
  deleteReviewURL: BASE_URL + API_V1 + '/reviews/delete?uuid=',
  changeReviewStatusURL: BASE_URL + API_V1 + '/reviews/status',

  /* Ruleset - API */
  getRulesetListURL: BASE_URL + API_V1 + '/rule-sets/list',
  createRulesetURL: BASE_URL + API_V1 + '/rule-sets/create',
  updateRulesetURL: BASE_URL + API_V1 + '/rule-sets/edit',
  getRulesetByIdURL: BASE_URL + API_V1 + '/rule-sets/view',
  changeRulesetStatusURL: BASE_URL + API_V1 + '/rule-sets/change-status',
  deleteRulesetURL: BASE_URL + API_V1 + '/rule-sets/delete',

  /* EVENT - API */
  getAllEventURL: BASE_URL + API_V1 + '/event/list',
  createEventURL: BASE_URL + API_V1 + '/event/create',
  updateEventURL: BASE_URL + API_V1 + '/event/update',
  getEventByIdURL: BASE_URL + API_V1 + '/event/show/',
  deleteEventURL: BASE_URL + API_V1 + '/event/delete/',
  getEventActiveUserURL: BASE_URL + API_V1 + '/event/getActiveUserList',

  //  DASHBOARD - API
  getDashboardCountURL: BASE_URL + API_V1 + '/firebase/get-analytics',
};
