import React from 'react';
import UpdateProfileForm from '@views/adminProfile/updateAdmin';
import AddEditUser from '@views/userManagement/addEditUser';
import ViewUser from '@views/userManagement/viewUser';
import moment from 'moment';
import { APIServices } from 'src/services/axiosCommon';
import { toast } from 'react-toastify';
import DecryptionFunction from '../services/decryption';
import { ColArrType } from '../types';
const CMS = React.lazy(() => import('@views/CMS'));
const SystemCMS = React.lazy(() => import('@views/SystemCms'));
const SystemAddEditCms = React.lazy(() => import('@views/SystemCms/addEditCms'));
const AddEditCms = React.lazy(() => import('@views/CMS/addEditCms'));
const ManageCategory = React.lazy(() => import('@views/manageCategory'));
const Settings = React.lazy(() => import('@views/settingsPage'));
const Subscriber = React.lazy(() => import('@views/subscriber'));
const AddEditSubscriber = React.lazy(() => import('@views/subscriber/addEditSubscriber'));
const UserManagement = React.lazy(() => import('@views/userManagement'));
const Announcement = React.lazy(() => import('@views/announcement'));
const AddAnnouncement = React.lazy(() => import('@views/announcement/addAnnouncement'));
const EventManagement = React.lazy(() => import('@views/eventsManagement'));
const AddEditEvents = React.lazy(() => import('@views/eventsManagement/addEditEvent'));
const ViewEvent = React.lazy(() => import('@views/viewEvent'));
const AddEditCategory = React.lazy(() => import('@views/manageCategory/addEditCategory'));
const ViewNotification = React.lazy(() => import('@views/viewNotification'));
const ManageRulesSets = React.lazy(() => import('@views/rulesSetsManagement'));
const AddEditRulesSets = React.lazy(() => import('@views/rulesSetsManagement/addEditRulesSet'));
const ViewAnnouncement = React.lazy(() => import('@views/viewAnnouncement'));
const RolePermissions = React.lazy(() => import('@views/rolePermissions'));
const ManageOffer = React.lazy(() => import('@views/couponsManagement'));
const AddEditManageOffer = React.lazy(() => import('@views/couponsManagement/addEditCoupons'));
const MyAssignments = React.lazy(() => import('@views/myAssignments'));
const AllCourses = React.lazy(() => import('@views/allCourses'));
const SmartComposters = React.lazy(() => import('@views/smartComposters'));
const EquipmentMaintenance = React.lazy(() => import('@views/equipmentMaintenance'));
const MyAccount = React.lazy(() => import('@views/myAccount'));
const SmartLifters = React.lazy(() => import('@views/smartLifters'));
const CreateNewCourse = React.lazy(() => import('@views/createNewCourse'));
const TFSCoursesTemplates = React.lazy(() => import('@views/tfsCoursesTemplates'));
const ViewSubscriber = React.lazy(() => import('@views/subscriber/viewSubscriber'));
const NewUpdatedHeader = React.lazy(() => import('@components/header/newUpdatedHeader'));
const ComingSoon = React.lazy(() => import('@components/comingSoon/comingSoon'));
const TechnicalManualsAndGuidesPage = React.lazy(() => import('@views/technicalManualsGuides'));
const AddEditTechnicalManualsAndGuidesPage = React.lazy(() => import('@views/technicalManualsAndGuides/addEditTechnicalManualsGuides'));
const SubAddEditSubTechnicalManualsAndGuidesPage = React.lazy(() => import('@views/subTechnicalManualsAndGuides'));
const AddEditSubTechnicalManualsAndGuidesPage = React.lazy(() => import('@views/subTechnicalManualsAndGuides/subAddEditTechnicalManualsGuides'));
const Playlist = React.lazy(() => import('@views/playlist'));
const TenantDetailsPage = React.lazy(() => import('@views/tenantDetailsPage'));
const CourseDetails = React.lazy(() => import('@views/courseDetails'));
const CompaniesDirectoryManagement = React.lazy(() => import('@views/companiesDirectory'));
const CompaniesDirectoryManagementAdd = React.lazy(() => import('@views/companiesDirectory/addNewCompany'));
const CourseLearningProgressPage = React.lazy(() => import('@views/courseDetails/courseLearningProgressPage'));
const AddEditUserManual = React.lazy(() => import('@views/subTechnicalManualsAndGuides/addEditUserManual'));
const AddEditItemByCategory = React.lazy(() => import('@views/userManual/UserManualList/index'));
const AddEditItemByCategoryGrid = React.lazy(() => import('@views/userManual/UserManualGrid/index'));
const TechnicalManualMainPage = React.lazy(() => import('@views/technicalManual/index'));
const VendorDetailsPage = React.lazy(() => import('@views/vendorDetails'));
const UserManagementUpdated = React.lazy(() => import('@views/user/userManagement'));
const KpiDashboard = React.lazy(() => import('@views/dashboard'));
const PermissionDenied = React.lazy(() => import('@views/accessDenied'));
const WasteAudit = React.lazy(() => import('@views/wasteAudit'));
const CreateWasteAuditReportUI = React.lazy(() => import('@views/createWasteAuditReportUI'));
const SendAnnouncements = React.lazy(() => import('@views/sendAnnouncements'));
const ViewSubscriptionPlans = React.lazy(() => import('@views/subscriber/viewSubscriptionPlans'));
const SubscriptionPlanManagement = React.lazy(() => import('@views/subscriber/subscriptionPlanManagement'));
const UserDetails = React.lazy(() => import('@views/user/userDetails'));
const CustomerService = React.lazy(() => import('@views/customerService'));
const UploadInvoice = React.lazy(() => import('@views/uploadInvoice'));
const DownloadInvoice = React.lazy(() => import('@views/downloadInvoice'));
const EmployeeUser = React.lazy(() => import('@views/employeeUser'));
const ContractorManagement = React.lazy(() => import('@views/contractorManagement'));
const TenantManagement = React.lazy(() => import('@views/management/tenantManagement'));
const AssignCourse = React.lazy(() => import('@views/assignCourse'));
const LocationManagement = React.lazy(() => import('@views/locationManagement'));
const RequestedCompany = React.lazy(() => import('@views/companiesDirectory/requestedCompany'));
const TicketsList = React.lazy(() => import('@views/ticketList'));
const SystemAlerts = React.lazy(() => import('@views/ticketList/systemAlert'));
const LandingPageManagement = React.lazy(() => import('@views/landingPageManagement'));
const CourseInProgressList = React.lazy(() => import('@views/coursesInProgressList'));
const AllPlayListCourse = React.lazy(() => import('@views/playlistCourses'));
const CategoriesList = React.lazy(() => import('@views/categoryList'));
const AssignedCourseList = React.lazy(() => import('@views/assignedCourseList'));
const ZoneManagement = React.lazy(() => import('@views/zoneManagement'));
const VolumeManagement = React.lazy(() => import('@views/volumeManagement'));
const EquipmentManagement = React.lazy(() => import('@views/equipmentManagement'));
const MaterialManagement = React.lazy(() => import('@views/materialManagament'));
const FrequencyManagement = React.lazy(() => import('@views/frequencyManagement'));
const DiversionReportList = React.lazy(() => import('@views/diversionReport/index'));
const CreateDiversionReport = React.lazy(() => import('@views/diversionReport/createDiversionReport'));
const DiversionReport1 = React.lazy(() => import('@views/diversionReport/diversionReport1'));
const WeightList = React.lazy(() => import('@views/diversionReport/weightList'));
const DiversionSettings = React.lazy(() => import('@views/diversionReport/diversionSettings'));
const DiversionContractorList = React.lazy(() => import('@views/diversionContractors'));
const DiversionAdminManagement = React.lazy(() => import('@views/diversionAdminManagement'));
const DiversionReportHistoryList = React.lazy(() => import('@views/diversionReport/diversionReportHistoryList'))
const CourseAdminList = React.lazy(() => import('@views/courseAdmin/index'));
const CourseCreatorList = React.lazy(() => import('@views/courseCreator/index'));
const ArchivesManagement = React.lazy(() => import('@views/archivesManagement/index'));
const DraftsManagement = React.lazy(() => import('@views/draftsManagement/index'));
const LearnerManagement = React.lazy(() => import('@views/leanersManagement/index'));
const AllCourseByCategory = React.lazy(() => import('@views/categoryList/allCoursesByCategory'));

