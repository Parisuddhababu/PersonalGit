/**********************Local Environment Start************************** */
// // //Development Server API URL
export const BASE_URL = process.env.REACT_APP_FULL_BASE_URL;
export const PARTIAL_BASE_URL = process.env.REACT_APP_BASE_URL;
export const SAMPLE_FILE_URL = process.env.REACT_APP_BASE_URL + '/uploads/exports/';
export const CKEDITOR_BASE_URL = process.env.REACT_APP_CKEDITOR_BASE_URL;
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
export const SITE_DOMAIN = process.env.REACT_APP_SITE_DOMAIN;
export const SITE_SCHEME = "https://";

export const IMAGE_SIZE = 5
export const MAX_BYTE_SIZE = 5000000
export const NO_VALUE = '-';
export const PRIME_URL = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png";
export const NUMBER_FORMAT_LANG = 'en-IN'

/**************API Verbs****************************/
export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';
export const PUT = 'PUT';

/*******************File type data*******************/
export const FILE_TYPE_DATA = {
    image: ["image/jpg", "image/jpeg", "image/png"],
    excel: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    pdf: ["application/pdf"],
}

/**************SAMPLE FILE URL LIST *****************/
export const PincodeSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/pin_code_sample_file.xlsx"
export const CitySampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/city_sample_file.xlsx"
export const StateSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/state_sample_file.xlsx"
export const SuperAdminFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/product_sample_file.xlsx"
export const MicrositeAdminFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/product_sample_file_microsite_admin.xlsx"
export const AdminUserSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/admin_sample_file.xlsx"
export const B2B2CUserSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/b2b2cuser_sample_file.xlsx"
export const B2BUserSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/b2buser_sample_file.xlsx"
export const MicrositeAdminUserSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/micrositeadmin_sample_file.xlsx"
export const AccountSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/account_import_sample-excel.xlsx"
export const ProductGroupSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/productSKUSample_1679488340.xlsx"
export const ProductsFromDbSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/ProductFromDB.xlsx";
export const CustomProductsSampleFileUrl = "https://s3.ap-south-1.amazonaws.com/manicad.in/uploads/exports/CustomProducts.xlsx";
export const TaxRateSampleFileUrl = "https://ocusoftapi.demo.brainvire.dev/SampleTaxRate.csv";

//-------------------------------Growl Message Message summary----------------------------------

export const SUCCESS_MESSAGE_SUMMARY = 'Success message';
export const ERROR_MESSAGE_SUMMARY = 'Error message';
export const WARNING_MESSAGE_SUMMARY = 'Warning message';
export const INFO_MESSAGE_SUMMARY = 'Info message';
export const NETWORK_ERROR_MESSAGE = 'Network Error';
export const UNABLE_TO_LOGIN = "There is an issue while logging you in , please try again";
export const IMAGE_MAX_SIZE = "Max upload size 5 MB"
export const VIDEO_MAX_SIZE = "Max upload size is 4MB";
export const IMAGE_ERR = "Allow only png, jpg and jpeg"
//-------------------------------Growl Message Message Type----------------------------------------

export const SUCCESS_MESSAGE_TYPE = 'success';
export const ERROR_MESSAGE_TYPE = 'error';
export const WARNING_MESSAGE_TYPE = 'warn';
export const INFO_MESSAGE_TYPE = 'info';

export const TOAST_TIMEOUT = 3000;
// Datatable config - START
export const DT_ROW = 10;
export const DT_ROWS_LIST = [10, 20, 50, 100];
export const DT_PAGE_TEMPLATE = "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown";
export const DT_PAGE_REPORT_TEMP = "Showing {first} to {last} of {totalRecords}";
// Datatable config - END

export const StatusEnum = {
    active: 1,
    inactive: 0
}

export const STATUS_OPTION = [
    { name: 'Active', code: StatusEnum.active },
    { name: 'Inactive', code: StatusEnum.inactive }
]

export const PAYMENT_OPTION = [
    { name: 'Paid', code: 'paid' },
    { name: 'Expired', code: 'expired' }
]

export const TryAtHomeEnum = {
    yes: 1,
    no: 0
}

export const CODEnum = {
    yes: 1,
    no: 0
}

export const TEXT_TRUNCATE_SIZE = 20;

export const LOGIN = "oauth/signin"
export const RESET_PASSWORD = "oauth/password/reset";
export const FORGOT_PASSWORD = "oauth/password/forgot"

export const DASHBOARD_COUNT = "dashboard/count"
export const STATISTICS = "dashboard/count-new"
export const ORDER_REPORT_STATISTICS = "dashboard/order-report"
export const ORDER_SALES_STATISTICS = "dashboard/order-sales"

export const GETPRICE = "price_range/list"
export const ADDPRICE = "price_range/create"
export const DELETEPRICE = "price_range/delete/"
export const UPDATEPRICE = "price_range/update/"
export const SHOWPRICE = "price_range/show/"
export const UPDATEPRICESTATUS = "price_range/change_status"
export const MOVEPRICE = "price_range/move"

export const GETMETAL = "metal_weight/list"
export const ADDMETAL = "metal_weight/create"
export const SHOWMETAL = "metal_weight/show/"
export const UPDATEMETAL = "metal_weight/update/"
export const DELETEMETAL = "metal_weight/delete/"
export const UPDATEMETALSTATUS = "metal_weight/change_status"
export const MOVEMETAL = "metal_weight/move"

export const GETCOLORSTONE = "color_stone/list"
export const ADDCOLORSTONE = "color_stone/create"
export const SHOWCOLORSTONE = "color_stone/show/"
export const UPDATECOLORSTONE = "color_stone/update/"
export const DELETECOLORSTONE = "color_stone/delete/"
export const UPDATECOLORSTONESTATUS = "color_stone/change_status"
export const MOVECOLORSTONE = "color_stone/move"

export const GETMETALPRICETYPE = "metal_price_type/list"
export const ADDMETALPRICETYPE = "metal_price_type/create"
export const SHOWMETALPRICETYPE = "metal_price_type/show/"
export const UPDATEMETALPRICETYPE = "metal_price_type/update/"
export const UPDATEMETALPRICETYPESTATUS = "metal_price_type/change_status"
export const DELETEMETALPRICETYPE = "metal_price_type/delete/"
export const MOVEMETALPRICETYPE = "metal_price_type/move"

export const GETLABOURCHARGED = "labour_charged/list"
export const ADDLABOURCHARGED = "labour_charged/create"
export const SHOWLABOURCHARGED = "labour_charged/show/"
export const UPDATELABOURCHARGED = "labour_charged/update/"
export const DELETELABOURCHARGED = "labour_charged/delete/"
export const UPDATELABOURCHARGEDSTATUS = "labour_charged/change_status"
export const MOVELABOURCHARGED = "labour_charged/move"

export const GETLABOURCHARGETYPE = "labour_charge_type/list"
export const ADDLABOURCHARGETYPE = "labour_charge_type/create"
export const SHOWLABOURCHARGETYPE = "labour_charge_type/show/"
export const UPDATELABOURCHARGETYPE = "labour_charge_type/update/"
export const UPDATELABOURCHARGETYPESTATUS = "labour_charge_type/change_status"
export const DELETELABOURCHARGETYPE = "labour_charge_type/delete/"
export const MOVELABOURCHARGETYPE = "labour_charge_type/move"
export const GETACTIVELABOURCHARGETYPE = "labour_charge_type/active/list"

export const GETDIAMONDSIEVES = "diamond_sieves/list"
export const ADDDIAMONDSIEVES = "diamond_sieves/create"
export const SHOWDIAMONDSIEVES = "diamond_sieves/show/"
export const UPDATEDIAMONDSIEVES = "diamond_sieves/update/"
export const DELETEDIAMONDSIEVES = "diamond_sieves/delete/"
export const UPDATEDIAMONDSIEVESSTATUS = "diamond_sieves/change_status"
export const MOVEDIAMONDSIEVES = "diamond_sieves/move"

export const GETDIAMONDSHAPES = "diamond_shape/list"
export const ADDDIAMONDSHAPES = "diamond_shape/create"
export const SHOWDIAMONDSHAPES = "diamond_shape/show/"
export const UPDATEDIAMONDSHAPES = "diamond_shape/update/"
export const DELETEDIAMONDSHAPES = "diamond_shape/delete/"
export const UPDATEDIAMONDSHAPESSTATUS = "diamond_shape/change_status"
export const MOVEDIAMONDSHAPES = "diamond_shape/move"

export const GETDIAMONDCLARITIES = "diamond_clarities/list"
export const ADDDIAMONDCLARITIES = "diamond_clarities/create"
export const SHOWDIAMONDCLARITIES = "diamond_clarities/show/"
export const UPDATEDIAMONDCLARITIES = "diamond_clarities/update/"
export const DELETEDIAMONDCLARITIES = "diamond_clarities/delete/"
export const UPDATEDIAMONDCLARITIESSTATUS = "diamond_clarities/change_status"
export const MOVEDIAMONDCLARITIES = "diamond_clarities/move"

