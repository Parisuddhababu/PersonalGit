export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
}

/** A discount applied to a product price. */
export type ProductDiscount = {
  __typename?: 'ProductDiscount'
  /** The actual value of the discount. */
  amount_off?: Maybe<Scalars['Float']>
  /** The discount expressed a percentage. */
  percent_off?: Maybe<Scalars['Float']>
}

/** The list of available currency codes. */
export type CurrencyEnum =
  | 'AFN'
  | 'ALL'
  | 'AZN'
  | 'DZD'
  | 'AOA'
  | 'ARS'
  | 'AMD'
  | 'AWG'
  | 'AUD'
  | 'BSD'
  | 'BHD'
  | 'BDT'
  | 'BBD'
  | 'BYN'
  | 'BZD'
  | 'BMD'
  | 'BTN'
  | 'BOB'
  | 'BAM'
  | 'BWP'
  | 'BRL'
  | 'GBP'
  | 'BND'
  | 'BGN'
  | 'BUK'
  | 'BIF'
  | 'KHR'
  | 'CAD'
  | 'CVE'
  | 'CZK'
  | 'KYD'
  | 'GQE'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'KMF'
  | 'CDF'
  | 'CRC'
  | 'HRK'
  | 'CUP'
  | 'DKK'
  | 'DJF'
  | 'DOP'
  | 'XCD'
  | 'EGP'
  | 'SVC'
  | 'ERN'
  | 'EEK'
  | 'ETB'
  | 'EUR'
  | 'FKP'
  | 'FJD'
  | 'GMD'
  | 'GEK'
  | 'GEL'
  | 'GHS'
  | 'GIP'
  | 'GTQ'
  | 'GNF'
  | 'GYD'
  | 'HTG'
  | 'HNL'
  | 'HKD'
  | 'HUF'
  | 'ISK'
  | 'INR'
  | 'IDR'
  | 'IRR'
  | 'IQD'
  | 'ILS'
  | 'JMD'
  | 'JPY'
  | 'JOD'
  | 'KZT'
  | 'KES'
  | 'KWD'
  | 'KGS'
  | 'LAK'
  | 'LVL'
  | 'LBP'
  | 'LSL'
  | 'LRD'
  | 'LYD'
  | 'LTL'
  | 'MOP'
  | 'MKD'
  | 'MGA'
  | 'MWK'
  | 'MYR'
  | 'MVR'
  | 'LSM'
  | 'MRO'
  | 'MUR'
  | 'MXN'
  | 'MDL'
  | 'MNT'
  | 'MAD'
  | 'MZN'
  | 'MMK'
  | 'NAD'
  | 'NPR'
  | 'ANG'
  | 'YTL'
  | 'NZD'
  | 'NIC'
  | 'NGN'
  | 'KPW'
  | 'NOK'
  | 'OMR'
  | 'PKR'
  | 'PAB'
  | 'PGK'
  | 'PYG'
  | 'PEN'
  | 'PHP'
  | 'PLN'
  | 'QAR'
  | 'RHD'
  | 'RON'
  | 'RUB'
  | 'RWF'
  | 'SHP'
  | 'STD'
  | 'SAR'
  | 'RSD'
  | 'SCR'
  | 'SLL'
  | 'SGD'
  | 'SKK'
  | 'SBD'
  | 'SOS'
  | 'ZAR'
  | 'KRW'
  | 'LKR'
  | 'SDG'
  | 'SRD'
  | 'SZL'
  | 'SEK'
  | 'CHF'
  | 'SYP'
  | 'TWD'
  | 'TJS'
  | 'TZS'
  | 'THB'
  | 'TOP'
  | 'TTD'
  | 'TND'
  | 'TMM'
  | 'USD'
  | 'UGX'
  | 'UAH'
  | 'AED'
  | 'UYU'
  | 'UZS'
  | 'VUV'
  | 'VEB'
  | 'VEF'
  | 'VND'
  | 'CHE'
  | 'CHW'
  | 'XOF'
  | 'WST'
  | 'YER'
  | 'ZMK'
  | 'ZWD'
  | 'TRY'
  | 'AZM'
  | 'ROL'
  | 'TRL'
  | 'XPF'


/** Defines a monetary value, including a numeric value and a currency code. */
export type Money = {
  /** A three-letter currency code, such as USD or EUR. */
  currency?: Maybe<CurrencyEnum>;
  /** A number expressing a monetary value. */
  value?: Maybe<Scalars['Float']>;
};

/** A single FPT that can be applied to a product price. */
export type FixedProductTax = {
  __typename?: 'FixedProductTax'
  /** Amount of the FPT as a money object. */
  amount?: Maybe<Money>
  /** The label assigned to the FPT to be displayed on the frontend. */
  label?: Maybe<Scalars['String']>
}

/** Represents a product price. */
export type ProductPrice = {
  __typename?: 'ProductPrice'
  /** The price discount. Represents the difference between the regular and final price. */
  discount?: Maybe<ProductDiscount>
  /** The final price of the product after discounts applied. */
  final_price: Money
  /** The multiple FPTs that can be applied to a product price. */
  fixed_product_taxes?: Maybe<Array<Maybe<FixedProductTax>>>
  /** The regular price of the product. */
  regular_price: Money
}