export const ROUTES: { [key: string]: string } = {
  login: 'login',
  app: 'app',
  dashboard: 'dashboard',
  kpidashboard: 'kpi-dashboard',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  resetToken: 'token',
  settings: 'settings',
  CMS: 'template',
  SystemCMS: 'system-template',
  subscriber: 'all-subscriber',
  user: 'user',
  event: 'event-management',
  manageRulesSets: 'manage-rules-sets',
  announcement: 'announcement',
  rolePermissions: 'user-roles-&-rights',
  profile: 'profile',
  educationAndEngagement: 'education-&-engagement',
  updateEducationAndEngagement: 'update-education-&-engagement',
  // subCategory: 'sub-category',
  category: 'manage-course-tags',
  manageOffer: 'manage-offer',
  geg: 'geg',
  alerts: 'alerts',
  playlist: 'manage-course-playlist',
  myAssignments: 'my-assignments',
  allCourses: 'all-courses',
  technicalManualsGuides: 'manage-categories',
  subTechnicalManualsGuides: 'manage-sub-categories',
  engagement: 'engagement',
  equipmentMaintenance: 'equipment-maintenance',
  myAccount: 'my-account-settings',
  smartLifters: 'smartLifters',
  smartComposters: 'smartComposters',
  tfsCoursesTemplates: 'all-courses-templates',
  viewSubscriber: 'viewSubscriber',
  newUpdatedHeader: 'new-header',
  courseDetails: 'course-details',
  companiesDirectoryManagement: 'companies-directory-management',
  quizResult: 'quiz-result',
  categoriesList: 'categories-list',
  quiz: 'play-quiz',
  tenantDetailsPage: 'tenant-details',
  courseLearningProgressPage: 'course-learning-progress-page',
  userManual: 'add-document',
  itemByCategoryList: 'item-by-category-list-view',
  itemByCategoryGrid: 'item-by-category-grid-view',
  itemByCategory: 'all-manuals-&-guides',
  createNewAccount: 'create-new-account',
  customerService: 'submit-a-support-ticket',
  uploadInvoice: 'upload-invoice',
  downloadInvoice: 'download-invoice',
  create3rdPartyCompanyAccount: 'create-3rd-party-company-account',
  contractor: 'contractor-account',
  vendorDetails: 'vendor-details',
  userDetails: 'user-details',
  userManagement: 'user-managements',
  userProfilePasswordChange: 'user-profile-password-change',
  wasteAudit: 'waste-audit',
  sendAnnouncements: 'send-announcements',
  permissionDenied: 'permission-denied',
  createWasteAuditReportUI: 'create-waste-audit-report-ui',
  viewSubscriptionPlans: 'view-subscription-plans',
  subscriptionPlanManagement: 'subscription-Plan-management',
  employeeUser: 'manage-user',
  contractorManagement: 'manage-contractors',
  tenantManagement: 'manage-tenants',
  assignCourse: 'assign-course',
  locationManagement: 'manage-locations',
  requestedCompany: 'requested-company',
  ticketsList: 'tickets-list',
  introductory: 'introductory',
  landingPageManagement: 'manage-landing-page',
  courseInProgressList: 'course-in-progress-list',
  allPlayListCourse: 'all-play-list-course',
  assignedCourseList: 'assigned-course-list',
  zone: 'manage-zones',
  diversionAdminManagement: 'diversion-admin-management',
  volumeManagement: 'volume',
  equipmentManagement: 'equipment',
  materialManagement: 'material',
  frequencyManagement: 'frequency',
  diversionReportList: 'diversion-report-Template',
  createDiversionReport: 'create-diversion-report',
  diversionReport1: 'report',
  weightList: 'add-weights',
  diversionSettings: 'report-frequency',
  diversionContractor: 'assigned-contractors',
  diversionReports: 'diversion-reports',
  viewReports: 'view-reports',
  courseAdminList: 'add-course-administrators',
  courseCreatorList: 'add-course-creator',
  draftsManagement: 'course-drafts',
  archivesManagement: 'course-archives',
  learnersManagement: 'manage-learners',
  allCourseByCategory: 'all-Course-By-Category'
};
export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Off = 5,
}

export const LogMethods: Record<LogLevel, keyof Console> = {
  [LogLevel.All]: 'log',
  [LogLevel.Debug]: 'debug',
  [LogLevel.Info]: 'info',
  [LogLevel.Warn]: 'warn',
  [LogLevel.Error]: 'error',
  [LogLevel.Off]: 'log',
};

export const CONFIG_CONSTANTS = {
  logLevel: LogLevel.All,
};

export const sortOrder = 'desc';

export const DATE_FORMAT = {
  dateFormat: 'MM/dd/yyyy hh:mm:ss',
  dateShortFormat: 'MM/dd/yyyy',
  momentDateTime24Format: 'MM/DD/YYYY hh:mm:ss',
  momentDateTime12Format: 'MM/DD/YYYY h:mm A',
  momentTime24Format: 'hh:mm:ss',
  momentTime12Format: 'hh:mm A',
  momentDateFormat: 'MM/DD/YYYY',
  DateHoursMinFormat: 'YYYY-MM-DD hh:mm',
  simpleDateFormat: 'YYYY-MM-DD',
};

