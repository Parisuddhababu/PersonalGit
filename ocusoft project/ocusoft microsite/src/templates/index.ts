import { ReactNode } from "react";

// Types
import { IMeta } from "@type/Common/meta";
import { ISlug } from "@type/Pages/slug";
import { IRootColor } from "@type/Common/Base";
import Template from "@templates/template";

export interface ITemplateProps extends ISlug {
  children?: ReactNode;
  host: string;
  canonical?: string;
  default_style?: IRootColor;
  theme?: string;
  sequence?: string[];
  slugInfo?: SlugInfoProps
  domainName?: string
}

export interface IBaseTemplateProps {
  meta?: IMeta;
  children?: ReactNode;
  host?: string;
  data?: any;
  default_style?: IRootColor;
  theme?: string;
  sequence?: string[];
  canonical?: string;
  domainName?: string
  slugInfo?: SlugInfoProps
  slug?: string;
}

/**
 * @name : Templates
 * @description: define all the template here
 */
import ProductList from "@templates/ProductList";
import SignUp from "@templates/SignUp/sign-up";
import ContactUs from "@templates/contact-us-list";
import AboutUs from "@templates/AboutUs";
import SignIn from "@templates/SignIn";
import ForgotPassword from "@templates/ForgotPassword";
import ResetPassword from "@templates/ResetPassword";
import ProductDetails from "@templates/ProductDetails";
import OrderConfirmation from "./OrderConfirmation/order-confirmation";
import Catalogue from "@templates/Catalogue";
import Cart from "@templates/Cart";
import MyProfile from "@templates/MyProfile";
import ChangePassword from "@templates/ChangePassword";
import MyAccount from "@templates/MyAccount";
import MyAddress from "@templates/MyAddress";
import CatalogDetails from "@templates/CatalogueDetails";
import CMSPageContent from "@templates/CmsPages";
import MyOrder from "@templates/MyOrder";
import MyOrderDetail from "@templates/OrderDetail";
import Checkout from "@templates/Checkout";
import VerifyEmail from "@templates/VerifyEmail";
import SiteMapList from "@templates/Sitemap";
import { SlugInfoProps } from "@components/Meta";
import NewsLetterSubscription1 from "./NewsLetterSubscription/news-letter-subscription";

export const RenderTemplate = {
  PRODUCT_LIST: ProductList,
  CONTACT_US_LIST: ContactUs,
  ABOUTUS_PAGE: AboutUs,
  SIGNUP_BANNER: SignUp,
  SIGNIN_BANNER: SignIn,
  MENU: Catalogue,
  FORGOT_PASSWORD_BANNER: ForgotPassword,
  RESET_PASSWORD_BANNER: ResetPassword,
  PRODUCT_DETAILS: ProductDetails,
  ORDER_CONFRIM_LIST: OrderConfirmation,
  CATALOGUE: Catalogue,
  CART_LIST: Cart,
  PROFILE_DATA: MyProfile,
  CHANGE_PASSWORD_TEMPLATE: ChangePassword,
  ACCOUNT_DATA: MyAccount,
  USER_ADDRESS_LIST: MyAddress,
  CATALOGUE_DETAIL: CatalogDetails,
  CMS_PAGE_TEMPLATE: CMSPageContent,
  ORDER_LIST: MyOrder,
  ORDER_DETAIL: MyOrderDetail,
  CHECKOUT_LIST: Checkout,
  VERIFY_EMAIL: VerifyEmail,
  SITEMAP: SiteMapList,
  NEWS_LETTER_SUBS: NewsLetterSubscription1,
};

export default Template;