export const GETDIAMONDCOLOR = "diamond_color/list"
export const ADDDIAMONDCOLOR = "diamond_color/create"
export const SHOWDIAMONDCOLOR = "diamond_color/show/"
export const UPDATEDIAMONDCOLOR = "diamond_color/update/"
export const DELETEDIAMONDCOLOR = "diamond_color/delete/"
export const UPDATEDIAMONDCOLORSTATUS = "diamond_color/change_status"
export const MOVEDIAMONDCOLOR = "diamond_color/move"

export const GETLENGTH = "length/list"
export const ADDLENGTH = "length/create"
export const SHOWLENGTH = "length/show/"
export const UPDATELENGTH = "length/update/"
export const DELETELENGTH = "length/delete/"
export const UPDATELENGTHSTATUS = "length/change_status"
export const MOVELENGTH = "length/move"

export const GETCAREERDESIGNATION = "career_designation/list"
export const ADDCAREERDESIGNATION = "career_designation/create"
export const SHOWCAREERDESIGNATION = "career_designation/show/"
export const UPDATECAREERDESIGNATION = "career_designation/update/"
export const DELETECAREERDESIGNATION = "career_designation/delete/"
export const UPDATECAREERDESIGNATIONSTATUS = "career_designation/change_status"
export const MOVECAREERDESIGNATION = "career_designation/move"
export const GET_ACTIVE_CAREER_DESIGNATION = "career_designation/active/list"

export const GETCAREERLOCATION = "career_location/list"
export const ADDCAREERLOCATION = "career_location/create"
export const SHOWCAREERLOCATION = "career_location/show/"
export const UPDATECAREERLOCATION = "career_location/update/"
export const DELETECAREERLOCATION = "career_location/delete/"
export const UPDATECAREERLOCATIONSTATUS = "career_location/change_status"
export const MOVECAREERLOCATION = "career_location/move"
export const CAREER_LOCATION_EXPORT_EXCEL = "career_location/export-excel"
export const ACTIVE_CAREER_LOCATION_LIST = "career_location/active/list"

export const GETDIAMONDQUALITY = "diamond_quality/list"
export const ADDDIAMONDQUALITY = "diamond_quality/create"
export const SHOWDIAMONDQUALITY = "diamond_quality/show/"
export const UPDATEDIAMONDQUALITY = "diamond_quality/update/"
export const DELETEDIAMONDQUALITY = "diamond_quality/delete/"
export const UPDATEDIAMONDQUALITYSTATUS = "diamond_quality/change_status"
export const MOVEDIAMONDQUALITY = "diamond_quality/move"

export const GETCAREERREFERENCE = "career_reference/list"
export const ADDCAREERREFERENCE = "career_reference/create"
export const SHOWCAREERREFERENCE = "career_reference/show/"
export const UPDATECAREERREFERENCE = "career_reference/update/"
export const DELETECAREERREFERENCE = "career_reference/delete/"
export const UPDATECAREERREFERENCESTATUS = "career_reference/change_status"
export const MOVECAREERREFERENCE = "career_reference/move"

export const GETSOLITAIREEYECLEAN = "solitaire_eye_cleans/list"
export const ADDSOLITAIREEYECLEAN = "solitaire_eye_cleans/create"
export const SHOWSOLITAIREEYECLEAN = "solitaire_eye_cleans/show/"
export const UPDATESOLITAIREEYECLEAN = "solitaire_eye_cleans/update/"
export const DELETESOLITAIREEYECLEAN = "solitaire_eye_cleans/delete/"
export const UPDATESOLITAIREEYECLEANSTATUS = "solitaire_eye_cleans/change_status"
export const MOVESOLITAIREEYECLEAN = "solitaire_eye_cleans/move"

export const GETSOLITAIRELABS = "solitaire_labs/list"
export const ADDSOLITAIRELABS = "solitaire_labs/create"
export const SHOWSOLITAIRELABS = "solitaire_labs/show/"
export const UPDATESOLITAIRELABS = "solitaire_labs/update/"
export const DELETESOLITAIRELABS = "solitaire_labs/delete/"
export const UPDATESOLITAIRELABSSTATUS = "solitaire_labs/change_status"
export const MOVESOLITAIRELABS = "solitaire_labs/move"

export const GETSOLITAIRESYMMETRY = "solitaire_symmetry/list"
export const ADDSOLITAIRESYMMETRY = "solitaire_symmetry/create"
export const SHOWSOLITAIRESYMMETRY = "solitaire_symmetry/show/"
export const UPDATESOLITAIRESYMMETRY = "solitaire_symmetry/update/"
export const DELETESOLITAIRESYMMETRY = "solitaire_symmetry/delete/"
export const UPDATESOLITAIRESYMMETRYSTATUS = "solitaire_symmetry/change_status"
export const MOVESOLITAIRESYMMETRY = "solitaire_symmetry/move"

export const GETSOLITAIREPOLISH = "solitaire_polish/list"
export const ADDSOLITAIREPOLISH = "solitaire_polish/create"
export const SHOWSOLITAIREPOLISH = "solitaire_polish/show/"
export const UPDATESOLITAIREPOLISH = "solitaire_polish/update/"
export const DELETESOLITAIREPOLISH = "solitaire_polish/delete/"
export const UPDATESOLITAIREPOLISHSTATUS = "solitaire_polish/change_status"
export const MOVESOLITAIREPOLISH = "solitaire_polish/move"

export const GETSOLITAIRESHAPE = "solitaire_shape/list"
export const ADDSOLITAIRESHAPE = "solitaire_shape/create"
export const SHOWSOLITAIRESHAPE = "solitaire_shape/show/"
export const UPDATESOLITAIRESHAPE = "solitaire_shape/update/"
export const DELETESOLITAIRESHAPE = "solitaire_shape/delete/"
export const UPDATESOLITAIRESHAPESTATUS = "solitaire_shape/change_status"
export const MOVESOLITAIRESHAPE = "solitaire_shape/move"

export const GETSOLITAIRECLARITY = "solitaire_clarity/list"
export const ADDSOLITAIRECLARITY = "solitaire_clarity/create"
export const SHOWSOLITAIRECLARITY = "solitaire_clarity/show/"
export const UPDATESOLITAIRECLARITY = "solitaire_clarity/update/"
export const DELETESOLITAIRECLARITY = "solitaire_clarity/delete/"
export const UPDATESOLITAIRECLARITYSTATUS = "solitaire_clarity/change_status"
export const MOVESOLITAIRECLARITY = "solitaire_clarity/move"

export const GETSOLITAIRECUT = "solitaire_cut/list"
export const ADDSOLITAIRECUT = "solitaire_cut/create"
export const SHOWSOLITAIRECUT = "solitaire_cut/show/"
export const UPDATESOLITAIRECUT = "solitaire_cut/update/"
export const DELETESOLITAIRECUT = "solitaire_cut/delete/"
export const UPDATESOLITAIRECUTSTATUS = "solitaire_cut/change_status"
export const MOVESOLITAIRECUT = "solitaire_cut/move"

export const GETSOLITAIRECOLOR = "solitaire_color/list"
export const ADDSOLITAIRECOLOR = "solitaire_color/create"
export const SHOWSOLITAIRECOLOR = "solitaire_color/show/"
export const UPDATESOLITAIRECOLOR = "solitaire_color/update/"
export const DELETESOLITAIRECOLOR = "solitaire_color/delete/"
export const UPDATESOLITAIRECOLORSTATUS = "solitaire_color/change_status"
export const MOVESOLITAIRECOLOR = "solitaire_color/move"

export const GETRETURNREASONS = "return_reasons/list"
export const ADDRETURNREASONS = "return_reasons/create"
export const SHOWRETURNREASONS = "return_reasons/show/"
export const UPDATERETURNREASONS = "return_reasons/update/"
export const DELETERETURNREASONS = "return_reasons/delete/"
export const UPDATERETURNREASONSSTATUS = "return_reasons/change_status"
export const MOVERETURNREASONS = "return_reasons/move"

export const GETPRODUCTCERTIFICATE = "product_certificates/list"
export const ADDPRODUCTCERTIFICATE = "product_certificates/create"
export const SHOWPRODUCTCERTIFICATE = "product_certificates/show/"
export const UPDATEPRODUCTCERTIFICATE = "product_certificates/update/"
export const DELETEPRODUCTCERTIFICATE = "product_certificates/delete/"
export const UPDATEPRODUCTCERTIFICATESTATUS = "product_certificates/change_status"
export const MOVEPRODUCTCERTIFICATE = "product_certificates/move"


export const PRODUCT_TAG_LIST = "product_tags/list"
export const PRODUCT_TAG_CREATE = "product_tags/create"
export const PRODUCT_TAG_SHOW = "product_tags/show"
export const PRODUCT_TAG_UPDATE = "product_tags/update/"
export const PRODUCT_TAG_CHNAGE_STATUS = "product_tags/change_status"
export const PRODUCT_TAG_DELETE = "product_tags/delete/"
export const PRODUCT_TAG_ACTIVE_LIST = 'product_tags/active/list'
export const PRODUCT_TAG_SYNC = "product/sync-collection-style"