export const KEYS = {
  authToken: 'authToken',
};
export const LOGOUT_WARNING_TEXT = 'Are you sure want to Logout ?';

export const DELETE_WARNING_TEXT = 'Are you sure want to delete this record ?';

export const CHANGE_STATUS_WARNING_TEXT = 'Are you sure want to change status ?';

export const GROUP_DELETE_WARNING_TEXT = 'Are you sure want to delete this records ?';

export const EDIT_WARNING_TEXT = 'Are you sure want to edit the record ?';

export const ARCHVIVES_WARNING_TEXT = 'Are you sure want to unarchive this record';

export const UNARCHVIVES_WARNING_TEXT = 'Are you sure want to archive this record';

export const PAGE_LENGTH = 2;

export const CHAPTER_EEROR_MESSAGE = 'Chapters not Added. Atleast one chapter is required.'

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const MAX_PDF_CHAPTER_SIZE = 25 * 1024 * 1024;

export const SHOW_PAGE_COUNT_ARR = [10, 20, 40, 50];
export const SHOW_PAGE_COUNT_ARR1 = [
  { name: '10', key: 10 },
  { name: '20', key: 20 },
  { name: '30', key: 30 },
];

export const STATUS_DRP = [
  { name: 'Select Status', key: '' },
  { name: 'Active', key: '1' },
  { name: 'Inactive', key: '0' },
];
export const STATUS_RADIO = [
  { name: 'Active', key: '1' },
  { name: 'Inactive', key: '2' },
];
export const TEMPLATE_TYPE_RADIO = [
  { name: 'Email', key: 'Email' },
  { name: 'Announcement', key: 'Notification' },
  { name: 'Both', key: 'Both' },
];
export const GENDER_DRP = [
  { name: 'Male', key: 1 },
  { name: 'Female', key: 2 },
  { name: 'Other', key: 3 },
];
export const GENDER_DRP1 = [
  { name: 'Female', key: '2' },
  { name: 'Male', key: '1' },
  { name: 'Other', key: '3' },
];
export const SuggestionCategoryDrpData = [
  { name: 'Pending', key: '2' },
  { name: 'Accepted', key: '1' },
  { name: 'Rejected', key: '0' },
];

export const AnnouncementType = [
  { name: 'Pending', key: '0' },
  { name: 'In-Progress', key: '1' },
  { name: 'Announced', key: '2' },
];
export const AnnouncementAddType = [
  { name: 'Email', key: 'email' },
  { name: 'Push', key: 'push' },
  { name: 'Sms', key: 'sms' },
];
export const SettingsDrpData = [
  { name: 'English', key: 'English' },
  { name: 'Spanish', key: 'Spanish' },
  { name: 'French', key: 'French' },
];
export const DurationDrpData = [
  { name: '1-5 min', key: '1-5' },
  { name: '6-10 min', key: '6-10' },
  { name: '11-15 min', key: '11-15' },
  { name: '16-20 min', key: '16-20' },
  { name: '21-25 min', key: '21-25' },
  { name: '26-30 min', key: '26-30' },
];
export const PronounceDrpData = [
  { name: 'She/her', key: 'She/her' },
  { name: 'He/him', key: 'He/him' },
  { name: 'They/them', key: 'They/them' },
];
export const CompaniesDirectoryDrpData = [
  { name: 'A-Z', key: 'name:ASC' },
  { name: 'Z-A', key: 'name:DESC' },
  { name: 'Newest', key: 'createdAt:DESC' },
  { name: 'Oldest', key: 'createdAt:ASC' },
];
export const TenantUserDetailsDrpData = [
  { name: 'A-Z', key: 'user.first_name:ascend' },
  { name: 'Z-A', key: 'user.first_name:descend' },
  { name: 'Newest', key: 'createdAt:descend' },
  { name: 'Oldest', key: 'createdAt:ascend' },
];
export const DownloadInvoiceDrpData = [
  { name: 'A-Z', key: 'title:ascend' },
  { name: 'Z-A', key: 'title:descend' },
  { name: 'Newest', key: 'createdAt:descend' },
  { name: 'Oldest', key: 'createdAt:ascend' },
];
export const WasteAuditDrpData = [
  { name: 'A-Z', key: 'title:ascend' },
  { name: 'Z-A', key: 'title:descend' },
  { name: 'Newest', key: 'createdAt:descend' },
  { name: 'Oldest', key: 'createdAt:ascend' },
];
export const AssignCourseDrpData = [
  { name: 'A-Z', key: 'first_name:ascend' },
  { name: 'Z-A', key: 'first_name:descend' },
  { name: 'Newest', key: 'createdAt:descend' },
  { name: 'Oldest', key: 'createdAt:ascend' },
];
export const SelectFromExistingDrpData = [
  { name: 'A-Z', key: 'name:ASC' },
  { name: 'Z-A', key: 'name:DESC' },
  { name: 'Newest', key: 'createdAt:ASC' },
  { name: 'Oldest', key: 'createdAt:DESC' },
];
export const TimerDrpData = [
  { name: '15 Min', key: '15' },
  { name: '30 Min', key: '30' },
  { name: '45 Min', key: '45' },
  { name: '60 Min', key: '60' },
];

export const AnnouncementRole = [
  { name: 'Customer', key: '0' },
  { name: 'Admin', key: '1' },
  { name: 'SuperAdmin', key: '2' },
];

export const AnnouncementPlatform = [
  { name: 'All', key: 'all' },
  { name: 'Android', key: 'android' },
  { name: 'Ios', key: 'ios' },
  { name: 'Web', key: 'web' },
];
export const SideBarDrp = [
  { name: 'onHover', key: '1' },
  { name: 'Normal', key: '0' },
];

export const PlanStatus = [
  { name: 'Active', key: '1' },
  { name: 'inactive', key: '3' },
];
export const SubscribedPlan = [
  { name: '1 Months', key: 1 },
  { name: '3 Months', key: 3 },
  { name: '6 Months', key: 6 },
  { name: '9 Months', key: 9 },
  { name: '12 Months', key: 12 },
];
export const UserProfileLanguage = [
  { name: 'English', code: 'English' },
  { name: 'French', code: 'French' },
  { name: 'German', code: 'German' },
];

