import React from 'react'
import { CommonMaster } from './shared/enum/enum'

const Dashboard = React.lazy(() => import('./views/dashboard'))
const ProductReview = React.lazy(() => import('./views/components/master/sub-master/product-review'))

const ProductList = React.lazy(() => import("./views/components/product/product-list"))
const ProductAddEdit = React.lazy(() => import("./views/components/product/add-edit-product"))

const ProductMasterList = React.lazy(() => import("src/views/components/product-master"));
const ProductMasterDetails = React.lazy(() => import("src/views/components/product-master/details"));

const MasterAdd = React.lazy(() => import('./views/components/master/sub-master/common/add-sub-master'))

const Subscribe = React.lazy(() => import('./views/components/requests/subscribe/subscribe-list'))
const ContactUs = React.lazy(() => import('./views/components/requests/contact-us/contactus-list'))

const HcpInquiries = React.lazy(() => import("./views/components/requests/hcp-inquiries"));
const AddEditHcpInquiries = React.lazy(() => import("src/views/components/requests/hcp-inquiries/add-edit-hcp-inquiry"));

const CMS = React.lazy(() => import('./views/components/cms/cms-list'))
const EditCMS = React.lazy(() => import('./views/components/cms/edit-cms'))

const SystemEmails = React.lazy(() => import('./views/components/system-emails/system-email-list'))
const EditSystemEmails = React.lazy(() => import('./views/components/system-emails/edit-system-emails'))

const Social = React.lazy(() => import('./views/components/setting/social'))
const ContactUsSetting = React.lazy(() => import('./views/components/setting/contact-us/contact-us'))

const AboutUs = React.lazy(() => import('./views/components/setting/about-us/about-us'))
const OwnerMessages = React.lazy(() => import('./views/components/setting/about-us/owner-messages'))
const AddEditOwnerMessages = React.lazy(() => import('./views/components/setting/about-us/add-edit-owner-messages'))

const MicrositeConfig = React.lazy(() => import("./views/components/setting/microsite-configuration"));

const GeneralConfiguration = React.lazy(() => import('./views/components/setting/general-configuration/general-configuration'))
const FooterConfiguration = React.lazy(() => import('./views/components/web-configuration/footer'))
const ProductConfiguration = React.lazy(() => import('./views/components/setting/product-configration/product-tab'))
const PaymentGatewayConfiguration = React.lazy(() => import("./views/components/setting/payment-gateway"));
const AddEditPaymentGateway = React.lazy(() => import("./views/components/setting/payment-gateway/add-edit-payment-gateway"));

const HomePageConfigurations = React.lazy(() => import("src/views/components/setting/home-page-configurations"));
const AddEditHomePageConfigurations = React.lazy(() => import("src/views/components/setting/home-page-configurations/actions"));
const ShippingMethodList = React.lazy(() => import("src/views/components/setting/shipping/shipping-methods"));
const ShippingRateList = React.lazy(() => import("src/views/components/setting/shipping/shipping-rates"));

const CategoryList = React.lazy(() => import('./views/components/category-management/category'))
const CategoryAddEdit = React.lazy(() => import('./views/components/category-management/category/category-tabs'))

const SubCategoryList = React.lazy(() => import('./views/components/category-management/sub-category/sub-category-list'))
const SubCategoryAddEdit = React.lazy(() => import('./views/components/category-management/sub-category/sub-category-tab'))

const CategorySequence = React.lazy(() => import("./views/components/category-management/category-sequence"));

const CategoryTypeList = React.lazy(() => import('./views/components/category-management/category-type/category-type-list'))
const CategoryTypeAddEdit = React.lazy(() => import('./views/components/category-management/category-type/category-type-tab'))


const AccountList = React.lazy(() => import('./views/components/account/account-list'))
const AddEditAccount = React.lazy(() => import('./views/components/account/add-edit-account'))

const PatientList = React.lazy(() => import("src/views/components/patients"));
const AddPatients = React.lazy(() => import("src/views/components/patients/add"));
const PatientDetails = React.lazy(() => import("src/views/components/patients/details"));