/** Price range for a product. If the product has a single price, the minimum and maximum price will be the same. */
export type PriceRange = {
  __typename?: 'PriceRange'
  /** The highest possible price for the product. */
  maximum_price?: Maybe<ProductPrice>
  /** The lowest possible price for the product. */
  minimum_price: ProductPrice
}

/** Contains the applied coupon code. */
export type AppliedCoupon = {
  /** The coupon code the shopper applied to the card. */
  code: Scalars['String'];
}

/** Contains an applied gift card with applied and remaining balance. */
export type AppliedGiftCard = {
  /** The amount applied to the current cart. */
  applied_balance?: Maybe<Money>;
  /** The gift card account code. */
  code?: Maybe<Scalars['String']>;
  /** The remaining balance on the gift card. */
  current_balance?: Maybe<Money>;
  /** The expiration date of the gift card. */
  expiration_date?: Maybe<Scalars['String']>;
}

export type RewardPointsAmount = {
  /** The reward points amount in store currency. */
  money: Money;
  /** The reward points amount in points. */
  points: Scalars['Float'];
}

/** Contains the applied and current balances. */
export type AppliedStoreCredit = {
  /** The applied store credit balance to the current cart. */
  applied_balance?: Maybe<Money>;
  /** The current balance remaining on store credit. */
  current_balance?: Maybe<Money>;
  /** Indicates whether store credits are enabled. If the feature is disabled, then the current balance will not be returned. */
  enabled?: Maybe<Scalars['Boolean']>;
};

/** Points to an image associated with a gift wrapping option. */
export type GiftWrappingImage = {
  /** The gift wrapping preview image label. */
  label: Scalars['String'];
  /** The gift wrapping preview image URL. */
  url: Scalars['String'];
}

/** Contains details about the selected or available gift wrapping options. */
export type GiftWrapping = {
  /** The name of the gift wrapping design. */
  design: Scalars['String'];
  /**
   * The unique ID for a `GiftWrapping` object.
   * @deprecated Use `uid` instead
   */
  id: Scalars['ID'];
  /** The preview image for a gift wrapping option. */
  image?: Maybe<GiftWrappingImage>;
  /** The gift wrapping price. */
  price: Money;
  /** The unique ID for a `GiftWrapping` object. */
  uid: Scalars['ID'];
}

/** Describes a payment method that the shopper can use to pay for the order. */
export type AvailablePaymentMethod = {
  /** The payment method code. */
  code: Scalars['String'];
  /** If the payment method is an online integration */
  is_deferred: Scalars['Boolean'];
  /** The payment method title. */
  title: Scalars['String'];
}

/** Contains details the country in a billing or shipping address. */
export type CartAddressCountry = {
  /** The country code. */
  code: Scalars['String'];
  /** The display label for the country. */
  label: Scalars['String'];
}

/** Contains details about the region in a billing or shipping address. */
export type CartAddressRegion = {
  /** The state or province code. */
  code?: Maybe<Scalars['String']>;
  /** The display label for the region. */
  label?: Maybe<Scalars['String']>;
  /** The unique ID for a pre-defined region. */
  region_id?: Maybe<Scalars['Int']>;
};

export type CartAddressInterface = {
  /** The city specified for the billing or shipping address. */
  city: Scalars['String'];
  /** The company specified for the billing or shipping address. */
  company?: Maybe<Scalars['String']>;
  /** An object containing the country label and code. */
  country: CartAddressCountry;
  /** The first name of the customer or guest. */
  firstname: Scalars['String'];
  /** The last name of the customer or guest. */
  lastname: Scalars['String'];
  /** The ZIP or postal code of the billing or shipping address. */
  postcode?: Maybe<Scalars['String']>;
  /** An object containing the region label and code. */
  region?: Maybe<CartAddressRegion>;
  /** An array containing the street for the billing or shipping address. */
  street: Array<Maybe<Scalars['String']>>;
  /** The telephone number for the billing or shipping address. */
  telephone?: Maybe<Scalars['String']>;
  /** The unique id of the customer address. */
  uid: Scalars['String'];
  /** The VAT company number for billing or shipping address. */
  vat_id?: Maybe<Scalars['String']>;
}

/** Contains details about the billing address. */
export type BillingCartAddress = CartAddressInterface & {
  /** The city specified for the billing or shipping address. */
  city: Scalars['String'];
  /** The company specified for the billing or shipping address. */
  company?: Maybe<Scalars['String']>;
  /** An object containing the country label and code. */
  country: CartAddressCountry;
  /** @deprecated The field is used only in shipping address. */
  customer_notes?: Maybe<Scalars['String']>;
  /** The first name of the customer or guest. */
  firstname: Scalars['String'];
  /** The last name of the customer or guest. */
  lastname: Scalars['String'];
  /** The ZIP or postal code of the billing or shipping address. */
  postcode?: Maybe<Scalars['String']>;
  /** An object containing the region label and code. */
  region?: Maybe<CartAddressRegion>;
  /** An array containing the street for the billing or shipping address. */
  street: Array<Maybe<Scalars['String']>>;
  /** The telephone number for the billing or shipping address. */
  telephone?: Maybe<Scalars['String']>;
  /** The unique id of the customer address. */
  uid: Scalars['String'];
  /** The VAT company number for billing or shipping address. */
  vat_id?: Maybe<Scalars['String']>;
};

