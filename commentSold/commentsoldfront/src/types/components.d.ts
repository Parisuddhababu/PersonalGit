import { FieldErrors } from "react-hook-form"
import { GoLiveScheduleStep3Form, GoLiveScheduleStep1Form, GoLiveStep1Form, GoLiveStep2Form, GoLiveStep3Form, GoliveStep4Form, IStep, Product } from "./pages"

export type BreadCrumbsProps = {
    item: {
        slug: string
        title: string
        isClickable?: boolean
    }[]
}

interface IFieldError {
    message: string;
  }
  
interface IFieldErrors {
  [key: string]: IFieldError | undefined;
}

export type IFormValidationErrorProps = {
    errors: IFieldErrors | FieldErrors;
    name: string;
}

export type IloaderProps = {
    loadingState: boolean
}


export type ICustomImageProps = {
    src: string;
    width: string;
    height: string;
    alt?: string;
    title?: string;
    className?: string;
    pictureClassName?: string;
    key?: string | number;
    sourceClassName?: string;
    imgClassName?: string;
}

export type IDeletePopupProps = {
    onClose: () => void;
    isDelete: (_data: boolean) => void;
    message: string;
    isShow: boolean;
    title?: string
}


export interface IAddCatalog {
    onClose: () => void;
    refetchData: () => void;
    editMode?: boolean;
    idOfProduct: string;
    modal: boolean;
    setProductLoader: (_state: boolean) => void;
}
export interface IViewScheduleStreaming {
    onClose: () => void;
    SingleScheduleId: string;
    model: boolean
}
export interface AddInfluencerProps {
    onClose: () => void;
    refetchData: () => void;
    editMode?: boolean;
    idOfInfluencer: string;
    modal: boolean
}

export interface IAddEditCatalogForm {
    name?: string;
    url: string;
    description: string;
    sku: string;
    images: string;
    color: string;
    size: string;
    price: string;
}

export interface IAddEditInfluencerForm {
    firstName: string,
    lastName: string,
    email: string,
    gender: number | string,
    countryCodeId: string,
    phoneNo: string
    first_name?: string
    last_name?: string
    phone_number?: string
}

export type AgoraManagerTypes = {
    config: configType; children?: React.ReactNode
    productId: string
    product?: Product,
    coHostProduct?: Product,
    start_time?: string
    end_time?: string
    live_video_id?: string
    broadcastId?: string
    scheduledId?: string
}

export interface BrandUserForm {
    brandName: string,
    companyName: string,
    brandEmail: string,
    sessionCount: null | number,
    influencerCount: null | number,
    requestStatus: null | string,
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCodeId: string;
}

export interface IChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type GoLiveSteps = {
    active: boolean
    completed?: boolean
    hidPrev?: boolean | 0
}

export interface GoLiveStep1 extends GoLiveSteps {
    onSubmitStep1: (_values: GoLiveStep1Form) => void;
    accordionHandle: (_step: IStep) => void;
}

export interface GoLiveStep2 extends GoLiveSteps {
    onSubmitStep2: (_values: GoLiveStep2Form, _product?: Product) => void
    onPrev: () => void;
    hidePrev?: boolean;
    accordionHandle: (_step: IStep) => void;
}

export interface GoLiveStep3 extends GoLiveSteps {
    onSubmitStep3: (_values: GoLiveStep3Form) => void
    onPrev: () => void
    hidePrev?: boolean;
    accordionHandle: (_step: IStep) => void;
}

export interface GoLiveStep4 extends GoLiveSteps {
    onSubmitStep4: (_values: GoliveStep4Form) => void
    onPrev: () => void
    isHost: boolean;
    isInsta?: boolean;
    accordionHandle: (_step: IStep) => void;
}

export interface IMyProfile {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneNo: string;
    keyWords: string
    countryCodeId: string;
}
export interface InstagramLoginForm {
    username?: string
    password?: string
    streaming_key?: string,
    streaming_url?: string
}
export interface InstaLoginProps {
    open: boolean
    onClose: () => void
    onSubmit: () => void
}

export interface ICsvPopupProps {
    open: boolean
    onClose: () => void
    data: IProductRejected[]
}


export type HostingType = 'single' | 'multi'

export interface GoLiveScheduleStep3 extends GoLiveSteps {
    onSubmitStep4: (_values: GoLiveScheduleStep3Form | undefined, _type: HostingType) => void
    onSubmitBrand: (_values: IInfluencers[]) => void
    onPrev: () => void
    accordionHandle: (_step: IStep) => void;
    selfEmail: string
    isBrand?: boolean
}


export interface GoLiveScheduleStep1 extends GoLiveSteps {
    onSubmitStep1: (_values: GoLiveScheduleStep1Form) => void;
    accordionHandle?: (_step: IStep) => void;
}


export interface IUploadCSV {
    open: boolean;
    onClose: () => void;
}


interface IProductErrorDetail {
    message: string;
    path: string[];
    type: string;
    context: {
        label: string;
        value: string;
        key: string;
    };
}

interface IProductError {
    _original: {
        name: string;
        url: string;
        sku: string;
        description: string;
        color: string;
        size: string;
        price: string;
        images: string;
    };
    details: IProductErrorDetail[];
}


export interface IProductRejected {
    status: string;
    reason: {
        data: {
            name: string;
            url: string;
            sku: string;
            description: string;
            color: string;
            size: string;
            price: string;
            images: string;
        };
        error: IProductError;
    };
}
export interface ContactUsForm {
    email: string,
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCodeId: string;
    message: string;
}

export type FbInstaComment = {
    comment_id: string
    comments: string
    user_social_name: string
    comments_platform: string
    created_at: string
    is_keyword: boolean
    is_other_post_comment: string
    uuid: string
    replies: FbInstaComment[]
}

export interface ISortingArrowProps {
  handleShortingIcons: (_field: string, _icon: string) => boolean;
  field: string;
}

export interface PaginationProps {
  totalPages: number;
  onPageChange: (_page: number) => void;
  filterPage?: number;
  pageSelectHandler: (_e: ChangeEvent<HTMLSelectElement>) => void;
  totalIteamCount: string | number;
  htmlElements?: React.ReactNode;
}

export interface IPaymentProps {
  status: string;
  message: string;
}

type DefaultEventsMap = {
    [event: string]: (..._args: any[]) => void;
};

export type ISocketType =Socket<DefaultEventsMap, DefaultEventsMap>

interface ProfileData {
    getProfile: {
      data: {
        key_words: string; 
        is_display_keyword: boolean;
      } | null;
    } | null;
}
export interface ICustomisePlatformProps {
  data: ProfileData;
}

export interface IMyProfileProps {
    getProfile: {
      data: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        country_code_id: string;
      };
    };
  }
  
export type IGooglePopupFailType =  "popup_failed_to_open" | "popup_closed" | "unknown";

export interface IHeaderProps {
    primaryColor: string;
}

export interface ILinkedInAccountInfo {
    __typename: string;
    uuid: string;
    user_id: number;
    channel_name: string;
    channel_id: string | null;
    social_connection_id: number;
    facebook_id: string;
    last_access: boolean;
  }