const OrderList = React.lazy(() => import("src/views/components/orders"));
const AddOrder = React.lazy(() => import("src/views/components/orders/add"));
const OrderDetails = React.lazy(() => import("src/views/components/orders/details"));

const TransactionList = React.lazy(() => import("src/views/components/transactions"));
const CommissionReports = React.lazy(() => import("src/views/components/reports"));

const Banner = React.lazy(() => import("./views/components/master/banner/banner-list"))
const AddEditBanner = React.lazy(() => import("./views/components/master/banner/add-edit-banner"))

const AddEditUserManagement = React.lazy(() => import("./views/components/user-management/common/add-edit-user-management"))
const AdminUsers = React.lazy(() => import("./views/components/user-management/admin-users"));
const B2BUsers = React.lazy(() => import("./views/components/user-management/b2b-users"));
const MicrositeAdminUsers = React.lazy(() => import("./views/components/user-management/microsite-users"));
const B2B2CUsers = React.lazy(() => import("./views/components/user-management/b2b2c-users"));

const WebConfig = React.lazy(() => import("./views/components/web-configuration/web-config-list"));
const AddEditWebConfig = React.lazy(() => import("./views/components/web-configuration/web-config-tab-view"));

const RolePermission = React.lazy(() => import("./views/components/roles-permission/roles-permision"))
const RolePermissionAddEdit = React.lazy(() => import("./views/components/roles-permission/add-edit-roles-permission"))

const ProductGroupList = React.lazy(() => import("./views/components/master/sub-master/product-group-list"))
const AddEditProductGroup = React.lazy(() => import("./views/components/master/sub-master/add-edit-product-group"))

const CountryList = React.lazy(() => import("./views/components/localization/country/country-list"))
const AddEditCountry = React.lazy(() => import("./views/components/localization/country/add-edit-country"))

const Profile = React.lazy(() => import("./views/components/profile/profile"))

const Slug = React.lazy(() => import("./views/components/slug/slug-list"))
const AddEditSlug = React.lazy(() => import("./views/components/slug/add-edit-slug"))

const TaxRate = React.lazy(() => import("src/views/components/tax-rate"));

const NumberGeneratorList = React.lazy(() => import("./views/components/number-generator/number-generator-list"))
const AddEditNumberGenerator = React.lazy(() => import("./views/components/number-generator/add-edit-number-generator"))

const commonConfiguration = React.lazy(() => import("./views/components/setting/common-configuration/add-edit-common-configuration"))
const searchConfiguration = React.lazy(() => import("./views/components/search-configuration/search-configuration-add-edit"))