export const GETSHOPFORMODULE = "shop/list"
export const ADDSHOPFORMODULE = "shop/create"
export const SHOWSHOPFORMODULE = "shop/show/"
export const UPDATESHOPFORMODULE = "shop/update/"
export const DELETESHOPFORMODULE = "shop/delete/"
export const UPDATESHOPFORMODULESTATUS = "shop/change_status"
export const MOVESHOPFORMODULE = "shop/move"

export const GETGAUGE = "gauge/list"
export const ADDGAUGE = "gauge/create"
export const SHOWGAUGE = "gauge/show/"
export const UPDATEGAUGE = "gauge/update/"
export const DELETEGAUGE = "gauge/delete/"
export const UPDATEGAUGESTATUS = "gauge/change_status"
export const MOVEGAUGE = "gauge/move"

export const GETOCCASION = "occasion/list"
export const ADDOCCASION = "occasion/create"
export const SHOWOCCASION = "occasion/show/"
export const UPDATEOCCASION = "occasion/update/"
export const DELETEOCCASION = "occasion/delete/"
export const UPDATEOCCASIONSTATUS = "occasion/change_status"
export const MOVEOCCASION = "occasion/move"

export const GETBANGLESIZE = "bangle_size/list"
export const ADDBANGLESIZE = "bangle_size/create"
export const SHOWBANGLESIZE = "bangle_size/show/"
export const UPDATEBANGLESIZE = "bangle_size/update/"
export const DELETEBANGLESIZE = "bangle_size/delete/"
export const UPDATEBANGLESIZESTATUS = "bangle_size/change_status"
export const MOVEBANGLESIZE = "bangle_size/move"


export const GETBANGLEBRACELATESIZE = "bangle_bracelet_size/list"
export const ADDBANGLEBRACELATESIZE = "bangle_bracelet_size/create"
export const SHOWBANGLEBRACELATESIZE = "bangle_bracelet_size/show/"
export const UPDATEBANGLEBRACELATESIZE = "bangle_bracelet_size/update/"
export const DELETEBANGLEBRACELATESIZE = "bangle_bracelet_size/delete/"
export const UPDATEBANGLEBRACELATESIZESTATUS = "bangle_bracelet_size/change_status"
export const MOVEBANGLEBRACELATESIZE = "bangle_bracelet_size/move"

export const GETPRODUCTWEARTAGE = "product_wear_tag/list"
export const ADDPRODUCTWEARTAG = "product_wear_tag/create"
export const SHOWPRODUCTWEARTAG = "product_wear_tag/show/"
export const UPDATEPRODUCTWEARTAG = "product_wear_tag/update/"
export const DELETEPRODUCTWEARTAG = "product_wear_tag/delete/"
export const UPDATEPRODUCTWEARTAGSTATUS = "product_wear_tag/change_status"
export const MOVEPRODUCTWEARTAG = "product_wear_tag/move"

export const GET_PRODUCT_REVIEW_LIST = "product_review/list"
export const CHANGE_PRODUCT_REVIEW_STATUS = 'product_review/change_status'

export const GET_PRODUCT_QUESTION_LIST = "product_questions/list"
export const POST_PRODUCT_QUESTIONS_REPLY_EMAIL = "product_questions/reply_email"
export const DELETE_PRODUCT_QUESTION = "product_questions/delete/"

export const GET_PRODUCT_PRICE_LIST = "product_enquiry/list"
export const POST_PRODUCT_PRICE_REPLY_EMAIL = "product_enquiry/reply_email"


export const GETMETALPURITY = "metal_purity/list"
export const ADDMETALPURITY = "metal_purity/create"
export const SHOWMETALPURITY = "metal_purity/show/"
export const UPDATEMETALPURITY = "metal_purity/update/"
export const DELETEMETALPURITY = "metal_purity/delete/"
export const UPDATEMETALPURITYSTATUS = "metal_purity/change_status"
export const MOVEMETALPURITY = "metal_purity/move"

export const GETGENDER = "gender/list"
export const ADDGENDER = "gender/create"
export const SHOWGENDER = "gender/show/"
export const UPDATEGENDER = "gender/update/"
export const DELETEGENDER = "gender/delete/"
export const UPDATEGENDERSTATUS = "gender/change_status"
export const MOVEGENDER = "gender/move"

export const GETPRODUCTLOOKSTAG = "product_looks_tag/list"
export const ADDPRODUCTLOOKSTAG = "product_looks_tag/create"
export const SHOWPRODUCTLOOKSTAG = "product_looks_tag/show/"
export const UPDATEPRODUCTLOOKSTAG = "product_looks_tag/update/"
export const DELETEPRODUCTLOOKSTAG = "product_looks_tag/delete/"
export const UPDATEPRODUCTLOOKSTAGSTATUS = "product_looks_tag/change_status"
export const MOVEPRODUCTLOOKSTAG = "product_looks_tag/move"

export const GETMETALTYPE = "metal_type/list"
export const ADDMETALTYPE = "metal_type/create"
export const SHOWMETALTYPE = "metal_type/show/"
export const UPDATEMETALTYPE = "metal_type/update/"
export const DELETEMETALTYPE = "metal_type/delete/"
export const UPDATEMETALTYPESTATUS = "metal_type/change_status"
export const MOVEMETALTYPE = "metal_type/move"

export const GETFAQ = "faq/list"
export const ADDFAQ = "faq/create"
export const SHOWFAQ = "faq/show/"
export const UPDATEFAQ = "faq/update/"
export const DELETEFAQ = "faq/delete/"
export const DELETEALLFAQ = "faq/delete-all"
export const UPDATEFAQSTATUS = "faq/change_status"
export const MOVEFAQ = "faq/move"

export const GETWEBSITE = "website/active/list"
export const GETWEBSITEBYID = "website/website_list"

export const GETEVENT = "event/list"
export const ADDEVENT = "event/create"
export const SHOWEVENT = "event/show/"
export const UPDATEEVENT = "event/update/"
export const DELETEEVENT = "event/delete/"
export const DELETEALLEVENT = "event/delete-all"
export const UPDATEEVENTSTATUS = "event/change_status"
export const MOVEEVENT = "event/move"
export const DELETEDOCUMENT = "event/delete/doc/"
export const GETEVENTUSER = "event/interested_users/"

export const GETCOUPONS = "coupons/list"
export const ADDCOUPONS = "coupons/create"
export const SHOWCOUPONS = "coupons/show/"
export const UPDATECOUPONS = "coupons/update/"
export const DELETECOUPONS = "coupons/delete/"
export const DELETEALLCOUPONS = "coupons/delete-all"
export const UPDATECOUPONSSTATUS = "coupons/change_status"
export const MOVECOUPONS = "coupons/move"
export const COUPONTYPE = "coupons/type"


export const GETGROUPMASTER = "group_master/list"
export const ADDGROUPMASTER = "group_master/create"
export const SHOWGROUPMASTER = "group_master/show/"
export const UPDATEGROUPMASTER = "group_master/update/"
export const DELETEGROUPMASTER = "group_master/delete/"
export const DELETEALLGROUPMASTER = "group_master/delete-all"
export const UPDATEGROUPMASTERSTATUS = "group_master/change_status"
export const MOVEGROUPMASTER = "group_master/move"

export const GETSUBSCRIBEREQUEST = "subscribe_request/list"
export const SHOWSUBSCRIBEREQUEST = "subscribe_request/show/"
export const UPDATESUBSCRIBEREQUESTSTATUS = "subscribe_request/change_status"
export const REPLYSUBSCRIBEEMAIL = "subscribe_request/reply_email"

export const GETCONTACTUS = "contactUs/list"
export const SHOWCONTACTUS = "contactUs/show/"
export const DELETECONTACTUS = "contactUs/delete/"
export const DELETEALLCONTACTUS = "contactUs/delete-all"
export const REPLYCONTACTUSEMAIL = "contactUs/reply_email"
export const CONTACTUSCHANGESTATUS = "contactUs/change_status"

export const BOOKDEMO = "book-a-demo/list"
export const BOOKDEMO_EMAIL = "book-a-demo/reply_email"

export const GETBLOG = "blog/list"
export const ADDBLOG = "blog/create"
export const SHOWBLOG = "blog/show/"
export const UPDATEBLOG = "blog/update/"
export const DELETEBLOG = "blog/delete/"
export const UPDATEBLOGSTATUS = "blog/change_status"
export const MOVEBLOG = "blog/move"
export const DELETEBLOGDOCUMENT = "blog/delete/doc/"
export const BLOGTAGLIST = "blog/tag_list"

export const GETCMS = "content_page/list"
export const SHOWCMS = "content_page/show/"
export const UPDATECMS = "content_page/update/"
export const UPDATECMSSTATUS = "content_page/change_status"
export const ADDCMS = 'content_page/create';
export const DELETECMS = "content_page/delete/";