/** Contains the text of a gift message, its sender, and recipient */
export type GiftMessage = {
  /** Sender name */
  from: Scalars['String'];
  /** Gift message text */
  message: Scalars['String'];
  /** Recipient name */
  to: Scalars['String'];
}

/** Defines an individual discount. A discount can be applied to the cart as a whole or to an item. */
export type Discount = {
  /** The amount of the discount. */
  amount: Money;
  /** A description of the discount. */
  label: Scalars['String'];
}

/** Contains details about the price of the item, including taxes and discounts. */
export type CartItemPrices = {
  __typename?: 'CartItemPrices'
  /** An array of discounts to be applied to the cart item. */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /** An array of FPTs applied to the cart item. */
  fixed_product_taxes?: Maybe<Array<Maybe<FixedProductTax>>>;
  /** The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart. */
  price: Money;
  /** The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart. */
  price_including_tax: Money;
  /** The value of the price multiplied by the quantity of the item. */
  row_total: Money;
  /** The value of `row_total` plus the tax applied to the item. */
  row_total_including_tax: Money;
  /** The total of all discounts applied to the item. */
  total_item_discount?: Maybe<Money>;
}

export type CartItemInterface = {
  /** An array of errors encountered while loading the cart item */
  errors?: Maybe<Array<Maybe<CartItemError>>>;
  /** @deprecated Use `uid` instead. */
  id: Scalars['String'];
  /** Contains details about the price of the item, including taxes and discounts. */
  prices?: Maybe<CartItemPrices>;
  /** Details about an item in the cart. */
  product: ProductInterface;
  /** The quantity of this item in the cart. */
  quantity: Scalars['Float'];
  /** The unique ID for a `CartItemInterface` object. */
  uid: Scalars['ID'];
}

export type CartItemErrorType =
  | 'UNDEFINED'
  | 'ITEM_QTY'
  | 'ITEM_INCREMENTS'

export type CartItemError = {
  /** An error code that describes the error encountered */
  code: CartItemErrorType;
  /** A localized error message */
  message: Scalars['String'];
}

/** Contains tax information about an item in the cart. */
export type CartTaxItem = {
  /** The amount of tax applied to the item. */
  amount: Money;
  /** The description of the tax. */
  label: Scalars['String'];
}

/** Contains information about discounts applied to the cart. */
export type CartDiscount = {
  /** The amount of the discount applied to the item. */
  amount: Money;
  /** The description of the discount. */
  label: Array<Maybe<Scalars['String']>>;
}

/** Contains prices for gift wrapping options. */
export type GiftOptionsPrices = {
  /** Price of the gift wrapping for all individual order items. */
  gift_wrapping_for_items?: Maybe<Money>;
  /** Price of the gift wrapping for the whole order. */
  gift_wrapping_for_order?: Maybe<Money>;
  /** Price for the printed card. */
  printed_card?: Maybe<Money>;
}

/** Contains details about the final price of items in the cart, including discount and tax information. */
export type CartPrices = {
  __typename?: 'CartPrices'
  /** An array containing the names and amounts of taxes applied to each item in the cart. */
  applied_taxes?: Maybe<Array<Maybe<CartTaxItem>>>;
  /** @deprecated Use discounts instead. */
  discount?: Maybe<CartDiscount>;
  /** An array containing cart rule discounts, store credit and gift cards applied to the cart. */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /** The list of prices for the selected gift options. */
  gift_options?: Maybe<GiftOptionsPrices>;
  /** The total, including discounts, taxes, shipping, and other fees. */
  grand_total?: Maybe<Money>;
  /** The subtotal without any applied taxes. */
  subtotal_excluding_tax?: Maybe<Money>;
  /** The subtotal including any applied taxes. */
  subtotal_including_tax?: Maybe<Money>;
  /** The subtotal with any discounts applied, but not taxes. */
  subtotal_with_discount_excluding_tax?: Maybe<Money>;
}

/** Describes the payment method the shopper selected. */
export type SelectedPaymentMethod = {
  /** The payment method code. */
  code: Scalars['String'];
  /** The purchase order number. */
  purchase_order_number?: Maybe<Scalars['String']>;
  /** The payment method title. */
  title: Scalars['String'];
}


/** Contains details about the possible shipping methods and carriers. */
export type AvailableShippingMethod = {
  /** The cost of shipping using this shipping method. */
  amount: Money;
  /** Indicates whether this shipping method can be applied to the cart. */
  available: Scalars['Boolean'];
  /** @deprecated The field should not be used on the storefront. */
  base_amount?: Maybe<Money>;
  /** A string that identifies a commercial carrier or an offline shipping method. */
  carrier_code: Scalars['String'];
  /** The label for the carrier code. */
  carrier_title: Scalars['String'];
  /** Describes an error condition. */
  error_message?: Maybe<Scalars['String']>;
  /** A shipping method code associated with a carrier. The value could be null if no method is available. */
  method_code?: Maybe<Scalars['String']>;
  /** The label for the shipping method code. The value could be null if no method is available. */
  method_title?: Maybe<Scalars['String']>;
  /** The cost of shipping using this shipping method, excluding tax. */
  price_excl_tax: Money;
  /** The cost of shipping using this shipping method, including tax. */
  price_incl_tax: Money;
}