const AddEditBaseConfig = React.lazy(() => import("./views/components/setting/base-configuration/actions"));
const BaseConfig = React.lazy(() => import("./views/components/setting/base-configuration"));
const TrailLensesList=React.lazy(()=>import("./views/components/trail-lenses"));
const TrailLensesAdd=React.lazy(()=>import("./views/components/trail-lenses/add"));
const TrailLenseDetails=React.lazy(()=>import("./views/components/trail-lenses/details"));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/product-review', name: CommonMaster.PRODUCT_REVIEW, component: ProductReview, exact: true },

  { path: '/product', name: CommonMaster.PRODUCT, component: ProductList, exact: true },
  { path: '/product/add/', name: 'Add', component: ProductAddEdit },
  { path: '/product/edit/?:id', name: 'Edit', component: ProductAddEdit },
  { path: '/product/edit/', name: 'Edit', component: ProductAddEdit },

  { path: "/master-products", name: CommonMaster.PRODUCT_MASTER, component: ProductMasterList, exact: true },
  { path: "/master-products/view/?:id", name: "View", component: ProductMasterDetails, exact: true },
  { path: "/master-products/view/", name: "View", component: ProductMasterDetails, exact: true },

  { path: '/master/add/', name: 'Add', component: MasterAdd },
  { path: '/master/add/?:name', name: 'Add', component: MasterAdd },
  { path: '/master/edit/', name: 'Edit', component: MasterAdd },
  { path: '/master/edit/?:id', name: 'Edit', component: MasterAdd },


  { path: '/requests', name: CommonMaster.REQUESTS, component: Subscribe, exact: true },

  { path: '/subscribe', name: CommonMaster.SUBSCRIBE, component: Subscribe, exact: true },
  { path: '/contact-us', name: 'Contact Us', component: ContactUs, exact: true },

  { path: "/hcp-inquiries", name: "HCP Inquiries", component: HcpInquiries, exact: true },
  { path: "/hcp-inquiries/add", name: "Add", component: AddEditHcpInquiries, exact: true },
  { path: "/hcp-inquiries/view/", name: "View", component: AddEditHcpInquiries, exact: true },
  { path: "/hcp-inquiries/view/?:id", name: "View", component: AddEditHcpInquiries, exact: true },

  { path: '/cms', name: CommonMaster.CMS, component: CMS, exact: true },
  { path: '/cms/add', name: 'Add', component: EditCMS },
  { path: '/cms/edit/', name: 'Edit', component: EditCMS },
  { path: '/cms/edit/?:id', name: 'Edit', component: EditCMS },

  { path: '/system-email', name: CommonMaster.SYSTEM_EMAIL, component: SystemEmails, exact: true },
  { path: '/system-email/add', name: 'Add', component: EditSystemEmails },
  { path: '/system-email/edit/', name: 'Edit', component: EditSystemEmails },
  { path: '/system-email/edit/?:id', name: 'Edit', component: EditSystemEmails },

  { path: '/country', name: CommonMaster.COUNTRY, component: CountryList, exact: true },
  { path: '/country/add', name: 'Add', component: AddEditCountry },
  { path: '/country/edit/', name: 'Edit', component: AddEditCountry },
  { path: '/country/edit/?:id', name: 'Edit', component: AddEditCountry },

  { path: '/social', name: CommonMaster.SOCIAL, component: Social, exact: true },
  { path: '/contact-us-setting', name: CommonMaster.CONTACT_US, component: ContactUsSetting, exact: true },
  { path: '/about-us', name: CommonMaster.ABOUT_US, component: AboutUs, exact: true },
  { path: '/owner-messages', name: CommonMaster.OWNER_MESSAGES, component: OwnerMessages, exact: true },
  { path: '/owner-messages/add', name: 'Add', component: AddEditOwnerMessages },
  { path: '/owner-messages/edit/', name: 'Edit', component: AddEditOwnerMessages },
  { path: '/owner-messages/edit/?:id', name: 'Edit', component: AddEditOwnerMessages },
  { path: '/microsite-configuration', name: CommonMaster.MICROSITE_CONFIGURATION, component: MicrositeConfig, exact: true },

  { path: '/general-configuration', name: CommonMaster.GENERAL_CONFIGURATION, component: GeneralConfiguration, exact: true },
  { path: '/footer-configuration', name: CommonMaster.FOOTER_CONFIGURATION, component: FooterConfiguration, exact: true },
  { path: '/product-configuration', name: CommonMaster.PRODUCT_CONFIGURATION, component: ProductConfiguration, exact: true },

  { path: '/payment-gateway-configuration', name: CommonMaster.PAYMENT_GATEWAY_CONFIGURATION, component: PaymentGatewayConfiguration, exact: true },
  { path: '/payment-gateway-configuration/add', name: "Add", component: AddEditPaymentGateway, exact: true },
  { path: '/payment-gateway-configuration/edit/', name: "Edit", component: AddEditPaymentGateway, exact: true },
  { path: '/payment-gateway-configuration/edit/?:id', name: "Edit", component: AddEditPaymentGateway, exact: true },

  { path: "/home-page-configurations", name: CommonMaster.HOME_PAGE_CONFIG, component: HomePageConfigurations, exact: true },
  { path: "/home-page-configurations/add", name: "Add", component: AddEditHomePageConfigurations, exact: true },
  { path: "/home-page-configurations/edit/", name: "Edit", component: AddEditHomePageConfigurations, exact: true },
  { path: "/home-page-configurations/edit/?:id", name: "Edit", component: AddEditHomePageConfigurations, exact: true },

  { path: "/shipping-methods", name: CommonMaster.SHIPPING_METHODS, component: ShippingMethodList, exact: true },
  { path: "/shipping-rates", name: CommonMaster.SHIPPING_RATES, component: ShippingRateList, exact: true },
  { path: "/shipping-zones/", name: CommonMaster.SHIPPING_ZONES, component: ShippingRateList, exact: true },
  { path: "/shipping-zones/?:code", name: CommonMaster.SHIPPING_ZONES, component: ShippingRateList, exact: true },

  { path: '/category', name: CommonMaster.CATEGORY, component: CategoryList, exact: true },
  { path: '/category/add', name: 'Add', component: CategoryAddEdit },
  { path: '/category/edit/', name: "View", component: CategoryAddEdit },
  { path: '/category/edit/?:id', name: 'View', component: CategoryAddEdit },

  { path: '/sub-category', name: CommonMaster.SUB_CATEGORY, component: SubCategoryList, exact: true },
  { path: '/sub-category/add', name: 'Add', component: SubCategoryAddEdit },
  { path: "/sub-category/edit/", name: "View", component: SubCategoryAddEdit },
  { path: "/sub-category/edit/?:id", name: "View", component: SubCategoryAddEdit },
  { path: '/sub-category/add/?:cat&cat_type', name: 'Add', component: SubCategoryAddEdit },

  { path: "/category-sequence", name: CommonMaster.CATEGORY_SEQUENCE, component: CategorySequence, exact: true },

  { path: '/category-type', name: CommonMaster.CATEGORY_TYPE, component: CategoryTypeList, exact: true },
  { path: '/category-type/add', name: 'Add', component: CategoryTypeAddEdit },
  { path: '/category-type/edit/', name: "View", component: CategoryTypeAddEdit },
  { path: '/category-type/edit/?:id', name: "View", component: CategoryTypeAddEdit },

  { path: "/hcp", name: CommonMaster.HCP, component: AccountList, exact: true },
  { path: "/hcp/add", name: "Add", component: AddEditAccount },
  { path: "/hcp/edit/", name: "Edit", component: AddEditAccount },
  { path: "/hcp/edit/?:id", name: "Edit", component: AddEditAccount },

  { path: "/patients/view/", name: "View", component: PatientDetails },
  { path: "/patients", name: CommonMaster.PATIENTS, component: PatientList, exact: true },
  { path: "/patients/view/?:id", name: "View", component: PatientDetails, exact: true },
  { path: "/patients/add", name: "Add", component: AddPatients, exact: true },

  { path: "/orders", name: CommonMaster.ORDERS, component: OrderList, exact: true },
  { path: "/orders/view/", name: "View", component: OrderDetails, exact: true },
  { path: "/orders/view/?:id", name: "View", component: OrderDetails, exact: true },
  { path: "/orders/add", name: "Add", component: AddOrder, exact: true },

  { path: "/transactions", name: CommonMaster.TRANSACTIONS, component: TransactionList, exact: true },

  { path: "/commission-reports", name: CommonMaster.COMMISSION_REPORTS, component: CommissionReports, exact: true },

  { path: '/banner', name: CommonMaster.BANNER, component: Banner, exact: true },
  { path: '/banner/add', name: 'Add', component: AddEditBanner },
  { path: '/banner/edit/?:id', name: 'Edit', component: AddEditBanner },
  { path: '/banner/edit/', name: 'Edit', component: AddEditBanner },

  { path: '/admin-users', name: CommonMaster.ADMIN_USERS, component: AdminUsers, exact: true },
  { path: '/admin-users/add', name: 'Add', component: AddEditUserManagement },
  { path: '/admin-users/edit/?:id', name: 'Edit', component: AddEditUserManagement },
  { path: '/admin-users/edit/', name: 'Edit', component: AddEditUserManagement },
  { path: '/b2b-users', name: CommonMaster.B2B_USERS, component: B2BUsers, exact: true },
  { path: '/b2b-users/add', name: 'Add', component: AddEditUserManagement },
  { path: '/b2b-users/edit/?:id', name: 'Edit', component: AddEditUserManagement },
  { path: '/b2b-users/edit/', name: 'Edit', component: AddEditUserManagement },
  { path: '/microsite-admin-users', name: CommonMaster.MICROSITE_ADMIN_USERS, component: MicrositeAdminUsers, exact: true },
  { path: '/microsite-admin-users/add', name: 'Add', component: AddEditUserManagement },
  { path: '/microsite-admin-users/edit/?:id', name: 'Edit', component: AddEditUserManagement },
  { path: '/microsite-admin-users/edit/', name: 'Edit', component: AddEditUserManagement },
  { path: '/b2b2c-users', name: CommonMaster.B2B2C_USERS, component: B2B2CUsers, exact: true },
  { path: '/b2b2c-users/add', name: 'Add', component: AddEditUserManagement },
  { path: '/b2b2c-users/edit/?:id', name: 'Edit', component: AddEditUserManagement },
  { path: '/b2b2c-users/edit/', name: 'Edit', component: AddEditUserManagement },

  { path: '/roles-permission', name: CommonMaster.ROLE_PERMISSION, component: RolePermission, exact: true },
  { path: '/roles-permission/add', name: 'Add', component: RolePermissionAddEdit },
  { path: '/roles-permission/edit/', name: 'Edit', component: RolePermissionAddEdit },
  { path: '/roles-permission/edit/?:id', name: 'Edit', component: RolePermissionAddEdit },

  { path: "/catalogue", name: CommonMaster.CATALOGUE, component: ProductGroupList, exact: true },
  { path: "/catalogue/add", name: "Add", component: AddEditProductGroup },
  { path: "/catalogue/edit", name: "Edit", component: AddEditProductGroup },
  { path: "/catalogue/edit/?:id", name: "Edit", component: AddEditProductGroup },
  { path: "/catalogue/view/", name: "View", component: AddEditProductGroup },
  { path: "/catalogue/view/?:id", name: "View", component: AddEditProductGroup },

  { path: '/profile', name: 'Profile', component: Profile },

  { path: '/slug', name: CommonMaster.SLUG_MASTER, component: Slug, exact: true },
  { path: '/slug/add', name: 'Add', component: AddEditSlug },
  { path: '/slug/edit/', name: 'Edit', component: AddEditSlug },
  { path: '/slug/edit/?:id', name: 'Edit', component: AddEditSlug },

  { path: "/tax-rate", name: CommonMaster.TAX_RATE, component: TaxRate, exact: true },

  { path: '/web-config', name: CommonMaster.WEB_CONFIG, component: WebConfig, exact: true },
  { path: '/web-config/add', name: 'Add', component: AddEditWebConfig },
  { path: '/web-config/edit/', name: 'Edit', component: AddEditWebConfig },
  { path: '/web-config/edit/?:id', name: 'Edit', component: AddEditWebConfig },

  { path: '/number-generator', name: CommonMaster.NUMBER_GENERATOR, component: NumberGeneratorList, exact: true },
  { path: '/number-generator/add', name: 'Add', component: AddEditNumberGenerator },
  { path: '/number-generator/edit/', name: 'Edit', component: AddEditNumberGenerator },
  { path: '/number-generator/edit/?:id', name: 'Edit', component: AddEditNumberGenerator },

  { path: '/common-configuration', name: CommonMaster.commonConfiguration, component: commonConfiguration, exact: true },
  { path: '/search-configuration', name: CommonMaster.SEARCH_CONFIGURATION, component: searchConfiguration },

  { path: "/base-configuration", name: CommonMaster.BASE_CONFIGURATION, component: BaseConfig, exact: true },
  { path: "/base-configuration/add", name: "Add", component: AddEditBaseConfig, exact: true },
  { path: "/base-configuration/edit/", name: "Edit", component: AddEditBaseConfig, exact: true },
  { path: "/base-configuration/edit/?:id", name: "Edit", component: AddEditBaseConfig, exact: true },

  { path: '/trial-lenses-orders', name: CommonMaster.TRAIL_LENSES_ORDERS, component: TrailLensesList, exact: true },
  { path: "/trial-lenses-orders/add", name: "Add", component: TrailLensesAdd, exact: true },
  { path: "/trial-lenses-orders/view/", name: "View", component: TrailLenseDetails, exact: true },
  { path: "/trial-lenses-orders/view/?:id", name: "View", component: TrailLenseDetails, exact: true },
]

export default routes