export const UserProfileEducation = [
  { name: 'Recycling Waste', code: 'Recycling Waste' },
  { name: 'Carbon Zero', code: 'Carbon Zero' },
];
export const AUTHORIZE_PERSON_USER_TYPE = {
  USER: 1,
  TENANT: 2,
  CONTRACTOR: 3,
};
export const ZoneManagementDrpData = [
  { name: 'A-Z', key: 'location:ascend' },
  { name: 'Z-A', key: 'location:descend' },
  { name: 'Newest', key: 'createdAt:descend' },
  { name: 'Oldest', key: 'createdAt:ascend' },
];
export const allServiceTypes = [
  { name: 'Select Service Type', key: '' },
  { name: 'Regular', key: 'Regular' },
  { name: 'Regular on call', key: 'Regular on call' },
  { name: 'One time service', key: 'One time service' }
]
export const serviceTypeDrpDataHistory = [
  { name: 'Select Service Type', key: '' },
  { name: 'One time service', key: 'One time service' }
]
export const serviceTypeDrpDataTemplate = [
  { name: 'Regular', key: 'Regular' },
  { name: 'Regular on call', key: 'Regular on call' },
];
export const serviceTypeDrpDataWeights = [
  { name: 'Regular', key: 'Regular' },
  { name: 'Regular on call', key: 'Regular on call' },
];

export const COL_ARR_REJECT_IMPORT_USER = [
  { name: 'Sr.No', sortable: false },
  { name: 'First Name', sortable: true, fieldName: 'first_name' },
  { name: 'Last Name', sortable: true, fieldName: 'last_name' },
  { name: 'email', sortable: true, fieldName: 'email' },
  { name: 'Phone Number', sortable: true, fieldName: 'phone_number' },
  { name: 'Role', sortable: true, fieldName: 'role' },
  { name: 'Reason', sortable: true, fieldName: 'reason' },
] as ColArrType[];

