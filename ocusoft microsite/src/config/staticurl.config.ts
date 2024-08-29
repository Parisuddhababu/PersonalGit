/**
 * Static URL Path
 */
const STATICURL = [
  "products",
  "account",
  "verify-email",
  "sign-in",
  "sign-up",
];

/**
 * STATICURL Pattern
 *  page url: Template Name define in template index file
 */
export const StaticURLTemplate = {
  products: "PRODUCT_LIST",
  account: "ACCOUNT",
  "verify-email": "VERIFY_EMAIL",
  "newsletter-subscription": "NEWS_LETTER_SUBS",
  "my-orders": "ORDER_LIST",
  "sign-in": "SIGNIN_BANNER",
  "sign-up": "SIGNUP_BANNER",
};

// Static page path
export const StaticRoutes = {
  cartList: "/cart/list",
  myProfile: "/account-information",
  signIn: "/sign-in",
  signUp: "/sign-up",
  account: "/my-account",
  changePassword: "/change-password",
  userAdressBook: "/user-address-book",
  myOrders: "/my-orders",
  aboutUs: "/about-us",
  home: "/",
  checkoutList: "cart/checkout_list/",
  forgotPassword: "/forgot-password",
  newsletterSubscription: "/newsletter-subscription"
}

export default STATICURL;