/** Deprecated: The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
export type CartItemQuantity = {
  /** @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
  cart_item_id: Scalars['Int'];
  /** @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
  quantity: Scalars['Float'];
}

/** Contains shipping addresses and methods. */
export type ShippingCartAddress = CartAddressInterface & {
  /** An array that lists the shipping methods that can be applied to the cart. */
  available_shipping_methods?: Maybe<Array<Maybe<AvailableShippingMethod>>>;
  /** @deprecated Use `cart_items_v2` instead. */
  cart_items?: Maybe<Array<Maybe<CartItemQuantity>>>;
  /** An array that lists the items in the cart. */
  cart_items_v2?: Maybe<Array<Maybe<CartItemInterface>>>;
  /** The city specified for the billing or shipping address. */
  city: Scalars['String'];
  /** The company specified for the billing or shipping address. */
  company?: Maybe<Scalars['String']>;
  /** An object containing the country label and code. */
  country: CartAddressCountry;
  /** Text provided by the shopper. */
  customer_notes?: Maybe<Scalars['String']>;
  /** The first name of the customer or guest. */
  firstname: Scalars['String'];
  /** @deprecated This information should not be exposed on the frontend. */
  items_weight?: Maybe<Scalars['Float']>;
  /** The last name of the customer or guest. */
  lastname: Scalars['String'];
  pickup_location_code?: Maybe<Scalars['String']>;
  /** The ZIP or postal code of the billing or shipping address. */
  postcode?: Maybe<Scalars['String']>;
  /** An object containing the region label and code. */
  region?: Maybe<CartAddressRegion>;
  /** An object that describes the selected shipping method. */
  selected_shipping_method?: Maybe<SelectedShippingMethod>;
  /** An array containing the street for the billing or shipping address. */
  street: Array<Maybe<Scalars['String']>>;
  /** The telephone number for the billing or shipping address. */
  telephone?: Maybe<Scalars['String']>;
  /** The unique id of the customer address. */
  uid: Scalars['String'];
  /** The VAT company number for billing or shipping address. */
  vat_id?: Maybe<Scalars['String']>;
}

/** Contains details about the selected shipping method and carrier. */
export type SelectedShippingMethod = {
  /** The cost of shipping using this shipping method. */
  amount: Money;
  /** @deprecated The field should not be used on the storefront. */
  base_amount?: Maybe<Money>;
  /** A string that identifies a commercial carrier or an offline shipping method. */
  carrier_code: Scalars['String'];
  /** The label for the carrier code. */
  carrier_title: Scalars['String'];
  /** A shipping method code associated with a carrier. */
  method_code: Scalars['String'];
  /** The label for the method code. */
  method_title: Scalars['String'];
  /** The cost of shipping using this shipping method, excluding tax. */
  price_excl_tax: Money;
  /** The cost of shipping using this shipping method, including tax. */
  price_incl_tax: Money;
}

/** Contains the contents and other details about a guest or customer cart. */
export type Cart = {
  /** @deprecated Use `applied_coupons` instead. */
  applied_coupon?: Maybe<AppliedCoupon>;
  /** An array of `AppliedCoupon` objects. Each object contains the `code` text attribute, which specifies the coupon code. */
  applied_coupons?: Maybe<Array<Maybe<AppliedCoupon>>>;
  /** An array of gift card items applied to the cart. */
  applied_gift_cards?: Maybe<Array<Maybe<AppliedGiftCard>>>;
  /** The amount of reward points applied to the cart. */
  applied_reward_points?: Maybe<RewardPointsAmount>;
  /** Store credit information applied to the cart. */
  applied_store_credit?: Maybe<AppliedStoreCredit>;
  /** The list of available gift wrapping options for the cart. */
  available_gift_wrappings: Array<Maybe<GiftWrapping>>;
  /** An array of available payment methods. */
  available_payment_methods?: Maybe<Array<Maybe<AvailablePaymentMethod>>>;
  /** The billing address assigned to the cart. */
  billing_address?: Maybe<BillingCartAddress>;
  /** The email address of the guest or customer. */
  email?: Maybe<Scalars['String']>;
  /** The entered gift message for the cart */
  gift_message?: Maybe<GiftMessage>;
  /** Indicates whether the shopper requested gift receipt for the cart. */
  gift_receipt_included: Scalars['Boolean'];
  /** The selected gift wrapping for the cart. */
  gift_wrapping?: Maybe<GiftWrapping>;
  /** The unique ID for a `Cart` object. */
  id: Scalars['ID'];
  /** Indicates whether the cart contains only virtual products. */
  is_virtual: Scalars['Boolean'];
  /** An array of products that have been added to the cart. */
  items?: Maybe<Array<Maybe<CartItemInterface>>>;
  /** Pricing details for the quote. */
  prices?: Maybe<CartPrices>;
  /** Indicates whether the shopper requested a printed card for the cart. */
  printed_card_included: Scalars['Boolean'];
  /** Indicates which payment method was applied to the cart. */
  selected_payment_method?: Maybe<SelectedPaymentMethod>;
  /** An array of shipping addresses assigned to the cart. */
  shipping_addresses: Array<Maybe<ShippingCartAddress>>;
  /** The total number of items in the cart. */
  total_quantity: Scalars['Float'];
}

