import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilFindInPage,
  cibElasticStack,
  cilSettings,
  cilCart,
  cilBellExclamation,
  cilMobile,
  cilAppsSettings,
  cilControl,
  cilOptions,
  cilPaperPlane,
  cilAt,
  cilUser,
  cilTruck,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";
import { CommonMaster, Permission } from "./shared/enum/enum";
const adminRole =
  JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? "";

console.log(adminRole, 'ROLE')

const generalNavs = [
  {
    component: CNavItem,
    name: CommonMaster.CMS,
    to: "/cms",
    icon:
      adminRole === "SUPER_ADMIN" ? (
        <CIcon icon={cilFindInPage} customClassName="nav-icon" />
      ) : null,
    permisson_slug: Permission.CMS_LIST,
  },
  {
    component: CNavItem,
    to: "/shipping-methods",
    name: CommonMaster.SHIPPING_METHODS,
    permisson_slug: Permission.SHIPPING_RATE_LIST,
    icon:
      adminRole === "SUPER_ADMIN" ? (
        <CIcon icon={cilTruck} customClassName="nav-icon" />
      ) : null,
  },
  {
    component: CNavItem,
    name: CommonMaster.REQUESTS,
    className: "lable",
    icon:
      adminRole === "SUPER_ADMIN" ? (
        <CIcon icon={cilPaperPlane} customClassName="nav-icon" />
      ) : null,
  },
  {
    component: CNavItem,
    name: CommonMaster.SUBSCRIBE,
    to: "/subscribe",
    icon:
      adminRole === "SUPER_ADMIN" ? (
        <CIcon icon={cilBellExclamation} customClassName="nav-icon" />
      ) : null,
    permisson_slug: Permission.SUBSCRIBE_REQ_LIST,
  },
  {
    component: CNavItem,
    name: CommonMaster.CONTACT_US,
    to: "/contact-us",
    icon:
      adminRole === "SUPER_ADMIN" ? (
        <CIcon icon={cilMobile} customClassName="nav-icon" />
      ) : null,
    permisson_slug: Permission.CONTACTUS_LIST,
  },
  {
    component: CNavItem,
    name: CommonMaster.HCP_INQUIRIES,
    to: "/hcp-inquiries",
    icon:
      adminRole === "SUPER_ADMIN" ? (
        <CIcon icon={cilAt} customClassName="nav-icon" />
      ) : null,
    permisson_slug: Permission.HCP_INQUIRY_LIST,
  },
];

const hcpMaster = {
  component: CNavGroup,
  name: CommonMaster.HCP_MASTER,
  icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: CommonMaster.HCP,
      to: "/hcp",
      permisson_slug: Permission.HCP_LIST,
    },
    {
      component: CNavItem,
      name: CommonMaster.CONFIGURE,
      to: "/microsite-configuration",
      permisson_slug: Permission.WEBSITE_CONFIGURATION_CREATE,
    },
    adminRole === "SUPER_ADMIN" && {
      component: CNavItem,
      name: CommonMaster.TRAIL_LENSES_ORDERS,
      to: "/trial-lenses-orders",
      permisson_slug: Permission.TRAIL_LENSES_ORDER_LIST,
    },
  ],
  permisson_slugs: [
    Permission.HCP_LIST,
    Permission.WEBSITE_CONFIGURATION_CREATE,
    Permission.TRAIL_LENSES_ORDER_LIST,
  ],
}