const encryptedToken = localStorage.getItem('authToken') as string;
export const token = encryptedToken && DecryptionFunction(encryptedToken);
export const ApiUrl = `${process.env.REACT_APP_API_BASE_URL}/`
export const ApiMedia = `${process.env.REACT_APP_API_BASE_URL}/media`
export const ApiAttachment = `${process.env.REACT_APP_API_BASE_URL}/media/attachment`
export const ImageUrl = `${process.env.REACT_APP_IMAGE_BASE_URL}`
export const API_DOWNLOAD_CERTIFICATE_END_POINT = `${process.env.REACT_APP_API_BASE_URL}/pdf/generate-certificate`
export const API_MEDIA_END_POINT = `${process.env.REACT_APP_API_BASE_URL}/media`;
export const API_MEDIA_SIGN_URL_END_POINT = `${process.env.REACT_APP_API_BASE_URL}/media/getSignUrl`;
export const API_MEDIA_PRE_SIGN_URL_END_POINT = `${process.env.REACT_APP_API_BASE_URL}/media/pre-signUrl`;
export const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/`;
export const IMAGE_BASE_URL = `${process.env.REACT_APP_IMAGE_BASE_URL}/`
export const AXIOS_HEADERS = { 'Content-Type': 'multipart/form-data', authorization: token ? `Bearer ${token}` : '' };
export const PAGE_LIMIT = 10;
export const PAGE_NUMBER = 1;
export const CREATE_NEW_COMPANY_LOAD_DATA = 6;
export const SubscriberStatus = { ACTIVE: 1, INACTIVE: 3 };
export const ContractorStatus = { ACTIVE: 1, INACTIVE: 2 };
export const ImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
export const ImageSize = 2 * 1024 * 1024;
export const COUSER_FLAG = {
  isDraft: 1,
  isArchives: 2,
  isDoArchive:1,
  unArchive: 2,
}
export const ModuleNames = [
  'CMS Management',
  'FAQ Management',
  'ROLE',
  'SUB ADMIN',
  'EMAIL TEMPLATE',
  'USER',
  'SETTINGS',
  'CATEGORY',
  'Suggestion',
  'EVENT MANAGEMENT',
  'Entity Lock',
];
export const RedirectPages = {
  dashBoard: '/app/dashboard',
  kpidashboard: `/${ROUTES.app}/kpi-dashboard`,
  user: `/${ROUTES.app}/${ROUTES.user}`,
  role: `/${ROUTES.app}/${ROUTES.role}`,
  cms: `/${ROUTES.app}/${ROUTES.CMS}`,
  systemCms: `/${ROUTES.app}/${ROUTES.SystemCMS}`,
  subscriber: `/${ROUTES.app}/${ROUTES.subscriber}`,
  addSubscriber:`/${ROUTES.app}/${ROUTES.subscriber}/add`,
  settings: `/${ROUTES.app}/${ROUTES.settings}`,
  events: `/${ROUTES.app}/${ROUTES.event}`,
  category: `/${ROUTES.app}/${ROUTES.category}`,
  manageRulesSets: `/${ROUTES.app}/${ROUTES.manageRulesSets}`,
  announcement: `/${ROUTES.app}/${ROUTES.announcement}`,
  rolePermissions: `/${ROUTES.app}/${ROUTES.rolePermissions}`,
  manageOffer: `/${ROUTES.app}/${ROUTES.manageOffer}`,
  alerts: `/${ROUTES.app}/${ROUTES.alerts}`,
  myAssignments: `/${ROUTES.app}/${ROUTES.myAssignments}`,
  allCourses: `/${ROUTES.app}/${ROUTES.allCourses}`,
  equipmentMaintenance: `/${ROUTES.app}/${ROUTES.equipmentMaintenance}`,
  technicalManualsGuides: `/${ROUTES.app}/${ROUTES.technicalManualsGuides}`,
  subTechnicalManualsGuides: `/${ROUTES.app}/${ROUTES.subTechnicalManualsGuides}`,
  engagement: `/${ROUTES.app}/${ROUTES.engagement}`,
  smartLifters: `/${ROUTES.app}/${ROUTES.smartLifters}`,
  smartComposters: `/${ROUTES.app}/${ROUTES.smartComposters}`,
  myAccount: `/${ROUTES.app}/${ROUTES.myAccount}`,
  profile: `/${ROUTES.app}/${ROUTES.profile}`,
  educationAndEngagement: `/${ROUTES.app}/${ROUTES.educationAndEngagement}`,
  updateEducationAndEngagement: `/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}`,
  tfsCoursesTemplates: `/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}`,
  companiesDirectoryManagement: `/${ROUTES.app}/${ROUTES.companiesDirectoryManagement}`,
  courseLearningProgressPage: `${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/${ROUTES.courseLearningProgressPage}`,
  userManual: `/${ROUTES.app}/${ROUTES.subTechnicalManualsGuides}/${ROUTES.userManual}`,
  quizResult: `/${ROUTES.app}/${ROUTES.quizResult}`,
  categoriesList: `/${ROUTES.app}/${ROUTES.categoriesList}`,
  quiz: `/${ROUTES.app}/${ROUTES.quiz}`,
  tenantDetailsPage: `/${ROUTES.app}/${ROUTES.tenantDetailsPage}`,
  courseDetails: `/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}`,
  playlist: `${ROUTES.app}/${ROUTES.playlist}`,
  itemByCategory: `${ROUTES.app}/${ROUTES.itemByCategory}`,
  vendorDetails: `${ROUTES.app}/${ROUTES.vendorDetails}`,
  userManagement: `${ROUTES.app}/${ROUTES.userManagement}`,
  userDetails: `${ROUTES.app}/${ROUTES.userDetails}`,
  customerService: `${ROUTES.app}/${ROUTES.customerService}`,
  uploadInvoice: `${ROUTES.app}/${ROUTES.uploadInvoice}`,
  downloadInvoice: `${ROUTES.app}/${ROUTES.downloadInvoice}`,
  wasteAudit: `${ROUTES.app}/${ROUTES.wasteAudit}`,
  sendAnnouncements: `${ROUTES.app}/${ROUTES.sendAnnouncements}`,
  permissionDenied: `${ROUTES.app}/${ROUTES.permissionDenied}`,
  createWasteAuditReportUI: `${ROUTES.app}/${ROUTES.createWasteAuditReportUI}`,
  createNewAccount: `${ROUTES.app}/${ROUTES.createNewAccount}`,
  viewSubscriptionPlans: `${ROUTES.app}/${ROUTES.viewSubscriptionPlans}`,
  subscriptionPlanManagement: `/${ROUTES.app}/${ROUTES.subscriptionPlanManagement}`,
  employeeUser: `/${ROUTES.app}/${ROUTES.employeeUser}`,
  contractorManagement: `/${ROUTES.app}/${ROUTES.contractorManagement}`,
  tenantManagement: `/${ROUTES.app}/${ROUTES.tenantManagement}`,
  assignCourse: `/${ROUTES.app}/${ROUTES.assignCourse}`,
  locationManagement: `/${ROUTES.app}/${ROUTES.locationManagement}`,
  requestedCompany: `/${ROUTES.app}/${ROUTES.requestedCompany}`,
  ticketsList: `/${ROUTES.app}/${ROUTES.ticketsList}`,
  landingPageManagement: `/${ROUTES.app}/${ROUTES.landingPageManagement}`,
  courseInProgressList: `/${ROUTES.app}/${ROUTES.courseInProgressList}`,
  allPlayListCourse: `/${ROUTES.app}/${ROUTES.allPlayListCourse}`,
  assignedCourseList: `/${ROUTES.app}/${ROUTES.assignedCourseList}`,
  systemCMS: `/${ROUTES.app}/${ROUTES.SystemCMS}`,
  ZoneManagement: `/${ROUTES.app}/${ROUTES.zone}`,
  diversionAdminManagement: `/${ROUTES.app}/${ROUTES.diversionAdminManagement}`,
  volumeManagement: `/${ROUTES.app}/${ROUTES.volumeManagement}`,
  equipmentManagement: `/${ROUTES.app}/${ROUTES.equipmentManagement}`,
  materialManagement: `/${ROUTES.app}/${ROUTES.materialManagement}`,
  frequencyManagement: `/${ROUTES.app}/${ROUTES.frequencyManagement}`,
  diversionReportList: `/${ROUTES.app}/${ROUTES.diversionReportList}`,
  createDiversionReport: `/${ROUTES.app}/${ROUTES.diversionContractor}/${ROUTES.createDiversionReport}`,
  diversionReport1: `/${ROUTES.app}/${ROUTES.viewReports}/${ROUTES.diversionReport1}`,
  weightList: `/${ROUTES.app}/${ROUTES.weightList}`,
  diversionSettings: `/${ROUTES.app}/${ROUTES.diversionSettings}`,
  diversionContractor: `/${ROUTES.app}/${ROUTES.diversionContractor}`,
  viewReports: `/${ROUTES.app}/${ROUTES.viewReports}`,
  courseCreator: `/${ROUTES.app}/${ROUTES.courseCreatorList}`,
  courseAdmin: `/${ROUTES.app}/${ROUTES.courseAdminList}`,
  learnerManagement: `/${ROUTES.app}/${ROUTES.learnersManagement}`,
  archivesManagement: `/${ROUTES.app}/${ROUTES.archivesManagement}`,
  draftsManagement: `/${ROUTES.app}/${ROUTES.draftsManagement}`,
  allCourseByCategory: `/${ROUTES.app}/${ROUTES.allCourseByCategory}/?`
};

export const privateRoutes = [
  { path: ROUTES.dashboard, element: ComingSoon },
  { path: ROUTES.kpidashboard, element: KpiDashboard },
  { path: `${ROUTES.CMS}`, element: CMS },
  { path: `${ROUTES.CMS}/add`, element: AddEditCms },
  { path: `${ROUTES.CMS}/edit/:id`, element: AddEditCms },
  { path: `${ROUTES.SystemCMS}`, element: SystemCMS },
  { path: `${ROUTES.SystemCMS}/edit/:id`, element: SystemAddEditCms },
  { path: `${ROUTES.subscriber}`, element: Subscriber },
  { path: `${ROUTES.subscriber}/add`, element: AddEditSubscriber },
  { path: `${ROUTES.subscriber}/edit/:id`, element: AddEditSubscriber },
  { path: `${ROUTES.settings}`, element: Settings },
  { path: `${ROUTES.user}/list`, element: UserManagement },
  { path: `${ROUTES.userDetails}`, element: UserDetails },
  { path: `${ROUTES.announcement}`, element: Announcement },
  { path: `${ROUTES.announcement}/add`, element: AddAnnouncement },
  { path: `${ROUTES.announcement}/view/:id`, element: ViewAnnouncement },
  { path: `${ROUTES.user}/add`, element: AddEditUser },
  { path: `${ROUTES.user}/edit/:id`, element: AddEditUser },
  { path: `${ROUTES.user}/view/:id`, element: ViewUser },
  { path: `${ROUTES.event}/list`, element: EventManagement },
  { path: `${ROUTES.event}/edit/:id`, element: AddEditEvents },
  { path: `${ROUTES.event}/view/:id`, element: ViewEvent },
  { path: `${ROUTES.event}/add`, element: AddEditEvents },
  { path: `${ROUTES.category}`, element: ManageCategory },
  { path: `${ROUTES.category}`, element: ManageCategory },
  { path: `${ROUTES.category}/edit/:id`, element: AddEditCategory },
  { path: `${ROUTES.category}/add`, element: AddEditCategory },
  // { path: `${ROUTES.category}/treeView`, element: CategoryTreeView },
  { path: `${ROUTES.notifications}/view/:id`, element: ViewNotification },
  { path: `${ROUTES.manageRulesSets}/list`, element: ManageRulesSets },
  { path: `${ROUTES.manageRulesSets}/add`, element: AddEditRulesSets },
  { path: `${ROUTES.manageRulesSets}/edit/:id`, element: AddEditRulesSets },
  { path: `${ROUTES.profile}`, element: UpdateProfileForm },
  { path: `${ROUTES.educationAndEngagement}`, element: CreateNewCourse },
  { path: `${ROUTES.updateEducationAndEngagement}/?`, element: CreateNewCourse },
  { path: `${ROUTES.rolePermissions}`, element: RolePermissions },
  { path: `${ROUTES.manageOffer}/list`, element: ManageOffer },
  { path: `${ROUTES.manageOffer}/add`, element: AddEditManageOffer },
  { path: `${ROUTES.manageOffer}/edit/:id`, element: AddEditManageOffer },
  { path: `${ROUTES.subscriber}/view/:id`, element: ViewSubscriber },
  { path: `${ROUTES.alerts}`, element: Announcement },
  { path: `${ROUTES.myAssignments}`, element: MyAssignments },
  { path: `${ROUTES.allCourses}`, element: AllCourses },
  { path: `${ROUTES.engagement}`, element: ComingSoon },
  { path: `${ROUTES.smartLifters}`, element: SmartLifters },
  { path: `${ROUTES.technicalManualsGuides}`, element: TechnicalManualsAndGuidesPage },
  { path: `${ROUTES.technicalManualsGuides}/add`, element: AddEditTechnicalManualsAndGuidesPage },
  { path: `${ROUTES.technicalManualsGuides}/edit/:id`, element: AddEditTechnicalManualsAndGuidesPage },
  { path: `${ROUTES.subTechnicalManualsGuides}`, element: SubAddEditSubTechnicalManualsAndGuidesPage },
  { path: `${ROUTES.subTechnicalManualsGuides}/add`, element: AddEditSubTechnicalManualsAndGuidesPage },
  { path: `${ROUTES.subTechnicalManualsGuides}/edit/:id`, element: AddEditSubTechnicalManualsAndGuidesPage },
  { path: `${ROUTES.smartComposters}`, element: SmartComposters },
  { path: `${ROUTES.equipmentMaintenance}`, element: EquipmentMaintenance },
  { path: `${ROUTES.myAccount}`, element: MyAccount },
  { path: `${ROUTES.tfsCoursesTemplates}`, element: TFSCoursesTemplates },
  { path: `${ROUTES.newUpdatedHeader}`, element: NewUpdatedHeader },
  { path: `${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}`, element: CourseDetails },
  { path: `${ROUTES.companiesDirectoryManagement}`, element: CompaniesDirectoryManagement },
  { path: `${ROUTES.companiesDirectoryManagement}/add`, element: CompaniesDirectoryManagementAdd },
  // { path: `${ROUTES.quizResult}`, element: QuizResult },
  { path: `${ROUTES.categoriesList}`, element: CategoriesList },
  // { path: `${ROUTES.quiz}`, element: Quiz },
  { path: `${ROUTES.tenantDetailsPage}`, element: TenantDetailsPage },
  { path: `${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/${ROUTES.courseLearningProgressPage}/:id`, element: CourseLearningProgressPage },
  { path: `${ROUTES.subTechnicalManualsGuides}/${ROUTES.userManual}`, element: AddEditUserManual },
  { path: `${ROUTES.itemByCategory}`, element: TechnicalManualMainPage },
  { path: `${ROUTES.itemByCategory}/${ROUTES.itemByCategoryList}/:id`, element: AddEditItemByCategory },
  { path: `${ROUTES.itemByCategory}/${ROUTES.itemByCategoryGrid}/:id`, element: AddEditItemByCategoryGrid },
  { path: `${ROUTES.playlist}`, element: Playlist },
  { path: `${ROUTES.vendorDetails}`, element: VendorDetailsPage },
  { path: `${ROUTES.userManagement}`, element: UserManagementUpdated },
  { path: `${ROUTES.wasteAudit}`, element: WasteAudit },
  { path: `${ROUTES.sendAnnouncements}`, element: SendAnnouncements },
  { path: `${ROUTES.permissionDenied}`, element: PermissionDenied },
  { path: `${ROUTES.createWasteAuditReportUI}`, element: CreateWasteAuditReportUI },
  { path: `${ROUTES.viewSubscriptionPlans}`, element: ViewSubscriptionPlans },
  { path: `${ROUTES.subscriptionPlanManagement}`, element: SubscriptionPlanManagement },
  { path: `${ROUTES.customerService}`, element: CustomerService },
  { path: `${ROUTES.uploadInvoice}`, element: UploadInvoice },
  { path: `${ROUTES.downloadInvoice}`, element: DownloadInvoice },
  { path: `${ROUTES.employeeUser}`, element: EmployeeUser },
  { path: `${ROUTES.contractorManagement}`, element: ContractorManagement },
  { path: `${ROUTES.tenantManagement}`, element: TenantManagement },
  { path: `${ROUTES.assignCourse}`, element: AssignCourse },
  { path: `${ROUTES.locationManagement}`, element: LocationManagement },
  { path: `${ROUTES.requestedCompany}`, element: RequestedCompany },
  { path: `${ROUTES.ticketsList}`, element: TicketsList },
  { path: `${ROUTES.ticketsList}/system-alert/:id`, element: SystemAlerts },
  { path: `${ROUTES.landingPageManagement}`, element: LandingPageManagement },
  { path: `${ROUTES.courseInProgressList}`, element: CourseInProgressList },
  { path: `${ROUTES.allPlayListCourse}`, element: AllPlayListCourse },
  { path: `${ROUTES.assignedCourseList}`, element: AssignedCourseList },
  { path: `${ROUTES.zone}?`, element: ZoneManagement },
  { path: `${ROUTES.diversionAdminManagement}`, element: DiversionAdminManagement },
  { path: `${ROUTES.zone}?`, element: ZoneManagement },
  { path: `${ROUTES.volumeManagement}`, element: VolumeManagement },
  { path: `${ROUTES.equipmentManagement}`, element: EquipmentManagement },
  { path: `${ROUTES.materialManagement}`, element: MaterialManagement },
  { path: `${ROUTES.frequencyManagement}`, element: FrequencyManagement },
  { path: `${ROUTES.diversionReportList}`, element: DiversionReportList },
  { path: `${ROUTES.diversionContractor}/${ROUTES.createDiversionReport}/?`, element: CreateDiversionReport },
  { path: `${ROUTES.viewReports}/${ROUTES.diversionReport1}/?`, element: DiversionReport1 },
  { path: `${ROUTES.weightList}`, element: WeightList },
  { path: `${ROUTES.diversionSettings}/?`, element: DiversionSettings },
  { path: `${ROUTES.diversionContractor}`, element: DiversionContractorList },
  { path: `${ROUTES.viewReports}`, element: DiversionReportHistoryList },
  { path: `${ROUTES.courseAdminList}`, element: CourseAdminList },
  { path: `${ROUTES.courseCreatorList}`, element: CourseCreatorList },
  { path: `${ROUTES.draftsManagement}`, element: DraftsManagement },
  { path: `${ROUTES.archivesManagement}`, element: ArchivesManagement },
  { path: `${ROUTES.learnersManagement}/?`, element: LearnerManagement },
  { path: `${ROUTES.allCourseByCategory}/?`, element: AllCourseByCategory }
];

function getMimeType(base64String: string) {
  // Extract the base64 format from the string (e.g., "data:image/jpeg;base64,")
  const base64Format = RegExp(/^data:([A-Za-z-+]+);base64,(.+)$/).exec(base64String);

  if (base64Format && base64Format.length === 3) {
    return base64Format[1];
  }

  // If the format is not recognized, return a default MIME type (e.g., 'application/octet-stream')
  return 'application/octet-stream';
}

export const DATA_URL_TO_FILE = (base64: string, fileName: string) => {
  const mimeType = getMimeType(base64);
  const base64Data = base64.split(',')[1];

  // Convert the base64 data to a binary array
  const binaryData = atob(base64Data);

  // Create an array buffer
  const arrayBuffer = new ArrayBuffer(binaryData.length);

  // Create a view for the array buffer
  const uint8Array = new Uint8Array(arrayBuffer);

  // Copy the binary data to the array buffer
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the array buffer
  const blob = new Blob([arrayBuffer], { type: mimeType });

  // Create a File from the Blob
  const file = new File([blob], fileName, { type: mimeType });

  return file;
};

export const STRIP_HTML_TAGS = (input: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  return doc.body.textContent ?? '';
};

export const ConvertMinutesToHours = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  if (minutes === 0) {
    const remainingSeconds = seconds % 60;
    return `${remainingSeconds} s`;
  } else if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return `${minutes} m ${remainingSeconds} s`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} h ${remainingMinutes} m`;
  }
};

export const convertMinutesToHoursAndMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60
  return {
    hours: hours,
    minutes: remainingMinutes
  };
}

export const FormattedDate = (createdDateString: string | undefined) => {
  if (createdDateString) {
    return new Date(createdDateString).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
  }
  return '';
};

export const USER_TYPE = {
  SUPER_ADMIN: 1,
  SUBSCRIBER_ADMIN: 2,
  SUBSCRIBER_EMPLOYEE: 3,
  SUBSCRIBER_TENANT: 4,
  SUBSCRIBER_CONTRACTOR: 5,
  SUBSCRIBER_TENANT_SUB_ADMIN: 6,
  SUBSCRIBER_SUB_ADMIN_CONTRACTOR: 7,
  DIVERSION_ADMIN: 8,
  COURSE_CREATOR: 9,
  COURSE_ADMIN: 10,
};

export const UserTypes: { [key: string]: string } = {
  ['3']: 'Employee',
  ['6']: 'Sub Admin Tenant',
  ['7']: 'Sub Admin Contractor'
}

export const DrpUserType = [
  { name: 'Employee', key: 3 },
  { name: 'Tenant', key: 4 },
  { name: 'Contractor', key: 5 },
  { name: 'Sub Admin Tenant', key: 6 },
  { name: 'Sub Admin Contractor', key: 7 },
  { name: 'Diversion Admin', Key: 8 }
]

