import { UserType } from "@/framework/redux/redux";
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import React from "react";

export type SignForm = {
    email: string;
    password: string;
}

export type ISignUpForm = {
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    countryCodeId: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
    apply?: boolean
}

export interface IGenderChange {
    value?: string,
    label?: string
}
export interface Country {
    country_code: string;
    phone_code: string;
    name: string;
}

export interface SelectedOption {
    label: string;
    value: string;
}
export interface ICountryData {
    country_code: string;
    phone_code: string;
    uuid: string;
    name: string;
}

export interface IProductChange {
    value: string,
    label: string
    image?: string
}

export type IForgotPasswordForm = {
    email: string
}

export type IResetPasswordForm = {
    password: string,
    confirmPassword: string,
}

export type IColumnsProps = {
    fieldName: string;
    name: string;
    sortable: boolean;
    type: 'image' | 'text' | 'date' | 'status' | 'action' | 'badge' | 'ratings';
    headerCenter?: boolean;
    conversationValue?: IListData;
}

export type GoliveForm = {
    streamTitle: string
    streamDescription: string
    productId: string
    pageUuid: string
}
export type GoliveFormI = {
    streamTitle: string
    streamDescription: string
    productUuid: string
    pageUuid: string
}

export type Product = {
    color: string
    description: string
    images: {
        url: string
    }[]
    name: string
    price: string
    size: string
    sku: string
    url: string
    uuid: string
    keyword?: string
} | undefined

export interface AgoraProps extends GoliveForm {
    token: string
    uid: string
    channelName: string
    product?: Product
    products?: Product[]
    prev?: () => void
    type: string
    live_video_id?: string
    start_time?: string
    end_time?: string
    instaId?: boolean
    broadcastId?: string
    converterId?: string
    userType?: UserType
    scheduledId?: string
    streamingUserId?: string
    is_fb?: boolean
    youTube?: boolean
    is_tiktok?: boolean,
    youTube?: boolean,
    is_linkedin?: boolean
}

export type GoLiveStep1Form = {
    streamTitle: string
    streamDescription: string
    scheduleDate: string
    scheduleTime: string
    timeZone: string
}

export type GoLiveStep2Form = {
    productId: string
}

export type GoLiveStep3Form = {
    pageUuid: string
    instaId: boolean
    is_fb?: boolean
    youTube?: boolean
    tikTok?:boolean ,
    is_tiktok?: boolean
    youTube?: boolean,
    is_linkedin?: boolean,
    linkedin?: boolean,
}

export type GoliveStep4Form = {
    type: string
}

export type GoliveStep4Form2 = {
    email: string
}

export interface AgoraContextType {
    localCameraTrack: ICameraVideoTrack | null;
    localMicrophoneTrack: IMicrophoneAudioTrack | null;
    children: React.ReactNode;
}

export type SingleInfluencer = {
    product_uuid: string
    user_uuid: string
}

export type ScheduleForm = {
    streamTitle: string
    streamDescription: string
    scheduleDate: string
    scheduleTime: string
    timeZone: string
    email?: string[] | null,
    scheduleUuid?: string
}

export type StepsTrack = {
    step1: boolean
    step2: boolean
    step3: boolean
}

export type GoLiveScheduleStep3Form = {
    [k: string]: string
}

export type InfluencerBrand = {
    product_uuid: string
    user_uuid: string
}

export type IGoLiveBrandScheduleStep3FormKeys = "product_uuid1" | "user_uuid1" | "product_uuid2" | "user_uuid2" | "product_uuid3" | "user_uuid3" | "product_uuid4" | "user_uuid4"

export type GoLiveBrandScheduleStep3Form = {
    product_uuid1: string
    user_uuid1: string
    product_uuid2: string
    user_uuid2: string
    product_uuid3: string
    user_uuid3: string
    product_uuid4: string
    user_uuid4: string
}

export type GoLiveScheduleStep1Form = {
    streamTitle: string
    streamDescription: string
    scheduleDate: string
    scheduleTime: string
    timeZone: string,
    scheduleUuid?: string
}

export type GoLiveScheduleTep1Form1 = {
    streamTitle: string
    streamDescription: string
    scheduleDate: string
    scheduleTime: string
    timeZone: string
    email?: string
}
interface IInsights {
    facebook: number;
    instagram: number;
    totalCount: number;
    youtube: number;
    tiktok: number;
}

export interface ITotalInsights {
    comments?: IInsights;
    views?: IInsights;
    totalSessions: number;
}


interface IPlatform {
    key: keyof IInsights;
    icon: string;
    name: string;
    dataKey: keyof IInsights
  }
  