/** Provides navigation for the query response. */
export type SearchResultPageInfo = {
  /** The specific page to return. */
  current_page?: Maybe<Scalars['Int']>;
  /** The maximum number of items to return per page of results. */
  page_size?: Maybe<Scalars['Int']>;
  /** The total number of pages in the response. */
  total_pages?: Maybe<Scalars['Int']>;
}

/** Contains details about the products assigned to a category. */
export type CategoryProducts = {
  /** An array of products that are assigned to the category. */
  items?: Maybe<Array<Maybe<ProductInterface>>>;
  /** Pagination metadata. */
  page_info?: Maybe<SearchResultPageInfo>;
  /** The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not. */
  total_count?: Maybe<Scalars['Int']>;
}

/** Contains details about an individual category that comprises a breadcrumb. */
export type Breadcrumb = {
  /**
   * The ID of the category.
   * @deprecated Use `category_uid` instead.
   */
  category_id?: Maybe<Scalars['Int']>;
  /** The category level. */
  category_level?: Maybe<Scalars['Int']>;
  /** The display name of the category. */
  category_name?: Maybe<Scalars['String']>;
  /** The unique ID for a `Breadcrumb` object. */
  category_uid: Scalars['ID'];
  /** The URL key of the category. */
  category_url_key?: Maybe<Scalars['String']>;
  /** The URL path of the category. */
  category_url_path?: Maybe<Scalars['String']>;
}

/** Contains an array CMS block items. */
export type CmsBlocks = {
  /** An array of CMS blocks. */
  items?: Maybe<Array<Maybe<CmsBlock>>>;
}

/** Contains details about a specific CMS block. */
export type CmsBlock = {
  /** The content of the CMS block in raw HTML. */
  content?: Maybe<Scalars['String']>;
  /** The CMS block identifier. */
  identifier?: Maybe<Scalars['String']>;
  /** The title assigned to the CMS block. */
  title?: Maybe<Scalars['String']>;
}

/** Contains the full set of attributes that can be returned in a category search. */
export type CategoryInterface = {
  automatic_sorting?: Maybe<Scalars['String']>;
  available_sort_by?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** An array of breadcrumb items. */
  breadcrumbs?: Maybe<Array<Maybe<Breadcrumb>>>;
  /** The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Categories' is enabled. */
  canonical_url?: Maybe<Scalars['String']>;
  children_count?: Maybe<Scalars['String']>;
  /** Contains a category CMS block. */
  cms_block?: Maybe<CmsBlock>;
  /**
   * The timestamp indicating when the category was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars['String']>;
  custom_layout_update_file?: Maybe<Scalars['String']>;
  /** The attribute to use for sorting. */
  default_sort_by?: Maybe<Scalars['String']>;
  /** An optional description of the category. */
  description?: Maybe<Scalars['String']>;
  display_mode?: Maybe<Scalars['String']>;
  filter_price_range?: Maybe<Scalars['Float']>;
  /**
   * An ID that uniquely identifies the category.
   * @deprecated Use `uid` instead.
   */
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  include_in_menu?: Maybe<Scalars['Int']>;
  is_anchor?: Maybe<Scalars['Int']>;
  landing_page?: Maybe<Scalars['Int']>;
  /** The depth of the category within the tree. */
  level?: Maybe<Scalars['Int']>;
  meta_description?: Maybe<Scalars['String']>;
  meta_keywords?: Maybe<Scalars['String']>;
  meta_title?: Maybe<Scalars['String']>;
  /** The display name of the category. */
  name?: Maybe<Scalars['String']>;
  /** The full category path. */
  path?: Maybe<Scalars['String']>;
  /** The category path within the store. */
  path_in_store?: Maybe<Scalars['String']>;
  /** The position of the category relative to other categories at the same level in tree. */
  position?: Maybe<Scalars['Int']>;
  /** The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not. */
  product_count?: Maybe<Scalars['Int']>;
  /** The list of products assigned to the category. */
  products?: Maybe<CategoryProducts>;
  /** Indicates whether the category is staged for a future campaign. */
  staged: Scalars['Boolean'];
  /** The unique ID for a `CategoryInterface` object. */
  uid: Scalars['ID'];
  /**
   * The timestamp indicating when the category was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars['String']>;
  /** The URL key assigned to the category. */
  url_key?: Maybe<Scalars['String']>;
  /** The URL path assigned to the category. */
  url_path?: Maybe<Scalars['String']>;
  /** The part of the category URL that is appended after the url key */
  url_suffix?: Maybe<Scalars['String']>;
}

export type ComplexTextValue = {
  /** Text that can contain HTML tags. */
  html: Scalars['String'];
}

/** Contains basic information about a product image or video. */
export type MediaGalleryInterface = {
  /** Indicates whether the image is hidden from view. */
  disabled?: Maybe<Scalars['Boolean']>;
  /** The label of the product image or video. */
  label?: Maybe<Scalars['String']>;
  /** The media item's position after it has been sorted. */
  position?: Maybe<Scalars['Int']>;
  /** The URL of the product image or video. */
  url?: Maybe<Scalars['String']>;
}

