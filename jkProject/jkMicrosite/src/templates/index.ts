import { ReactNode } from "react";

// Types
import { IMeta } from "@type/Common/meta";
import { ISlug } from "@type/Pages/slug";
import { IRootColor } from "@type/Common/Base";
import Template from "./template";

export interface ITemplateProps extends ISlug {
  children?: ReactNode;
  host: string;
  canonical?: string;
  default_style?: IRootColor;
  theme?: string;
  sequence?: string[];
  slugInfo?: SlugInfoProps
  domainName?: string;
  micrositeName?: string;
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
  slugInfo?: SlugInfoProps;
  micrositeName?: string
}

/**
 * @name : Templates
 * @description: define all the template here
 */
import ProductList from "@templates/ProductList";
import BlogList from "@templates/BlogList";
import EventDetails from "@templates/EventDetails";
import EventList from "@templates/EventList";
import BlogDetails from "@templates/BlogDetails";
import Faq from "@templates/Faq";
import SignUp from "@templates/SignUp/sign-up";
import Testimonials from "@templates/Testimonials";
import ContactUs from "@templates/contact-us-list";
import ReferEarn from "@templates/refer-earn";
import AboutUs from "@templates/AboutUs";
import SignIn from "@templates/SignIn";
import RecentlyViewed from "@templates/RecentlyViewed";
import CustomiseDesign from "@templates/Customise-Design";
import Career from "@templates/Career";
import ForgotPassword from "@templates/ForgotPassword";
import ResetPassword from "@templates/ResetPassword";
import ProductDetails from "@templates/ProductDetails";
import OrderConfirmation from "./OrderConfirmation/order-confirmation";
import Catalogue from "@templates/Catalogue";
import Cart from "@templates/Cart";
import Collection from "@templates/Collection";
import MyProfile from "@templates/MyProfile";
import ChangePassword from "@templates/ChangePassword";
import MyAccount from "@templates/MyAccount";
import MyAddress from "@templates/MyAddress";
import CollectionDetails from "@templates/CollectionDetails";
import CatalogDetails from "@templates/CatalogueDetails";
import CMSPageContent from "@templates/CmsPages";
import MyWishlist from "@templates/MyWishlist";
import MyOrder from "@templates/MyOrder";
import MyOrderDetail from "@templates/OrderDetail";
import Checkout from "@templates/Checkout";
import Quotation from "@templates/Quotation";
import CompareProducts from "@templates/CompareProducts/CompareProducts";
import VerifyEmail from "@templates/VerifyEmail";
import SiteMapList from "@templates/Sitemap";
import { SlugInfoProps } from "@components/Meta";

export const RenderTemplate = {
  PRODUCT_LIST: ProductList,
  BLOG_LIST: BlogList,
  EVENT_DETAIL: EventDetails,
  EVENT_LIST: EventList,
  BLOG_DETAIL: BlogDetails,
  FAQ_LIST: Faq,
  REFER_AND_EARN_PAGE: ReferEarn,
  CONTACT_US_LIST: ContactUs,
  ABOUTUS_PAGE: AboutUs,
  SIGNUP_BANNER: SignUp,
  SIGNIN_BANNER: SignIn,
  RECENTLYVIEW_LIST: RecentlyViewed,
  CUSTOMISE_DESIGN: CustomiseDesign,
  CAREER: Career,
  FORGOT_PASSWORD_BANNER: ForgotPassword,
  TESTIMONIAL_LIST: Testimonials,
  RESET_PASSWORD_BANNER: ResetPassword,
  PRODUCT_DETAILS: ProductDetails,
  ORDER_CONFRIM_LIST: OrderConfirmation,
  CATALOGUE: Catalogue,
  CART_LIST: Cart,
  COLLECTION: Collection,
  PROFILE_DATA: MyProfile,
  CHANGE_PASSWORD_TEMPLATE: ChangePassword,
  ACCOUNT: MyAccount,
  USER_ADDRESS_LIST: MyAddress,
  COLLECTION_DETAIL: CollectionDetails,
  CATALOGUE_DETAIL: CatalogDetails,
  CMS_PAGE_TEMPLATE: CMSPageContent,
  WISHLIST: MyWishlist,
  ORDER_LIST: MyOrder,
  ORDER_DETAIL: MyOrderDetail,
  CHECKOUT_LIST: Checkout,
  VIEW_QUOTATION_LIST: Quotation,
  // GUEST_CART_LIST: Cart,
  COMPARE_PRODUCTS: CompareProducts,
  VERIFY_EMAIL: VerifyEmail,
  SITEMAP: SiteMapList
};

export default Template;