export const ADDTESTIMONIALS = "testimonials/create"
export const SHOWTESTIMONIALS = "testimonials/show/"
export const GETTESTIMONIALS = "testimonials/list"
export const UPDATETESTIMONIALS = "testimonials/update/"
export const UPDATETESTIMONIALSSTATUS = "testimonials/change_status"
export const DELETETESTIMONIALS = "testimonials/delete/"
export const DELETETESTIMONIALSDOC = "testimonials/delete/doc/"
export const MOVETESTIMONIALS = "testimonials/move"
export const DELETEALLTESTIMONIAL = "testimonials/delete-all"

export const SHOWSYSTEMEMAILS = "email_template/show/"
export const GETSYSTEMEMAILS = "email_template/list"
export const UPDATESYSTEMEMAILS = "email_template/update/"
export const UPDATESYSTEMEMAILSSTATUS = "email_template/change_status"

export const GET_CATALOGUE_TEMPLATE_LIST = "catalogue/template/list";
export const ADD_CATALOGUE_TEMPLATE = "catalogue/template/store";
export const SHOW_CATALOGUE_TEMPLATE = "catalogue/template/show";
export const UPDATE_CATALOGUE_TEMPLATE = "catalogue/template/update";
export const CHANGE_CATALOGUE_TEMPLATE_STATUS = "catalogue/template/change_status";
export const DELETE_CATALOGUE_TEMPLATE = "catalogue/template/delete/";

export const ADDRINGSIZE = "size/create"
export const SHOWRINGSIZE = "size/show/"
export const GETRINGSIZE = "size/list"
export const UPDATERINGSIZE = "size/update/"
export const UPDATERINGSIZESTATUS = "size/change_status"
export const DELETERINGSIZE = "size/delete/"
export const MOVERINGSIZE = "size/move"

export const GETCATEGORY = "category/list"
export const ADDCATEGORY = "category/create"
export const SHOWCATEGORY = "category/show/"
export const UPDATECATEGORYSTATUS = "category/change_status"
export const GETCATEGORYTYPEIMAGES = "category_type/show-images"
export const GETCATEGORYIMAGES = "category/show-images"
export const DELETECATEGORY = "category/delete/"
export const UPDATECATEGORY = "category/update/"
export const GETCUSTOMIZATION = "category/customisation_list"
export const GETFILTERLIST = "category/filter_seq_type"
export const FILTERSEQUENCELIST = "category/filter_sequence_list"
export const FILTERSEQUENCEADD = "category/filter_sequence"
export const FILTERDELETE = "category/delete_filter/"
export const DELETECATEGORYDOC = "category/delete/doc/"
export const MOVEFILTER = "category/move"
export const MOVECATEGORY = "category/category_move"
export const ACTIVE_CATEGORY = 'category/active/list'
export const ACTIVE_CATEGORY_ALL = 'category/active/list/all'
export const ACTIVE_CATEGORY_TYPE_ALL = 'category_type/active/list/all'
export const CATEGORY_CHILD = 'category/getchild'

export const GET_ACCOUNT_CATEGORIES = "category/show-account-categories"
export const CREATE_ACCOUNT_CATEGORY = "category/add-account-categories"
export const GET_APPLIED_CATEGORIES = "category/show-account-home-categories"
export const MOVE_CATEGORIES = "category/category_move"

export const GETCATEGORYTYPE = 'category_type/list'
export const CREATECATEGORYTYPE = 'category_type/create'
export const CATEGORYTYPE_DELETE = 'category_type/delete/'
export const CATEGORYTYPE_CHANGE_STATUS = 'category_type/change_status'
export const CATEGORY_TYPE_SHOW = 'category_type/show/'
export const CATEGORY_TYPE_UPDATE = 'category_type/update/'
export const CATEGORY_TYPE_ACTIVE = 'category_type/active/list'
export const CATEGORY_SYNC = "category/manual_sync";

export const GET_PDF_CONFIG_DEFAULT_DETAILS = "catalogue/default-details";
export const LOAD_PDF_CONFIG_PRODUCTS = "catalogue/load-products";
export const ACCOUNTWISE_CATEGORY_TYPE_LIST = "category/account-category-type-list";
export const ACCOUNTWISE_CATEGORY_LIST = "category/account-category-list";

export const GETSUBCATEGORY = 'category/list'
export const SUBCREATECATEGORY = 'category/create'
export const SUBCATEGORY_DELETE = 'category/delete/'
export const SUBCATEGORY_CHANGE_STATUS = 'category/change_status'
export const SUBCATEGORY_SHOW = 'category/show/'
export const SUBCATEGORY_UPDATE = 'category/update/'


export const TEMPLATE_LIST = 'page_templates/list'

export const ADDSOCIAL = "common_setting/social"
export const SHOWSOCIAL = "common_setting/show_social_details/"

export const ADDCONTACTUSCOMMON = "common_setting/contact_us"
export const SHOWCONTACTUSCOMMON = "common_setting/show_contact_us_details/"

export const GETCONTACTADDRESS = "account_address/list"
export const ADDCONTACTADDRESS = "contact_address/create"
export const SHOWCONTACTADDRESS = "contact_address/show/"
export const UPDATECONTACTADDRESS = "contact_address/update/"
export const DELETECONTACTADDRESS = "contact_address/delete/"
export const UPDATECONTACTADDRESSSTATUS = "contact_address/change_status"
export const MOVECONTACTADDRESS = "contact_address/move"

export const GETOURCLIENTS = "our_clients/list"
export const ADDOURCLIENTS = "our_clients/create"
export const SHOWOURCLIENTS = "our_clients/show/"
export const UPDATEOURCLIENTS = "our_clients/update/"
export const DELETEOURCLIENTS = "our_clients/delete/"
export const DELETEOURCLIENTDOC = "our_clients/delete/doc/"
export const MOVEOURCLIENTS = "our_clients/move"

export const GETOURBENEFITS = "common_setting/our_benefit"
export const SHOWOURBENEFITS = "common_setting/show_benefit/"
export const UPDATEOURBENEFITS = "common_setting/update_benefit/"
export const DELETEOURBENEFITSDOC = "our_benefits/delete/doc/"
export const MOVEOURBENEFITS = "common_setting/move_benefits"
export const ADDOURBENEFITS = "common_setting/create_our_benefit"

export const ADDDOWNLOADAPP = "common_setting/download_our_app"
export const SHOWDOWNLOADAPP = "common_setting/show_download_app_details/"
export const DELETEDOWNLOADAPPDOC = "common_setting/download_app_delete_doc/doc/"

export const GETCUSTOMIZEJEWELLERY = "common_setting/customize_jewellery"
export const SHOWCUSTOMIZEJEWELLERY = "common_setting/show_custom_jewellery/"
export const UPDATECUSTOMIZEJEWELLERY = "common_setting/update_customize_jewellery/"
export const DELETECUSTOMIZEJEWELLERYDOC = "common_setting/custom_jewelery_delete_doc/doc/"
export const MOVECUSTOMIZEJEWELLERY = "common_setting/custom_jewellery_move"
export const ADDCUSTOMIZEJEWELLERY = "common_setting/create_custom_jewellery"

export const GET_QUICK_LINKS_LIST = "common_setting/list"
export const CREATE_QUICK_LINK = "common_setting/create_quick_link"
export const UPDATE_QUICK_LINK = "common_setting/update_quick_link/"
export const SHOW_QUICK_LINK = "common_setting/show_quick_link/"
export const MOVE_QUICK_LINKS = "common_setting/quick_link_move"
export const DELETE_QUICK_LINK = "common_setting/quick_link_delete/"

export const GETDIGITALSTORE = "common_setting/digital_list"
export const SHOWDIGITALSTORE = "common_setting/show_digital_store_details/"
export const UPDATEDIGITALSTORE = "common_setting/update_digital/"
export const DELETEDIGITALSTOREDOC = "common_setting/digital_store_delete_doc/doc/"
export const MOVEDIGITALSTORE = "common_setting/move_digital"

export const ADDGENERALCONFIGURATION = "common_setting/general_conf_store"
export const SHOWGENERALCONFIGURATION = "common_setting/show_general_conf_details/"
export const DELETEGENERALCONFIGURATIONDOC = "common_setting/general_conf_delete_doc/doc/"

export const ADD_ABOUT_US_CONFIGURATION = "common_setting/about_us"
export const SHOW_ABOUT_US_CONFIGURATION = "common_setting/show_about_us/"

export const GETBANNER = "banner/list"
export const ADDBANNER = "banner/store"
export const SHOWBANNER = "banner/show/"
export const UPDATEBANNER = "banner/update/"
export const DELETEBANNER = "banner/delete/"
export const UPDATEBANNERSTATUS = "banner/change_status"
export const MOVEBANNER = "banner/move"
export const DELETEBANNERDOCUMENT = "banner/delete/doc/"
export const GETBANNERTYPE = 'banner/type'