/** Contains product image information, including the image URL and label. */
export type ProductImage = MediaGalleryInterface & {
  /** Indicates whether the image is hidden from view. */
  disabled?: Maybe<Scalars['Boolean']>;
  /** The label of the product image or video. */
  label?: Maybe<Scalars['String']>;
  /** The media item's position after it has been sorted. */
  position?: Maybe<Scalars['Int']>;
  /** The URL of the product image or video. */
  url?: Maybe<Scalars['String']>;
}

/** Contains an image in base64 format and basic information about the image. */
export type ProductMediaGalleryEntriesContent = {
  /** The image in base64 format. */
  base64_encoded_data?: Maybe<Scalars['String']>;
  /** The file name of the image. */
  name?: Maybe<Scalars['String']>;
  /** The MIME type of the file, such as image/png. */
  type?: Maybe<Scalars['String']>;
}

/** Contains a link to a video file and basic information about the video. */
export type ProductMediaGalleryEntriesVideoContent = {
  /** Must be external-video. */
  media_type?: Maybe<Scalars['String']>;
  /** A description of the video. */
  video_description?: Maybe<Scalars['String']>;
  /** Optional data about the video. */
  video_metadata?: Maybe<Scalars['String']>;
  /** Describes the video source. */
  video_provider?: Maybe<Scalars['String']>;
  /** The title of the video. */
  video_title?: Maybe<Scalars['String']>;
  /** The URL to the video. */
  video_url?: Maybe<Scalars['String']>;
}

/** Defines characteristics about images and videos associated with a specific product. */
export type MediaGalleryEntry = {
  /** Details about the content of the media gallery item. */
  content?: Maybe<ProductMediaGalleryEntriesContent>;
  /** Indicates whether the image is hidden from view. */
  disabled?: Maybe<Scalars['Boolean']>;
  /** The path of the image on the server. */
  file?: Maybe<Scalars['String']>;
  /**
   * The identifier assigned to the object.
   * @deprecated Use `uid` instead.
   */
  id?: Maybe<Scalars['Int']>;
  /** The alt text displayed on the storefront when the user points to the image. */
  label?: Maybe<Scalars['String']>;
  /** Either `image` or `video`. */
  media_type?: Maybe<Scalars['String']>;
  /** The media item's position after it has been sorted. */
  position?: Maybe<Scalars['Int']>;
  /** Array of image types. It can have the following values: image, small_image, thumbnail. */
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The unique ID for a `MediaGalleryEntry` object. */
  uid: Scalars['ID'];
  /** Details about the content of a video item. */
  video_content?: Maybe<ProductMediaGalleryEntriesVideoContent>;
}

/** Deprecated. Use `ProductPrice` instead. Defines the price of a product as well as any tax-related adjustments. */
export type Price = {
  /**
   * An array that provides information about tax, weee, or weee_tax adjustments.
   * @deprecated Use `ProductPrice` instead.
   */
  adjustments?: Maybe<Array<Maybe<PriceAdjustment>>>;
  /**
   * The price of a product plus a three-letter currency code.
   * @deprecated Use `ProductPrice` instead.
   */
  amount?: Maybe<Money>;
}

/** Deprecated. Taxes will be included or excluded in the price. Defines the amount of money to apply as an adjustment, the type of adjustment to apply, and whether the item is included or excluded from the adjustment. */
export type PriceAdjustment = {
  /** The amount of the price adjustment and its currency code. */
  amount?: Maybe<Money>;
  /**
   * Indicates whether the adjustment involves tax, weee, or weee_tax.
   * @deprecated `PriceAdjustment` is deprecated.
   */
  code?: Maybe<PriceAdjustmentCodesEnum>;
  /**
   * Indicates whether the entity described by the code attribute is included or excluded from the adjustment.
   * @deprecated `PriceAdjustment` is deprecated.
   */
  description?: Maybe<PriceAdjustmentDescriptionEnum>;
}

/** `PriceAdjustment.code` is deprecated. */
export type PriceAdjustmentCodesEnum =
  | 'TAX'
  | 'WEEE'
  | 'WEEE_TAX'

/** `PriceAdjustmentDescriptionEnum` is deprecated. States whether a price adjustment is included or excluded. */
export type PriceAdjustmentDescriptionEnum =
  | 'INCLUDED'
  | 'EXCLUDED'

/** Defines the price type. */
export type PriceTypeEnum =
  | 'FIXED'
  | 'PERCENT'
  | 'DYNAMIC'

/** Defines the customizable date type. */
export type CustomizableDateTypeEnum =
  | 'DATE'
  | 'DATE_TIME'
  | 'TIME'