const patienMaster = {
  component: CNavGroup,
  name: CommonMaster.PATIENT_MASTER,
  icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: CommonMaster.PATIENTS,
      to: "/patients",
      permisson_slug: Permission.PATIENT_LIST,
    },
    {
      component: CNavItem,
      name: CommonMaster.ORDERS,
      to: "/orders",
      permisson_slug: Permission.ORDER_LIST,
    },
    {
      component: CNavItem,
      name: CommonMaster.TRANSACTIONS,
      to: "/transactions",
      permisson_slug: Permission.TRANSACTION_LIST,
    },
  ],
  permisson_slugs: [
    Permission.ORDER_LIST,
    Permission.PATIENT_LIST,
    Permission.TRANSACTION_LIST,
  ],
}

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permisson_slug: Permission.SHOW_ALL,
  },
  {
    component: CNavItem,
    name: CommonMaster.MASTERS,
    className: "lable",
    icon: <CIcon icon={cilOptions} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: CommonMaster.CATEGORY_MANAGEMENT,
    icon: <CIcon icon={cibElasticStack} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: CommonMaster.CATEGORY_TYPE,
        to: "/category-type",
        permisson_slug: Permission.CATEGORY_TYPE_LIST,
      },
      {
        component: CNavItem,
        name: CommonMaster.CATEGORY,
        to: "/category",
        permisson_slug: Permission.CATEGORY_LIST,
      },
      {
        component: CNavItem,
        name: CommonMaster.SUB_CATEGORY,
        to: "/sub-category",
        permisson_slug: Permission.SUB_CATEGORY_LIST,
      },
    ],
    permisson_slugs: [
      Permission.CATEGORY_TYPE_LIST,
      Permission.CATEGORY_LIST,
      Permission.SUB_CATEGORY_LIST,
      // Permission.DYNAMIC_CATEGORY_LIST,
    ],
  },
  {
    component: CNavGroup,
    name: CommonMaster.PRODUCT_PRICES,
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: CommonMaster.CATALOGUE,
        to: "/catalogue",
        permisson_slug: Permission.CATALOGUE_LIST,
      },
      {
        component: CNavItem,
        name: CommonMaster.PRODUCT,
        to: "/product",
        permisson_slug: Permission.PRODUCT_LIST,
      },
      {
        component: CNavItem,
        name: CommonMaster.PRODUCT_MASTER,
        to: "/master-products",
        permisson_slug: Permission.MASTER_PRODUCT_LIST,
      },
      {
        component: CNavItem,
        to: "/commission-reports",
        name: CommonMaster.COMMISSION_REPORTS,
      },
    ],
    permisson_slugs: [
      Permission.PRODUCT_CERTIFICATE_LIST,
      Permission.CATALOGUE_LIST,
      Permission.PRODUCT_LIST,
    ],
  },
  ...(adminRole !== "SUPER_ADMIN" ? [{
    component: CNavItem,
    name: CommonMaster.TRAIL_LENSES_ORDERS,
    to: "/trial-lenses-orders",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permisson_slug: Permission.TRAIL_LENSES_ORDER_LIST,
  }] : []),
  adminRole !== "SUPER_ADMIN" ? patienMaster : hcpMaster,
  adminRole !== "SUPER_ADMIN" ? hcpMaster : patienMaster,
  {
    component: CNavItem,
    name: CommonMaster.SETTINGS,
    className: "lable",
    icon: <CIcon icon={cilAppsSettings} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: CommonMaster.GENERAL_CONFIGURATION,
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: CommonMaster.BANNER,
        to: "/banner",
        permisson_slug: Permission.BANNER_LIST,
      },
      {
        component: CNavItem,
        name: CommonMaster.FOOTER_CONFIGURATION,
        to: "/footer-configuration",
        permisson_slug: Permission.DEFAULT_FOOTER_LIST,
      },
      {
        component: CNavItem,
        name: CommonMaster.PRODUCT_CONFIGURATION,
        to: "/product-configuration",
        permisson_slug: Permission.PRODUCT_CONFIGURATION,
      },
      {
        component: CNavItem,
        name: CommonMaster.NUMBER_GENERATOR,
        to: "/number-generator",
        permisson_slug: Permission.NUMBER_GENERATOR_LIST,
      },
      {
        component: CNavItem,
        name: CommonMaster.SOCIAL,
        to: "/social",
        permisson_slug: Permission.SOCIAL_SETTING_SHOW,
      },
      {
        component: CNavItem,
        name: CommonMaster.PAYMENT_GATEWAY_CONFIGURATION,
        to: "/payment-gateway-configuration",
      },
      {
        component: CNavItem,
        name: CommonMaster.HOME_PAGE_CONFIG,
        to: "/home-page-configurations",
        permisson_slug: Permission.HOME_PAGE_CONFIG_LIST,
      },
      ...(adminRole === "MICROSITE_ADMIN" ? generalNavs : []),
    ],
    permisson_slugs: [
      Permission.GENERAL_CONFIGURATION,
      Permission.DEFAULT_FOOTER_LIST,
      Permission.PRODUCT_CONFIGURATION,
      Permission.NUMBER_GENERATOR_LIST,
      Permission.SOCIAL_SETTING_SHOW,
      Permission.PAYMENT_GATEWAY_LIST,
    ],
  },
  ...(adminRole === "SUPER_ADMIN" ? generalNavs : []),
];

export default _nav;