export const GETUSERS = "user/list"
export const CREATEUSER = "user/create"
export const UPDATEUSER = "user/update/"
export const SHOWUSER = "user/show/"
export const DELETEUSER = "user/delete/"
export const UPDATEUSERSTATUS = "user/change_status"
export const VERIFYUSEREMAIL = "user/verify_email"
export const ACTIVE_ACCOUNT = "account/active/list"
export const ACTIVE_ROLE = "role/active_role"
export const GENDER = "gender/active/list"
export const ADMIN_APPROVE = "user/change/approval"
export const MOBILE_APPROVE = "user/change-mobile/approval"
export const ACCOUNT_DELETE_DOC = "account/delete/doc/"

export const ROLE_LIST = "role/list"
export const ROLE_CREATE = "role/create"
export const ROLE_UPDATE = "role/update/"
export const ROLE_SHOW = "role/show/"
export const ROLE_DELETE = "role/delete/"
export const ROLE_STATUS = "role/change_status"
export const PERMISSION_LIST = "permission/list/"
export const ASSIGN_PERMISSION = "permission/role_assign/"

export const ACCOUNT_LIST = "account/list"
export const ACCOUNT_CREATE = "account/basic/create"
export const LEGAN_BANK_INFO = "account/legal_bank_info/create"
export const ACCOUNT_STATUS = "account/change_status"
export const APPROVAL_CHANGE = "account/change-approval";
export const ACCOUNT_DELETE = "account/delete/"
export const ACCOUNT_SHOW = "account/show/"
export const GET_DESIGNATION = "account/designation_list"
export const GET_NATURE = "account/nature_of_organization_list"
export const GET_GROUP_MASTER = "group_master/active/list"
export const GET_COUNTRY = "country/get_all_country"
export const GET_ACTIVE_COUNTRY = "country_dropdown"
export const GET_STATE = "state/get_all_states"
export const GET_CITY = "city/get_all_city"
export const STATE_IMPORT = "state/import-excel"
export const CITY_IMPORT = "city/import-excel"

export const ACCOUNT_UPDATE = "account/basic/update/"
export const CHECK_WEBSITE_EXIST = "account/account_exist/"
export const ACCOUNT_DATA_EXPORT = "account/export-excel"
export const ACCOUNT_DATA_IMPORT = "account/import-excel"
export const ACCOUNT_ACTIVE_LIST = 'account/active/list'
export const ACCOUNT_SYNC = 'account/sync-product-price/'
export const ACCOUNT_SYNC_WITH_CALCULATE = "account/sync-ms-product-price/";
export const PRODUCT_SINGLE_SYNC = 'product/sync-single-product-price'
export const PRODUCT_IMAGE_SYNC = "import_product_img_vid_sync"


export const ADDRESS_CREATE = "account_address/create"
export const ADDRESS_LIST = "account_address/list"
export const ADDRESS_DELETE = "account_address/delete/"
export const ADDRESS_SHOW = "account_address/show/"
export const ADDRESS_UPDATE = "account_address/update/"


export const COUNTRY_LIST = "country/list"
export const COUNTRY_CREATE = "country/create"
export const COUNTRY_UPDATE = "country/update/"
export const COUNTRY_STATUS = "country/change_status"
export const COUNTRY_DELETE = "country/delete/"
export const COUNTRY_SHOW = "country/show/"
export const COUNTRY_EXPORT_EXCEL = "country/export-excel"
export const COUNTRY_LIST_ACTIVE = "country/active/list"

export const PROFILE_SHOW = "myProfile/show"
export const PROFILE_UPDATE = "myProfile/profileUpdate"
export const PROFILE_CHANGE_PASSWORD = "oauth/password/change"
export const REMOVE_PROFILE_DOC = "myProfile/delete/doc/"

export const COUNTRY_ACTIVE = "active/list"
export const ACTIVE_ACCOUNT_LIST = "account/account-list";
export const ACCOUNT_COUNTRY_LIST = "account/country/list";
export const SORT_ACCOUNT_COUNTRY_LIST = "account/country/sort"
export const CREATE_ACCOUNT_COUNTRY = "account/add-country"
export const ACTIVE_ACCOUNT_COUNTRY = "account-country"

export const STATE_LIST = "state/list"
export const STATE_ACTIVE_LIST = "state/get_all_states"
export const STATE_CREATE = "state/create"
export const STATE_UPDATE = "state/update/"
export const STATE_STATUS = "state/change_status"
export const STATE_DELETE = "state/delete/"
export const STATE_SHOW = "state/show/"
export const STATE_EXPORT_EXCEL = "state/export-excel"

export const CITY_LIST = "city/list"
export const CITY_ACTIVE_LIST = "city/get_all_city"
export const CITY_CREATE = "city/create"
export const CITY_UPDATE = "city/update/"
export const CITY_STATUS = "city/change_status"
export const CITY_DELETE = "city/delete/"
export const CITY_SHOW = "city/show/"
export const CITY_EXPORT_EXCEL = "city/export-excel"

export const SLUG_LIST = 'slug/list'
export const SLUG_CREATE = "slug/create"
export const SLUG_UPDATE = "slug/update/"
export const SLUG_STATUS = "slug/change_status"
export const SLUG_DELETE = "slug/delete/"
export const SLUG_SHOW = "slug/show/"
export const REMOVE_SLUG_DOC = "slug/delete/doc/"

export const TAX_RATE_LIST = "taxrate/list";
export const TAX_RATE_IMPORT_FILE = "taxrate/import-excel";
export const TAX_RATE_DETAILS = "taxrate/show";

export const HOME_PAGE_CREATE = "homeproduct/create";
export const HOME_PAGE_UPDATE = "homeproduct/update/";
export const HOME_PAGE_CONFIG_LIST = "homeproduct/list";
export const HOME_PAGE_CONFIG_DETAILS = "homeproduct/show/";
export const HOME_PAGE_CONFIG_DELETE = "homeproduct/delete/";
export const HOME_PAGE_ACTIVE_PRODUCTS = "homeproduct/productlist";

export const LOGIN_HISTORY_LIST = 'userloginlog/list'

export const PATIENT_LIST = "user/list";
export const PATIENT_ADD = "user/create";
export const PATIENT_DETAILS = "user/show";
export const PATIENT_LIST_CSV = "user/export-excel";
export const GET_DEFAULT_EXPIRY_DATE = "account/get-expiry-date";
export const ADD_PRESCRIBED_PRODUCT = "prescription/product-add";
export const READ_PRESCRIBED_PRODUCT_PDF = "prescription/read-pdf";
export const SEARCH_PRESCRIBED_PRODUCTS = "prescription/product-list";
export const DELETE_PRESCRIBED_PRODUCT = "prescription/product-delete/";
export const GET_PRESCRIBED_PRODUCT_FROM_SCAN = "prescription/scan-product";
export const PRESCRIBED_PRODUCT_LIST = "prescription/patient-prescribed-list";
export const PRESCRIBE_MULTIPLE_PRODUCTS = "prescription/product-add-multiple";

export const ORDER_LIST = "order/list";
export const ORDER_SHOW = "order/show";
export const GET_ORDER_SUMMARY = "order/summary";
export const ORDER_LIST_CSV = "order/excel-export";
export const ORDER_SYNC = "order/sync-order-with-sap";
export const GET_ORDER_PRODUCTS = "order/get-product";
export const GET_ORDER_PATIENTS = "order/get-patients";
export const PLACE_PATIENT_ORDER = "order/place-order";
export const GET_ORDER_SHIPING_RATE = "order/shipping-rate";
export const GET_ORDER_SHIP_ADDRESS = "order/get-user-address";
export const GET_ORDER_SHIP_METHODS = "order/shipping-methods";

export const TRANSACTION_LIST = "order/transaction-list";
export const TRANSACTION_LIST_CSV = "order/export-transaction-report";
export const TRANSACTION_STATUS_CHANGE = "order/change-hcp-payment-status";

export const COMMISSION_REPORT_LIST = "order/commission-report";
export const COMMISSION_REPORT_DOWNLOAD = "order/export-commission-report";

export const CAREER_APPLICATION_LIST = "career_application/list"
export const CAREER_APPLICATION_MAIL = "career_application/reply_email"
export const SHOW_CAREER_APPLICATION = "career_application/show/"

export const POPUP_LIST = "popup/list"
export const POPUP_CREATE = "popup/create"
export const POPUP_UPDATE = "popup/update/"
export const POPUP_STATUS = "popup/change_status"
export const POPUP_DELETE = "popup/delete/"
export const POPUP_SHOW = "popup/show/"
export const POPUP_FIELD = "popup/form_field"
export const SLUG = "popup/slug_list/"

export const PRODUCT_LIST = "product/list"
export const PRODUCT_CREATE = "product/create"
export const PRODUCT_UPDATE = "product/update/"
export const PRODUCT_STATUS = "product/change_status"
export const PRODUCT_DELETE = "product/delete/"
export const PRODUCT_SHOW = "product/show/"
export const PRODUCT_SIZE = "product/get_size"
export const PRODUCT_PAIRED = "product/paired_products"
export const PRODUCT_EXPORT_EXCEL = "product/export-excel"
export const PRODUCT_IMPORT_EXCEL = "product/import-excel"
export const UPDATE_DUPLICATE_EXCEL = "product/update-duplicate-excel-data"