/** Deprecated. Use `PriceRange` instead. Contains the regular price of an item, as well as its minimum and maximum prices. Only composite products, which include bundle, configurable, and grouped products, can contain a minimum and maximum price. */
export type ProductPrices = {
  /**
   * The highest possible final price for all the options defined within a composite product. If you are specifying a price range, this would be the `to` value.
   * @deprecated Use `PriceRange.maximum_price` instead.
   */
  maximalPrice?: Maybe<Price>;
  /**
   * The lowest possible final price for all the options defined within a composite product. If you are specifying a price range, this would be the `from` value.
   * @deprecated Use `PriceRange.minimum_price` instead.
   */
  minimalPrice?: Maybe<Price>;
  /**
   * The base price of a product.
   * @deprecated Use `regular_price` from `PriceRange.minimum_price` or `PriceRange.maximum_price` instead.
   */
  regularPrice?: Maybe<Price>;
}

/** Defines a price based on the quantity purchased. */
export type TierPrice = {
  /** The price discount that this tier represents. */
  discount?: Maybe<ProductDiscount>;
  /** The price of the product at this tier. */
  final_price?: Maybe<Money>;
  /** The minimum number of items that must be purchased to qualify for this price tier. */
  quantity?: Maybe<Scalars['Float']>;
}

/** Contains information about linked products, including the link type and product type of each item. */
export type ProductLinksInterface = {
  /** One of related, associated, upsell, or crosssell. */
  link_type?: Maybe<Scalars['String']>;
  /** The SKU of the linked product. */
  linked_product_sku?: Maybe<Scalars['String']>;
  /** The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable). */
  linked_product_type?: Maybe<Scalars['String']>;
  /** The position within the list of product links. */
  position?: Maybe<Scalars['Int']>;
  /** The identifier of the linked product. */
  sku?: Maybe<Scalars['String']>;
}

/** Contains fields that are common to all types of products. */
export type ProductInterface = {
  /** @deprecated Use the `custom_attributes` field instead. */
  activity?: Maybe<Scalars['String']>;
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars['Int']>;
  /** The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled. */
  canonical_url?: Maybe<Scalars['String']>;
  /** The categories assigned to a product. */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /** @deprecated Use the `custom_attributes` field instead. */
  category_gear?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  climate?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  collar?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  color?: Maybe<Scalars['Int']>;
  /** The product's country of origin. */
  country_of_manufacture?: Maybe<Scalars['String']>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars['String']>;
  /** An array of cross-sell products. */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /** Detailed information about the product. The value can include simple HTML tags. */
  description?: Maybe<ComplexTextValue>;
  /** @deprecated Use the `custom_attributes` field instead. */
  eco_collection?: Maybe<Scalars['Int']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  erin_recommends?: Maybe<Scalars['Int']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  features_bags?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  format?: Maybe<Scalars['Int']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  gender?: Maybe<Scalars['String']>;
  /** Indicates whether a gift message is available. */
  gift_message_available?: Maybe<Scalars['String']>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars['Int']>;
  /** The relative path to the main image on the product page. */
  image?: Maybe<ProductImage>;
  /** Indicates whether the product can be returned. */
  is_returnable?: Maybe<Scalars['String']>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars['Int']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  material?: Maybe<Scalars['String']>;
  /** An array of media gallery objects. */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /** A brief overview of the product for search results listings, maximum 255 characters. */
  meta_description?: Maybe<Scalars['String']>;
  /** A comma-separated list of keywords that are visible only to search engines. */
  meta_keyword?: Maybe<Scalars['String']>;
  /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
  meta_title?: Maybe<Scalars['String']>;
  /** The product name. Customers use this name to identify the product. */
  name?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  new?: Maybe<Scalars['Int']>;
  /** The beginning date for new product listings, and determines if the product is featured as a new product. */
  new_from_date?: Maybe<Scalars['String']>;
  /** The end date for new product listings. */
  new_to_date?: Maybe<Scalars['String']>;
  /** Product stock only x left count */
  only_x_left_in_stock?: Maybe<Scalars['Float']>;
  /** If the product has multiple options, determines where they appear on the product page. */
  options_container?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  pattern?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  performance_fabric?: Maybe<Scalars['Int']>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /** The range of prices for the product */
  price_range: PriceRange;
  /** An array of `TierPrice` objects. */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /** An array of `ProductLinks` objects. */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /** @deprecated Use the `custom_attributes` field instead. */
  purpose?: Maybe<Scalars['Int']>;
  /** The average of all the ratings given to the product. */
  rating_summary: Scalars['Float'];
  /** An array of related products. */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /** The total count of all the reviews given to the product. */
  review_count: Scalars['Int'];
  /** The list of products reviews. */
  reviews: ProductReviews;
  /** @deprecated Use the `custom_attributes` field instead. */
  sale?: Maybe<Scalars['Int']>;
  /** A short description of the product. Its use depends on the theme. */
  short_description?: Maybe<ComplexTextValue>;
  /** @deprecated Use the `custom_attributes` field instead. */
  size?: Maybe<Scalars['Int']>;
  /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
  sku?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  sleeve?: Maybe<Scalars['String']>;
  /** The relative path to the small image, which is used on catalog pages. */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars['String']>;
  /** The discounted price of the product. */
  special_price?: Maybe<Scalars['Float']>;
  /** The end date for a product with a special price. */
  special_to_date?: Maybe<Scalars['String']>;
  /** Indicates whether the product is staged for a future campaign. */
  staged: Scalars['Boolean'];
  /** Stock status of the product */
  stock_status?: Maybe<ProductStockStatus>;
  /** @deprecated Use the `custom_attributes` field instead. */
  strap_bags?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  style_bags?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  style_bottom?: Maybe<Scalars['String']>;
  /** @deprecated Use the `custom_attributes` field instead. */
  style_general?: Maybe<Scalars['String']>;
  /** The file name of a swatch image. */
  swatch_image?: Maybe<Scalars['String']>;
  /** The relative path to the product's thumbnail image. */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars['Float']>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars['String']>;
  /** The unique ID for a `ProductInterface` object. */
  uid: Scalars['ID'];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars['String']>;
  /** An array of up-sell products. */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /** The part of the URL that identifies the product */
  url_key?: Maybe<Scalars['String']>;
  /** @deprecated Use product's `canonical_url` or url rewrites instead */
  url_path?: Maybe<Scalars['String']>;
  /** URL rewrites list */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /** The part of the product URL that is appended after the url key */
  url_suffix?: Maybe<Scalars['String']>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
}