export interface IViews {
    platform: string;
    view_platform_count: string;
}

export interface IComments {
    comments_platform: string;
    comments_platform_count: string;
}

export interface ITopFiveData {
    facebook_views: number;
    instagram_views: number;
    start_time: string;
    stream_title: string;
    user_streaming_id: number;
    uuid: string;
    views: number;
    comments_platform_count: number;
    facebook_comments: number;
    instagram_comments: number
    youtube_views: number;
    youtube_comments: number;
    tiktok_comments: number;
    tiktok_views: number;
}

interface ITopFiveInfluencers {
    total_streaming_count?: number;
    email?: string;
    uuid?: string;
    first_name?: string;
    last_name?: string;
    __typename: string;
    total_click_count?: number;
    name?: string;
}

interface ITopFiveProductData {
    uuid?: string;
    total_click_count?: number;
    name?: string;
    __typename: string;
}

export interface ITopFiveInsights {
    top_comments: ITopFiveData[];
    top_views: ITopFiveData[];
    top_influncers: ITopFiveInfluencers[];
    top_products: ITopFiveProductData[];
}


export interface IInsightsProps {
    tableFor: string;
    query: DocumentNode,
    dateObject: DateFilter
}

export interface IBrandInsightsProps {
    tableFor: string;
    title: string;
    query: DocumentNode,
    dateObject: DateFilter
}

export interface IInsightReportProductBox {
  Facebook: string;
  Instagram: string;
  Youtube: string;
  TikTok: string;
}

export interface IInsightReportProps {
    __typename: string
    click: IInsightReportProductBox,
    comment: IInsightReportProductBox,
    name: string
    id: number
    sku: string
    description: string
    color: string
    size: string
    price: number
}

export interface IClicksCount {
    __typename: string
    platform: string
    click_count: number
}

export interface ICommentCount {
    __typename: string
    comments_platform: string
    comments_count: number
}

export interface IMultiHostDetails {
    user_id: number
    parent_id: number
    email: string
    is_joined: boolean
    is_streaming: boolean
    is_live: boolean
    host_type: string
    uuid: string
}


export interface IVerifyEmailResponse {
    verifyEmail: {
        meta: {
            message: string;
            messageCode: string;
            statusCode: number;
            status: string;
            type: null | string;
            errorType: null | string;
        };
    };
}


interface IPlanFeature {
    __typename: string;
    name: string;
    isActive: boolean;
}

export interface ISubscriptionPlan {
    __typename: string;
    uuid: string;
    plan_title: string;
    plan_description: string;
    no_of_sessions: number;
    plan_features: IPlanFeature[];
    plan_price: number;
    plan_price_id: string;
    order_no: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ICurrentSubscriptionPlan {
    current_subscription_purchased_price: number;
    available_session: number;
    status: string;
    plan_title: string | null;
    plan_description: string | null;
}

export interface IUserSubscriptionPlanFetch {
    __typename: string;
    current_user_plan_details: ICurrentSubscriptionPlan;
    completed_session: number;
    total_purchased_session: number;
}

export interface IPaymentHistory {
    __typename: string;
    uuid: string;
    purchased_price: number;
    invoice_pdf: string;
    status: string;
    created_at: string;
}

export interface IScheduleData {
    uuid: string;
    stream_title?: string;
    schedule_date: string;
    schedule_time: string;
    timeZone: string;
    status: string;
    invitation_url: string;
    end_date: string;
}

export interface IInfluencers {
    product_uuid: string,
    user_uuid: string,
}

export interface ISteps {
    'step1': boolean,
    'step2': boolean,
    'step3'?: boolean,
    'step4'?: boolean
}

export type IStep = 'step1' | 'step2' | 'step3' | 'step4';

export interface IInputEvent {
    value: string;
    label: string;
}

export interface IStreamDetailsData {
    __typename: string;
    uuid: string;
    duration: string;
    stream_title: string;
    start_time: string;
    end_time: string;
    session_views: IViewsCount[];
    multi_host_user_details: IMultiHostUserResponse[];
}

interface IViewsCount {
    __typename: string;
    platform: string;
    view_platform_count: string;
}

interface IMultiHostUserResponse {
    __typename: string;
    uuid: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface IFacebookDetails {
    appId: string;
    redirectUri: string;
    scope: string;
}

export interface DateFilter {
    startDate: string | null;
    endDate: string | null;
}

export interface IYoutubeAuthCred {
  clientId: string;
  scope: string;
  redirectUri: string
}

export interface ITikTokAuthPayload {
    access_token: string | null;
    username: string | null;
    tiktok_id: string | null;
    sec_user_id: string | null;
}
  