export const MASTER_PRODUCT_LIST = "product-master/list";
export const SHOW_MASTER_PRODUCT_DETAILS = "product-master/show";
export const PRODUCT_MAGENTO_SYNC = "magento/product-sync";
export const MASTER_PRODUCT_STATUS_CHANGE = "product-master/change_status";
export const MASTER_PRODUCT_PRESCRIPTION_STATUS_CHANGE = "product-master/change-prescription";

export const PLAN_LIST = "subscription_plan/list"
export const PLAN_CREATE = "subscription_plan/create"
export const PLAN_UPDATE = "subscription_plan/update/"
export const PLAN_DELETE = "subscription_plan/delete/"
export const PLAN_SHOW = "subscription_plan/show/"
export const PLAN_STATUS_CHANGE = "subscription_plan/change_status/"
export const PLAN_DELETE_DOC = "subscription_plan/delete/doc/"
export const PLAN_MOVE = "subscription_plan/move"

export const LABOUR_CHARGE_ACTIVE = "labour_charged/active/list"
export const LABOUR_CHARGE_LIST = "labour_charged/labour-charge-list"
export const OCCASION_ACTIVE = "occasion/active/list"
export const SIZE_ACTIVE = "size/active/list"
export const SHOP_ACTIVE = "shop/active/list"
export const METAL_TYPE = "metal_type/active/list"
export const METAL_PURITY = "metal_purity/active/list"
export const DIAMOND_SHAPE = "diamond_shape/active/list"
export const DIAMOND_COLOR = "diamond_color/active/list"
export const COLOR_STONE_COLOR = "color_stone/active/list"
export const DIAMOND_QUALITY = "diamond_quality/active/list"
export const DIAMOND_SIEVES = "diamond_sieves/active/list"
export const PRODUCT_ACTIVE = "product/active/list"
export const WEAR_ACTIVE = 'product_wear_tag/active/list'
export const LOOK_ACTIVE = 'product_looks_tag/active/list'


export const POPUP_ENQUIRY_LIST = "popup_enquiry/list"
export const POPUP_ENQUIRY_EMAIL = "popup_enquiry/reply_email"

export const SUBSCRIPTION_HISTORY_LIST = "subscription_history/list"
export const SUBSCRIPTION_HISTORY_SHOW = "subscription_history/show"
export const ACTIVE_PLAN_LIST = "subscription_plan/active/list"
export const CREATE_SUBSCRIPTION_HISTORY = "account/add-subscription"
export const SAVE_EXPIRY_DATE = "account/update-date"

export const FILTER_SEQUENCE_TYPE = 'category/filter_seq_type'
export const FILTER_SEQUENCE_ADD = "category/add_filter_sequence"
export const DELETE_FILTER = 'category/delete_filter/'
export const FILTER_SEQUENCE_LIST = "category/filter_sequence_list"
export const GET_CATEGORY_HIERARCHY = "category/type-category-list"
export const GET_USER_CATEGORY_DATA = "category/show-account-category/"
export const STORE_USER_CATEGORY_DATA = "category/store-accountvise-category"
export const CATEGORY_CHANGE_STATUS = "category/change_ms_status"

export const FILTER_SEQUENCE_ADD_TYPE = "category_type/add_filter_sequence"
export const DELETE_FILTER_TYPE = 'category_type/delete_filter/'
export const FILTER_SEQUENCE_LIST_TYPE = "category_type/filter_sequence_list"
export const CATEGORY_TYPEC_CHANGE_STATUS = "category_type/change_ms_status"

export const MICROSITE_FOOTER_SHOW = "microsite_footer/show/"
export const MICROSITE_FOOTER_UPDATE = "microsite_footer/update/"
export const FOOTER_SHOW = 'footer/show/';
export const FOOTER_STORE = 'footer/footer_store';

export const PRODUCT_CONFIGRATION = 'product_configuration/product_configuration_store'
export const SHOW_PRODUCT_CONFIGRATION_DETAILS = 'product_configuration/show_product_configuration'
export const INTEGRATED_SCRIPT = 'common_setting/integrated_script'
export const PAYMENT_INTEGRATION = 'common_setting/integrated_payment'
export const SMS_INTEGRATION_SCRIPT = 'common_setting/integrated_sms'
export const SHOW_PRODUCT_CONFIGRATION = 'common_setting/show_product_configuration_details/'
export const SHOW_INTEGRATED_SCRIPT = 'common_setting/show_integrated_script_details/'
export const SHOW_PAYMENT_INTEGRATION = 'common_setting/show_integrated_payment_details/'
export const SHOW_SMS_INTEGRATION_SCRIPT = 'common_setting/show_integrated_sms_details/'

export const RATE_CARD_LIST = "rate_card/list"
export const RATE_CARD_CREATE = "rate_card/create"
export const RATE_CARD_SHOW = "rate_card/show/"
export const RATE_CARD_UDATE = "rate_card/update/"
export const RATE_CARD_PRICE = "rate_card/price/"
export const RATE_CARD_EXPORT = "rate_card/sample-excel"
export const RATE_CARD_STATUS = "rate_card/change_status"
export const GET_METAL_PRICE = "metal_api/get-metal-price"
export const GET_METAL_TYPE = "metal_api/metal-type"
export const GET_ALL_METAL_PRICE_TYPE = "metal_price_type/active/list/all"
export const GET_ACTIVE_METAL_PRICE_TYPE = "metal_price_type/active/list"

export const ADD_PRODUCT_GROUP = "catalogue/create"
export const PRODUCT_GROUP_LIST = "catalogue/list"
export const UPDATE_PRODUCT_GROUP = "catalogue/update/"
export const PRODUCT_GROUP_CHANGE_STATUS = "catalogue/change_status"
export const PRODUCT_GROUP_SHOW = "catalogue/show/"
export const DELETE_PRODUCT_GROUP = 'catalogue/delete/'
export const LOAD_PRODUCT = "catalogue/loadproduct"
export const LOAD_PRODUCT_ID = "catalogue/loadproduct/"
export const DOWNLOAD_PRODUCT_FILE = "catalogue/sample-excel"
export const GET_CATALOGUE_LIST = "catalogue/active/list";

export const PRODUCT_IMPORT_HISTORY_LIST = "product_import_history/list"
export const PRODUCT_IMPORT_HISTORY_DETAILS = "product_import_history/show/"

export const PRODUCT_SYNC_HISTORY_LIST = "product_sync_history/list"

export const WISHLIST = "wishlist/list"
export const WISHLIST_PRODUCT = "wishlist/wishlist_user_product/"
export const EXPORT_WISHLIST = "wishlist/export-excel-wishlist"

export const CARTLIST = "cart/list"
export const CARTLIST_PRODUCT = "cart/cart_user_product/"
export const EXPORT_CART = "cart/export-excel-cart"

export const NUMBER_GENERATOR_ADD = "number_generate/create"
export const NUMBER_GENERATOR_LIST = "number_generate/list"
export const NUMBER_GENERATOR_UPDATE = "number_generate/update/"
export const NUMBER_GENERATOR_CHANGE_STATUS = "number_generate/change_status"
export const NUMBER_GENERATOR_SHOW = "number_generate/show/"
export const NUMBER_GENERATOR_DELETE = 'number_generate/delete/'
export const NUMBER_GENERATOR_DELETEALL = "number_generate/delete-all"
export const NUMBER_GENERATOR_TYPE_LIST = "number_generate/type_list"

export const CATALOGUE_LIST = "catalogue/list"
export const CATALOGUE_CREATE = "catalogue/add-catalogue"
export const CATALOGUE_UPDATE = "catalogue/update/"
export const CATALOGUE_STATUS = "catalogue/change_status"
export const CATALOGUE_DELETE = "catalogue/delete/"
export const CATALOGUE_SHOW = "catalogue/show/"
export const CATALOGUE_JEWELLERY = "catalogue/jewelleryList/"
export const CATALOGUE_ACCOUNT = "catalogue/accountList/"
export const CATALOGUE_PRODUCT = "product/product_list"
export const CATALOGUE_DELETE_DOC = "catalogue/delete/doc/"
export const GET_CATALOG_FILTER_BY_ID = 'catalogue/show_filter_list'
export const DELETE_CATALOG_FILTER = 'catalogue/delete_filter/'
export const UPDATE_CATALOG_FILTER_DATA = 'catalogue/update_filter/'
export const CATALOG_FILTER_CREATE = 'catalogue/add_filter'
export const GET_CATALOG_FILTER_DRP_DATA = 'catalogue/get_filter_list'
export const GET_CATALOGUE_PDF_URL = "catalogue/get-pdf";
export const SYNC_CATALOGUE_PRODUCTS = "product/sync-single-product-price";