export const DateYearFormat = (data: string) => {
  return moment(data).format('DD MMMM, YYYY');
};

export const DateTime12Format = (data: string) => {
  const timestampString = data;
  const dateObject = new Date(timestampString);

  const hours = dateObject.getUTCHours();
  const minutes = dateObject.getUTCMinutes();

  // Convert hours to AM/PM format
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12-hour format

  return `${formattedHours}:${minutes} ${amOrPm}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NumberFixedDigit = (data: any) => {
  const progressData = Number.isInteger(data) ? data.toString() : parseFloat(data)?.toFixed(2);
  const courseProgressData = typeof data === 'number' ? progressData : data;
  return courseProgressData;
};

export const updateBranchId = (newBranchId: string) => {
  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Update the branch_id parameter
  currentUrl.searchParams.set('branch_id', newBranchId);

  // Replace the current state in history without reloading the page
  window.history.replaceState({}, '', currentUrl.toString());
};

export const JoinedPhoneNumbersWithCode = (phone_number: string[], country_code: string[]) => {
  const zippedNumbers = phone_number?.map((phoneNumber, index) => {
    const countryCode = country_code[index] || '';
    return `+${countryCode} ${phoneNumber}`;
  });

  const joinedNumbers = zippedNumbers?.join(', ');

  return joinedNumbers;
};


export const uploadImage = async (formData: FormData, path = '') => {
  try {

    let apiEndPoint = API_MEDIA_END_POINT;
    if (path) {
      apiEndPoint += `/${path}`
    }
    const response = await APIServices.postData(apiEndPoint, formData);
    if (response?.data?.data?.acl == 'private') {
      const signUrl = await getSignUrl(response?.data?.data?.key);
      return { ...response?.data?.data, imageUrl: signUrl }
    }
    return response?.data?.data?.key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.data?.message);
    return null;
  }
};

export const uploadImage__sample = async (formData: any, path = '') => {
	try {

		const presignURL = await getPreSignUrl(path, formData.name);

		await fetch(presignURL, {
			method: 'PUT',
			headers: {
			  'Content-Type': formData.type,
			},
			body: formData,
		});
		return '';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		toast.error(error?.data?.message);
		return null;
	}
};

export const uploadAttachment = async (formData: FormData, path = '') => {
  try {
    let apiEndPoint = API_MEDIA_END_POINT + '/attachment';
    if (path) {
      apiEndPoint += `/${path}`
    }
    const response = await APIServices.postData(apiEndPoint, formData);

    if (response?.data?.data?.acl == 'private') {
      const signUrl = await getSignUrl(response?.data?.data?.key);
      return { ...response?.data?.data, fileUrl: signUrl }
    }
    return response?.data?.data?.key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.data?.message);
    return null;
  }
};

export const getSignUrl = async (fileName: string) => {
  try {
    const response = await APIServices.postData(API_MEDIA_SIGN_URL_END_POINT, { url: fileName });
    return response?.data?.data || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.data?.message);
    return null;
  }
}

export const getPreSignUrl = async (path: string, fileName: string) => {
  try {
    fileName = `${fileName}`
    const acl = 'public-read'
    if (path == 'profile') {
      path = 'tfs_public/profile'
    }
    if (path == 'courseImage') {
      path = 'tfs_public/course_public';
    }
    if (path == 'website') {
      path = 'tfs_public/website';
    }
    if (!path) {
      path = 'tfs_public/image';
    }
    const response = await APIServices.postData(API_MEDIA_PRE_SIGN_URL_END_POINT, { url: path + '/' + fileName, acl });
    return response?.data?.data || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.data?.message);
    return null;
  }
}



export const FrequencyDropdown = [
  { name: 'Select Frequency', key: '' },
  { name: 'Monthly', key: 'Monthly' },
  { name: 'Quarterly', key: 'Quarterly' },
  { name: 'Yearly', key: 'Yearly' },
];
export const MonthYearDrpDown = [
  { name: 'Select Month', key: '' },
  { name: '1', key: 1 },
  { name: '2', key: 2 },
  { name: '3', key: 3 },
  { name: '4', key: 4 },
  { name: '5', key: 5 },
  { name: '6', key: 6 },
  { name: '7', key: 7 },
  { name: '8', key: 8 },
  { name: '9', key: 9 },
  { name: '10', key: 10 },
  { name: '11', key: 11 },
  { name: '12', key: 12 },
];
export const MonthQuarterDrpDown = [
  { name: 'Select Month', key: '' },
  { name: '1', key: 1 },
  { name: '2', key: 2 },
  { name: '3', key: 3 },
];
export const DatesDrpDown = [
  { name: 'Select Date', key: '' },
  { name: '1', key: '1' },
  { name: '2', key: '2' },
  { name: '3', key: '3' },
  { name: '4', key: '4' },
  { name: '5', key: '5' },
  { name: '6', key: '6' },
  { name: '7', key: '7' },
  { name: '8', key: '8' },
  { name: '9', key: '9' },
  { name: '10', key: '10' },
  { name: '11', key: '11' },
  { name: '12', key: '12' },
  { name: '13', key: '13' },
  { name: '14', key: '14' },
  { name: '15', key: '15' },
  { name: '16', key: '16' },
  { name: '17', key: '17' },
  { name: '18', key: '18' },
  { name: '19', key: '19' },
  { name: '20', key: '20' },
  { name: '21', key: '21' },
  { name: '22', key: '22' },
  { name: '23', key: '23' },
  { name: '24', key: '24' },
  { name: '25', key: '25' },
  { name: '26', key: '26' },
  { name: '27', key: '27' },
  { name: '28', key: '28' },
  { name: '29', key: '29' },
  { name: '30', key: '30' },
  { name: '31', key: '31' },
];

export enum Events {
  'add' = 'add',
  'edit' = 'edit'
}

export const COURSE_TYPE: { [key: string]: string } = {
  ['1']: 'Youtube video',
  ['2']: 'Quiz',
  ['3']: 'Text Based',
  ['4']: 'PDF Document'
}

export const COURSE_STATUS_NUMBER = {
  ASSIGNED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  NOT_ASSIGNED: 4,
};

export const COURSE_STATUS: { [key: string]: string } = {
  ['1']: 'Assigned',
  ['2']: 'In Progress',
  ['3']: 'Completed',
  ['4']: 'Not Assigned'
};

export const STATUS_DRP_LEARNERS = [
  { name: 'Select Status', key: '' },
  { name: 'Assigned', key: '1' },
  { name: 'In Progress', key: '2' },
  { name: 'Completed', key: '3' },
  { name: 'Not Assigned', key: '4' }
];

export const UserTypesLearners: { [key: string]: string } = {
  ['3']: 'Employee',
  ['4']: 'Tenant',
  ['5']: 'Contractor',
  ['6']: 'Sub Admin Tenant',
  ['7']: 'Sub Admin Contractor',
  ['8']: 'Employee',
};

export const COURSE_PROGRESS_VARIABLES = {
  assigned: 1,
  progress: 2
}

export const COURSE_TYPE_DRP = [
  { name: 'Assigned', key: 1 },
  { name: 'Not Assigned', key: 2 },
];

export const COURSE_TYPE_ADMIN_DRP = [
  { name: 'Editable', key: 3 },
  { name: 'Non-Editable', key: 4 },
];

export const CHAPTER_TYPES: { [key: string]: number } = {
  YOUTUBE_VIDEO: 1,
  QUIZ: 2,
  TEXT: 3,
  PDF: 4,
};


export const CHAPTER_TYPE_DRP = [
  { name: 'Select Chapter Type', key: '' },
  { name: 'Youtube', key: 1 },
  { name: 'Quiz', key: 2 },
  { name: 'Text Base', key: 3 },
  { name: 'PDF Document', key: 4 }
]

export const QUESTION_TYPE = {
  SINGLE: 1,
  MULTIPLE: 2,
};

export const PUBLISH_COURSE_TYPES = {
  AVAILABLE_FOR_ALL: 1,
  RESTRICTED: 2,
};

export const chapterTypeConst: { [key: string]: string } = {
  'YouTube': 'YOUTUBE_VIDEO',
  'Quiz': 'QUIZ',
  'Text': 'TEXT',
  'PDF Document': 'PDF'
}
export const CHAPTER_TYPES_BELONG: { [key: string]: string } = {
  ['1']: 'YouTube',
  ['2']: 'Quiz',
  ['3']: 'Text',
  ['4']: 'PDF Document'
}
export const VIDEO_API_CALL_TIME = 30;

export const CHAPTER_TYPES_PROGRESS = {
  youtube: 1,
  quiz: 2,
  text: 3,
  pdf: 4
}

export const CK_EDITOR_CONFIGURATION = {
  readonly: false,
  autofocus: false,
  tabIndex: 1,
  askBeforePasteFromWord: false,
  askBeforePasteHTML: false,
  defaultActionOnPaste: 'insert_clear_html',
  placeholder: 'write something awesome ...',
  beautyHTML: true,
  toolbarButtonSize: 'large',
  buttons: 'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,superscript,subscript,spellcheck,cut,copy,paste,selectall,hr,table,link,indent,outdent,brush,undo,redo,source,align',
  disablePlugins: 'inline-popup',
  limitChars: 1000,
};

export const DrpAdminUserType = [
  { name: 'Employee', key: 3 },
  { name: 'Sub Admin Tenant', key: 6 },
  { name: 'Sub Admin Contractor', key: 7 },
]