/** Contains an array of product reviews. */
export type ProductReviews = {
  /** An array of product reviews. */
  items: Array<Maybe<ProductReview>>;
  /** Metadata for pagination rendering. */
  page_info: SearchResultPageInfo;
}

/** Contains details of a product review. */
export type ProductReview = {
  /** The average of all ratings for this product. */
  average_rating: Scalars['Float'];
  /** The date the review was created. */
  created_at: Scalars['String'];
  /** The customer's nickname. Defaults to the customer name, if logged in. */
  nickname: Scalars['String'];
  /** The reviewed product. */
  product: ProductInterface;
  /** An array of ratings by rating category, such as quality, price, and value. */
  ratings_breakdown: Array<Maybe<ProductReviewRating>>;
  /** The summary (title) of the review. */
  summary: Scalars['String'];
  /** The review text. */
  text: Scalars['String'];
}

/** Contains data about a single aspect of a product review. */
export type ProductReviewRating = {
  /** The label assigned to an aspect of a product that is being rated, such as quality or price. */
  name: Scalars['String'];
  /** The rating value given by customer. By default, possible values range from 1 to 5. */
  value: Scalars['String'];
}

/** This enumeration states whether a product stock status is in stock or out of stock */
export type ProductStockStatus =
  | 'IN_STOCK'
  | 'OUT_OF_STOCK'

/** Deprecated. Use `TierPrice` instead. Defines a tier price, which is a quantity discount offered to a specific customer group. */
export type ProductTierPrices = {
  /**
   * The ID of the customer group.
   * @deprecated Not relevant for the storefront.
   */
  customer_group_id?: Maybe<Scalars['String']>;
  /**
   * The percentage discount of the item.
   * @deprecated Use `TierPrice.discount` instead.
   */
  percentage_value?: Maybe<Scalars['Float']>;
  /**
   * The number of items that must be purchased to qualify for tier pricing.
   * @deprecated Use `TierPrice.quantity` instead.
   */
  qty?: Maybe<Scalars['Float']>;
  /**
   * The price of the fixed price item.
   * @deprecated Use `TierPrice.final_price` instead.
   */
  value?: Maybe<Scalars['Float']>;
  /**
   * The ID assigned to the website.
   * @deprecated Not relevant for the storefront.
   */
  website_id?: Maybe<Scalars['Float']>;
}

/** Contains URL rewrite details. */
export type UrlRewrite = {
  /** An array of request parameters. */
  parameters?: Maybe<Array<Maybe<HttpQueryParameter>>>;
  /** The request URL. */
  url?: Maybe<Scalars['String']>;
}

/** Contains target path parameters. */
export type HttpQueryParameter = {
  /** A parameter name. */
  name?: Maybe<Scalars['String']>;
  /** A parameter value. */
  value?: Maybe<Scalars['String']>;
}

/** Deprecated. It should not be used on the storefront. Contains information about a website. */
export type Website = {
  /**
   * A code assigned to the website to identify it.
   * @deprecated The field should not be used on the storefront.
   */
  code?: Maybe<Scalars['String']>;
  /**
   * The default group ID of the website.
   * @deprecated The field should not be used on the storefront.
   */
  default_group_id?: Maybe<Scalars['String']>;
  /**
   * The ID number assigned to the website.
   * @deprecated The field should not be used on the storefront.
   */
  id?: Maybe<Scalars['Int']>;
  /**
   * Indicates whether this is the default website.
   * @deprecated The field should not be used on the storefront.
   */
  is_default?: Maybe<Scalars['Boolean']>;
  /**
   * The website name. Websites use this name to identify it easier.
   * @deprecated The field should not be used on the storefront.
   */
  name?: Maybe<Scalars['String']>;
  /**
   * The attribute to use for sorting websites.
   * @deprecated The field should not be used on the storefront.
   */
  sort_order?: Maybe<Scalars['Int']>;
}

export type SelectedBundleOptionValue = {
  /** The display name of the value for the selected bundle product option. */
  label: Scalars['String'];
  /** The price of the value for the selected bundle product option. */
  price: Scalars['Float'];
  /** The quantity of the value for the selected bundle product option. */
  quantity: Scalars['Float'];
  /** The unique ID for a `SelectedBundleOptionValue` object */
  uid: Scalars['ID'];
};