export const PINCODE_LIST = "pincode/list"
export const PINCODE_UPDATE = "pincode/update/"
export const PINCODE_SHOW = "pincode/show/"
export const PINCODE_CHANGE_STATUS = "pincode/change_status"
export const PINCODE_IMPORT_EXCEL = "pincode/import-excel"
export const PINCODE_EXPORT_EXCEL = "pincode/export-excel"
export const PINCODE_DELETE = 'pincode/delete/'
export const PINCODE_DELETEALL = "pincode/delete-all"
export const PINCODE_TYPE_LIST = "pincode/type_list"
export const PINCODE_TRY_AT_HOME = "pincode/change_status_tryathome"
export const PINCODE_COD = "pincode/change_status_cod"

export const CAREEAR_LIST = "career/list"
export const CAREEAR_CREATE = "career/create"
export const CAREEAR_UPDATE = "career/update/"
export const CAREEAR_DELETE = "career/delete/"
export const CAREEAR_SHOW = "career/show/"
export const CAREEAR_STATUS_CHANGE = "career/change_status/"

export const CKEDIOTR_IMAGE_UPLOAD = "upload_image"
export const CUSTOMIZE_PRODUCT_LIST = "customize_product_enquiries/list"
export const CUSTOMIZE_PRODUCT_SHOW = "customize_product_enquiries/show/"
export const CUSTOMIZE_METAL_TYPE = "customize_product_enquiries/get_all_metalType"
export const CUSTOMIZE_METAL_PURITY = "customize_product_enquiries/get_all_metalPurity"
export const CUSTOMIZE_COLOR_PURITY = "customize_product_enquiries/get_color_purity"
export const CUSTOMIZE_TYPE_LIST = "customize_product_enquiries/type_list"


export const CUSTOMIZE_DESIGN_LIST = "customize_design/list"
export const CUSTOMIZE_DESIGN_SHOW = "customize_design/show_custom_Design/"
export const CUSTOMIZE_DESIGN_UPDATE = "customize_design/update_customize_Design/"
export const CUSTOMIZE_DESIGN_CREATE = "customize_design/create"
export const CUSTOMIZE_DESIGN_DELETE_DOC = "customize_design/custom_Design_delete_doc/doc/"

export const OWNER_MESSAGES_LIST = 'owner_message/list'
export const UPDATE_OWENER_MESSAGE = 'owner_message/update/'
export const ADD_OWNER_MESSAGE = 'owner_message/create'
export const OWNER_MESSAGE_SHOW = 'owner_message/show/'
export const OWNER_MESSAFE_CHANGE_STATUS = 'owner_message/change_status'
export const OWNER_MESSAGES_DELETE = 'owner_message/delete/'
export const OWNER_MESSAGES_DELETE_DOC = 'about_us/delete/doc/'

export const SHOW_ABOUT_US_DETAILS = 'about_us/show_aboutus_details/'
export const ABOUT_US_STORE = 'about_us/store'
export const ABOUT_US_DELETE_DOC = 'about_us/delete/doc/'

export const GET_ORDER_HISTORY = "report/order-history"
export const GET_ORDER_HISTORY_EXPORT_URL = "report/order-history-excel"

export const GET_COLLECTION_HISTORY = "most_view_collections/collection_list"
export const GET_COLLECTION_PRODUCTS = "most_view_collections/collection_product"
export const GET_COLLECTION_HISTORY_EXPORT_URL = "most_view_collections/export-excel-collection"

export const GET_PRODUCT_HISTORY = "most_view_product/product_list"
export const GET_PRODUCT_HISTORY_DETAILS = "most_view_product/user_product"
export const GET_PRODUCT_HISTORY_EXPORT_URL = "most_view_product/export-excel-product"

export const GET_CATEGORY_TYPE_HISTORY = "most_view_category_type/category_type_list"
export const GET_CATEGORY_TYPE_DETAILS = "most_view_category_type/user_category_type"
export const GET_CATEGORY_TYPE_HISTORY_EXPORT_URL = "most_view_category_type/export-excel-categoryType"

export const GET_CATEGORY_HISTORY = "most_view_category/category_list"
export const GET_CATEGORY_DETAILS = "most_view_category/user_category"
export const GET_CATEGORY_HISTORY_EXPORT_URL = "most_view_category/export-excel-category"

export const GET_MICROSITE_HISTORY = "microsite_user_report/user_login_list";
export const GET_MICROSITE_HISTORY_EXPORT_URL = "microsite_user_report/export-excel-user";
export const GET_MICROSITE_ORDER_DETAILS = "microsite_user_report/user_order";

export const GET_TODAY_RATES = "common_setting/metalrate-show";
export const STORE_TODAY_RATES = "common_setting/metalrate-store";

export const GET_SMS_HISTORY = "sms_report/sms_report_list";
export const GET_SMS_HISTORY_EXPORT_URL = "sms_report/export-excel-sms";

export const GET_EMAIL_HISTORY = "email_report/email_report_list";
export const GET_EMAIL_TEMPLATE = "email_report/email_show";
export const GET_EMAIL_HISTORY_EXPORT_URL = "email_report/export-excel-email";

export const GET_ENQUIRY_HISTORY = "enquiry_reports/enquiry_list";
export const GET_ENQUIRY_HISTORY_DETAILS = "enquiry_reports/user_enquiry";
export const GET_ENQUIRY_HISTORY_EXPORT_URL = "enquiry_reports/export-excel-enquiry"

export const GET_BOOK_DEMO_REPORTS = "book_demo_report/book_demo_report_list";
export const GET_BOOK_DEMO_HISTORY_REPORTS = "book_demo_report/book_demo_show";
export const GET_BOOK_DEMO_HISTORY_EXPORT_URL = "book_demo_report/export_excel_book_demo";

export const GET_SUBSCRIPTION_TRANSACTIONS = "report/subscription-transactions"
export const GET_SUBSCRIPTION_TRANSACTIONS_EXPORT_URL = "report/subscri-transaction-excel"
export const GET_ORDER_TRANSACTIONS = "report/order-transaction"
export const GET_ORDER_TRANSACTIONS_EXPORT_URL = "report/order-transaction-excel"

export const MODULE_LIST = 'module/list'
export const MASTER_LIST_STATUS = 'module/change_master_status'
export const CATEGORY_LIST_STATUS = 'module/change_category_status'
export const COLLECTION_LIST_STATUS = 'module/change_collection_status'
export const SYNC_COLLECTION_STYLE = "product/sync-collection-style"
export const CATALOGUE_LIST_STATUS = 'module/change_catalogue_status'
export const CODE_LIST_STATUS = 'module/code_status'
export const GET_COLLECTION_LIST = 'collection/list'
export const GET_COLLECTION_ACTIVE_LIST = 'collection/active/list'
export const UPDATE_COLLECTION_STATUS = 'collection/change_status'
export const DELETE_COLLECTION = 'collection/delete/'
export const CREATE_COLLECTION = 'collection/create'
export const UPDATE_COLLECTION = 'collection/update/'
export const GET_COLLECTION_BY_ID = 'collection/show/'
export const GET_COLLECTION_FILTER_DRP_DATA = 'collection/get_filter_list'
export const COLLECTION_FILTER_CREATE = 'collection/add_filter'
export const GET_COLLECTION_FILTER_BY_ID = 'collection/show_filter_list'
export const UPDATE_COLLECTION_FILTER_DATA = 'collection/update_filter/'
export const DELETE_COLLECTION_FILTER = 'collection/delete_filter/'

export const GET_STYLE_LIST = 'style/list'
export const GET_STYLE_ACTIVE_LIST = 'style/active/list'
export const UPDATE_STYLE_STATUS = 'style/change_status'
export const GET_STYLE_BY_ID = 'style/show/'
export const UPDATE_STYLE = 'style/update/'
export const CREATE_STYLE = 'style/create'
export const DELETE_STYLE = 'style/delete/'

export const HCP_INQUIRY_CREATE = "hcp_enquiry/create";
export const HCP_INQUIRY_SHOW = "hcp_enquiry/show";
export const HCP_INQUIRY_LIST = "hcp_enquiry/list";
export const HCP_INQUIRY_DELETE = "hcp_enquiry/delete/";
export const HCP_INQUIRY_REPLY_EMAIL = "hcp_enquiry/reply_email";

export const GET_DEFAULT_FOOTER = 'default_footer/list'

export const COMMON_SETTING_CREATE = 'setting/create'
export const COMMON_SETTING_SHOW = 'setting/show'

export const SHIPPING_RATE_LIST = "shippingtype/list";
export const GET_SHIPPING_RATE_DETAILS = "shippingtype/show/";
export const ADD_SHIPPING_RATE = "shippingtype/create";
export const UPDATE_SHIPPING_RATE = "shippingtype/update/";
export const DELETE_SHIPPING_RATE = "shippingtype/delete/";
export const CHANGE_SHIPPING_RATE_STATUS = "shippingtype/changestatus";
export const IMPORT_SHIPPING_RATES = "shippingrate/import-excel";
export const IMPORT_SHIPPING_ZONES = "shippingzone/import-excel";
export const GET_SHIPPING_RATES = "shippingrate/list";
export const SHIPPING_ZONE_LIST = "shippingzone/list";

export const CREATE_REFER_EARN = 'refer_and_earn/store'
export const SHOW_REFER_EARN = 'refer_and_earn/show_refer_earn/'

export const CHANGE_DEFAULT_CONTACT = "contact_address/change_default";

export const ADMIN_USER_DATA_EXPORT = 'user/exportadmin-excel'
export const B2B_USER_DATA_EXPORT = 'user/exportb2b-excel'
export const USER_DATA_IMPORT = 'user/import-excel'
export const MICROSITE_USER_DATA_EXPORT = 'user/exportmicro-admin-excel'
export const B2B2C_USER_DATA_EXPORT = 'user/exportb2b2c-excel'
export const GENDER_LIST = "gender/active/list";

export const ORDER_COUNT = 'order/count'
export const ORDER_ADV_PAY_ORDER = 'order/adv-pay-order'
export const ORDER_ADV_PAY_FAIL_ORDER = 'order/adv-pay-fail-order'
export const ORDER_RECIEVED_ORDER = 'order/full-pay-receive-order'
export const ORDER_CONFIRM_ORDER = 'order/confirm-order'
export const ORDER_TRANSIT_ORDER = 'order/transit-order'
export const ORDER_DELIVERED_ORDER = 'order/delivered-order'
export const ORDER_CANCEL_ORDER = 'order/cancel-order'
export const ORDER_ID = 'order/order-detail/'
export const ORDER_STATUS_TRACK = 'order/order-status-track/'
export const ORDER_ITEM_STATUS_TRACK = 'order/order-item-status-track/'
export const ORDER_STATUS_DATA = 'order/order-setting-data'
export const DELETE_ORDER = 'order/deleted-order-list'

export const ORDER_DETAILS = 'order/order-detail/'
export const ORDER_DELETE = 'order/order-delete/'
export const ORDER_STATUS = 'order/change-order-status'
export const ORDER_PAYMENT = 'order/check-payment/'
export const ORDER_CHANGE_STATUS = 'order/change-order-item-status'


export const EXPORT_ORDER_ADV_PAY_ORDER = 'order/export-to-advance-pay-pending-excel'
export const EXPORT_ORDER_ADV_PAY_FAIL_ORDER = 'order/export-to-advance-pay-failed-excel'
export const EXPORT_ORDER_RECIEVED_ORDER = 'order/export-to-received-excel'
export const EXPORT_ORDER_CONFIRM_ORDER = 'order/export-to-confirm-excel'
export const EXPORT_ORDER_TRANSIT_ORDER = 'order/export-to-transit-excel'
export const EXPORT_ORDER_DELIVERED_ORDER = 'order/export-to-delivered-excel'
export const EXPORT_ORDER_CANCEL_ORDER = 'order/export-to-cancel-excel'

export const POPULAR_SEARCH_BY_ID = 'popular_search/show/'
export const POPULAR_SEARCH_CREATE = 'popular_search/create'

export const GET_CUSTOMER = 'order/get-customer'
export const GET_PRODUCT = 'order/get-product'
export const GET_PRODUCT_DETAILS = 'order/get-product-detail'

export const GET_SHIPPING_CHARGE = 'order/get-shipping-charge'
export const PRICE_BREAKUP = 'order/price-breakup'
export const GET_QUOTATION = 'order/get-quotation'
export const QUOTATION_PDF = 'order/quotation-pdf'
export const CREATE_ORDER = 'order/place-order';
export const COUPON_LIST = 'order/coupon-list';
export const APPLY_COUPON = 'order/apply-coupon';
export const GIFT_CHARGE = 'order/gift-wrap-apply';
export const COUNTRY_DROPDOWN_LIST = 'order/country_dropdown';
export const GET_USER_ADDRESS = 'order/get-user-address';
export const ADD_USER_ADDRESS = 'order/add-user-address';
export const UPDATE_USER_ADDRESS = 'order/update-user-address';
export const CHECK_DELIVERY_BY_PINCODE = 'pincode/check_delivery_by_pincode';

export const CREATE_PAGE = 'default_page/create';
export const PAGE_LIST = "default_page/list";
export const CHANGE_PAGE_STATUS = 'default_page/change_status';
export const SHOW_PAGE = 'default_page/show/';
export const UPDATE_PAGE = 'default_page/update';
export const DEFAULT_PAGES = 'default_page/active/list';
export const DEFAULT_COMPONENTS = 'default_page/active-component/';
export const DELETE_MULTIPLE_TEMPLATES = 'default_page/delete/doc';
export const CHANGE_COMPULSORY_PAGE_STATUS = 'default_page/compulsory_page_status_change';
export const CHECK_DELETE_SECTION_POSSIBLE = 'default_page/delete_check/';
export const CHECK_DELETE_TEMPLATE_IMG_POSSIBLE = 'default_component_template/delete_template_check/';

export const CREATE_TEMPLATE = 'default_template/create';
export const UPDATE_TEMPLATE = 'default_template/update';
export const DEFAULT_TEMPLATE_LIST = 'default_template/list';
export const CHANGE_STATUS = 'default_template/change_status';
export const SHOW_TEMPLATE = 'default_template/show/';
export const DELETE_TEMPLATE = 'default_template/delete/';

export const EDITOR_UPLOAD_IMG = BASE_URL + 'upload_image';
export const EDITOR_DELETE_IMG = BASE_URL + 'delete_image';
export const GET_CONFIG_ACTIVE_DATA = "website_configuration/activeData";
export const GET_ACTIVE_DEFAULT_TEMPLATES = "website_configuration/activeDefaultTemplate";
export const GET_ALL_WEBSITE_SETTINGS = "website_configuration/allActiveList";
export const CREATE_MICROSITE = "website_configuration/create";
export const SHOW_MICROSITE = "website_configuration/show";
export const GET_DEFAULT_FONTS = "website_configuration/get-fonts";
export const DELETE_LOADER_IMAGE = "website_configuration/delete/doc/";

export const CREATE_PAYMENT_GATEWAY = "payment_gateway/create";
export const PAYMENT_GATEWAY_LIST = "payment_gateway/list";
export const CHANGE_PAYMENT_GATEWAY_STATUS = "payment_gateway/change_status";
export const DELETE_PAYMENT_GATEWAY = "payment_gateway/delete/";
export const SHOW_PAYMENT_GATEWAY = "payment_gateway/show/";
export const UPDATE_PAYMENT_GATEWAY = "payment_gateway/update";
export const ACTIVE_PAYMENT_GATEWAY_LIST = "payment_gateway/active/list";
export const SEND_PAYMENT_OTP = "send-otp";
export const VERIFY_PAYMENT_OTP = "validate-otp-code";

export const SHOW_TITLE_VALUES = "common_setting/show-home-config";
export const SAVE_TITLE_VALUES = "common_setting/home-config";

export const ADD_SUB_ADMIN = "hcp_admin/add";
export const SUB_ADMIN_LIST = "hcp_admin/list";
export const EDIT_SUB_ADMIN = "hcp_admin/show";
export const UPDATE_SUB_ADMIN = "hcp_admin/update";
export const DELETE_SUB_ADMIN = "hcp_admin/delete/";
export const SUB_ADMIN_STATUS_CHANGE = "hcp_admin/changestatus";

export const ADDRESS_BOOK_CREATE = "user-address-book/create"
export const ADDRESS_BOOK_UPDATE = "user-address-book/update/"
export const ADDRESS_BOOK_DELETE = "user-address-book/delete/"
export const ADDRESS_BOOK_DEFAULT = "user-address-book/change-default/"

export const HCP_ADDRESS_TRAIL="trails_order/get-address"
export const TRAIL_ORDER_PRODUCTS="trails_order/products"
export const TRAIL_ORDER_SUMMARY="trails_order/order_summary"
export const TRAIL_ORDER_PLACE="trails_order/place_order"
export const TRAIL_ORDERS_LIST="trails_order/list"
export const TRAIL_ORDER_VIEW="trails_order/view"
export const TRAILS_ORDER_CSV="trails_order/export-orders"
export const TRAIL_ORDER_SYNC="trails_order/sync-with-sap"
export const DELETE_PRODUCT="catalogue/delete/"
export const CREATE_TRAIL_ORDERS_ADRESS="account_address/create"
export const TRAIL_ORDERS_ADRESS_LIST="account_address/list"
export const CHANGE_MULTIPLE_PRODUCTS_STATUS="product/change_multiple_product_status";
export const CHANGE_MULTIPLE_CATEGORY_STATUS="category/change_multiple_cateogry_status";
export const HCP_ADDRESS_LIST="account_address/list";
export const  HCP_ADDRESS_UPDATE="account_address/update/";
export const HCP_ADDRESS_DELETE="account_address/delete/";
export const RECOMMENDED_PRODUCT_LIST="recommended/patient-recommended-list";
export const SEARCH_RECOMMENDED_PRODUCTS="recommended/product-list";
export const ADD_RECOMMENDED_PRODUCTS="recommended/product-add";
export const DELETE_RECOMMENDED_PRODUCTS="recommended/product-delete/";
export const CANCEL_ORDER= "order/cancel-order";
export const TRAIL_ORDER_CANCEL="trails_order/cancel-order";
