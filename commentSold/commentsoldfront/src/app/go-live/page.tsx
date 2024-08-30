'use client'
import { ApolloError, useLazyQuery, useMutation, } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { LOCAL_STORAGE_KEY } from '@/constant/common'
import { Message } from '@/constant/errorMessage';
import { AgoraProps, GoLiveStep1Form, GoLiveStep2Form, GoLiveStep3Form, IStep, Product } from '@/types/pages';
import { GetBrandProduct, GetInstagramAccountResponse, GetSocialPageListResponse, GetSocialTokenResponse } from '@/types/graphql/pages'
import { GET_CURRENT_USER_STREAMING, GET_STREAMING_TOKEN } from '@/framework/graphql/queries/goLive';
import "@/styles/pages/go-live.scss";
import Step1 from "./steps-components/step-1";
import Step2 from "./steps-components/step-2";
import Step3 from "./steps-components/step-3";
import Step4 from "./steps-components/step-4";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/config/staticUrl.config';
import { GET_PRODUCT_BRAND_INFLUENCER, GET_STREAMING_TOKEN_MULTI_HOST } from '@/framework/graphql/mutations/multiHost'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingState } from '@/framework/redux/reducers/commonSlice'
import { GET_INSTA_ACCOUNT, GET_TIK_TOK_AUTHORIZATION_DATA,GET_LINKEDIN_AUTHORIZATION_DATA, LIST_OF_SOCIAL_PAGES, LIST_OF_YOUTUBE_CHANNELS } from '@/framework/graphql/queries/connectChannel'
import { CommonSliceTypes } from '@/framework/redux/redux'
import { decryptToken, detectBrowser, handleGraphQLErrors } from '@/utils/helpers'

export default function GoLive() {
    const dispatch = useDispatch();
    const router = useRouter()
    const params = useSearchParams();
    const token = params.get?.('token');
    const scheduledId = params.get?.('scheduledId');
    const { userType, isWhiInfluencer } = useSelector((state: CommonSliceTypes) => state.common)
    const [getStreamingTokenMulti, { error }] = useMutation(GET_STREAMING_TOKEN_MULTI_HOST)
    const [getStreamingToken, { error: sError }] = useLazyQuery(GET_STREAMING_TOKEN)
    const { refetch: getCurrentSteaming, loading: currentSteamLoading } = useLazyQuery(GET_CURRENT_USER_STREAMING)[1]
    const { loading: lLoading, refetch: socialPageRefetch } = useLazyQuery(LIST_OF_SOCIAL_PAGES)[1];
    const { loading: youtubeLoading, refetch: refetchYoutubeChannels } = useLazyQuery(LIST_OF_YOUTUBE_CHANNELS)[1];
    const [getBrandInfluencerProduct, { loading: gLoading }] = useLazyQuery(GET_PRODUCT_BRAND_INFLUENCER)
    const [getInstaAccount, { loading: intaLoading }] = useLazyQuery(GET_INSTA_ACCOUNT);
    const { loading: fetchTikTokDataLoading, refetch : getTikTokDetails} = useLazyQuery(GET_TIK_TOK_AUTHORIZATION_DATA)[1];
    const { loading: fetchLinkedDataLoading, refetch : getLinkedinDetails} = useLazyQuery(GET_LINKEDIN_AUTHORIZATION_DATA)[1];
    const setSelectedProduct = useState<Product>()[1]
    const [steps, setSteps] = useState({
        step1: true,
        step2: (token !== null || scheduledId !== null),
        step3: false,
        step4: false
    })
    const path = usePathname()

    useEffect(() => {
        fetchData()
        if (userType === 'brand-influencer' && !isWhiInfluencer) {
            setSteps({ ...steps, step3: true })
        }
    }, [userType, isWhiInfluencer])

    const [agoraProp, setAgoraProp] = useState<AgoraProps>({
        streamTitle: '',
        streamDescription: '',
        productId: '',
        pageUuid: '',
        token: '',
        uid: '',
        channelName: '',
        type: '',
        instaId: false,
        streamingUserId: '',
        scheduledId: '',
        is_fb: false,
        youTube: false,
        is_tiktok: false,
    })

    const handleRedirectOnNoCount = (error: ApolloError | undefined) => {
        if (error?.graphQLErrors?.[0]?.extensions?.code === 'YOU_DO_NOT_HAVE_SESSION_COUNT') {
            router.push(`/${ROUTES.private.myPlans}`)
        }
    }

    // Page loader
    useEffect(() => {
        dispatch(setLoadingState(lLoading || gLoading || intaLoading || currentSteamLoading || youtubeLoading || fetchTikTokDataLoading || fetchLinkedDataLoading))
        if (error) {
            handleGraphQLErrors(error)
            handleRedirectOnNoCount(error)
        }
        if (sError) {
            handleGraphQLErrors(sError)
            handleRedirectOnNoCount(sError)
        }
    }, [error, sError, lLoading, gLoading, intaLoading, currentSteamLoading, youtubeLoading, fetchTikTokDataLoading,fetchLinkedDataLoading])

    const fetchData = () => {
        if (!token) {
            return
        }
        decryptToken(token as string).then(tRes => {
            if (!tRes?.length) {
                toast.error(Message.SOMETHING_WENT_WRONG_TRY_AGAIN)
                return
            }
            const streamingUserId = tRes?.[0]
            const scheduledId = tRes?.[4]
            setAgoraProp({
                ...agoraProp,
                streamingUserId: streamingUserId,
                scheduledId
            })

            if (userType === 'brand-influencer' && !isWhiInfluencer) {
                getBrandUserProduct(streamingUserId, scheduledId)
            }
        })
    }

    const goToStep2 = (values: GoLiveStep1Form) => {
        setAgoraProp({ ...agoraProp, ...values })
        setSteps({ ...steps, step1: false, step2: true })
    }

    const goToStep3 = (values: GoLiveStep2Form, product: Product) => {
        setSelectedProduct(product)
        setAgoraProp({ ...agoraProp, ...values })
        setSteps({ ...steps, step2: false, step3: true })
    }

    const goToStep4 = (values: GoLiveStep3Form) => {
        if (!token && !agoraProp.productId) {
            toast.error(Message.STEP_2_REQUIRED)
            return;
        };

        setAgoraProp({ ...agoraProp, ...values })
        setSteps({ ...steps, step3: false, step4: true })
    }

    const redirectToPrepareStreaming = () => {
        let streamingUrl = `/${ROUTES.private.goLive}/${ROUTES.private.session}`
        if (scheduledId) {
            streamingUrl = `${streamingUrl}?scheduledId=${scheduledId}`
        }
        if (token) {
            streamingUrl = `${streamingUrl}?token=${token}`
        }
        router.push(streamingUrl)
    }

    const checkIsCurrentStreaming = async () => {
        try {
            const data = await getCurrentSteaming();
            if (data?.data?.getCurrentUserStreaming?.data === null) {
                return false;
            }
            return true;
        } catch {
            return true;
        }
    };

    const onSubmit = async () => {
        const isCurrentStreaming = await checkIsCurrentStreaming();
        if (isCurrentStreaming) {
            toast.error(Message.CURRENT_STREAMING_END)
            return;
        }
        dispatch(setLoadingState(true))
        try {
            // Request access to the camera and microphone
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

            // If access is granted, log success
            onGetStreamingToken()
        } catch {
            dispatch(setLoadingState(false))
            // If access is denied or an error occurs, log error
            toast.error(Message.CAMERA_MICROPHONE_NOT_SUPPORTED)
        }

    }

    const onGetStreamingToken = async () => {
        if (token) {
            getStreamingTokenMulti({
                variables: {
                    token
                }
            }).then((res) => {
                onHandleThenBlock(res.data as GetSocialTokenResponse)
            }).catch(() => {
                dispatch(setLoadingState(false))
            })
            return
        }
        getStreamingToken({ variables: { scheduleUuid: scheduledId ?? '' } }).then((res) => {
            onHandleThenBlock(res.data as GetSocialTokenResponse)
        }).catch(() => {
            dispatch(setLoadingState(false))
        })
    }

    const getBrandUserProduct = (streamingUserId: string, sId: string) => {
        getBrandInfluencerProduct({
            variables: {
                streamingScheduleId: Number(sId)
            }
        }).then((res) => {
            const response = res.data as GetBrandProduct
            if (!response?.getProduct?.data) {
                toast.error(Message.BRAND_PRODUCT_NOT_FOUND)
                return
            }
            setAgoraProp({
                ...agoraProp, product: response?.getProduct?.data,
                streamingUserId: streamingUserId,
                scheduledId: sId
            })
            setSelectedProduct(response?.getProduct?.data)
        })
    }

    const setLocalStorage = (response: GetSocialTokenResponse) => {
        localStorage.setItem(LOCAL_STORAGE_KEY.goLiveSession, JSON.stringify({
            ...agoraProp,
            token: response.getStreamingToken.data.session_token,
            uid: response.getStreamingToken.data.user_id,
            channelName: response.getStreamingToken.data.channelName,
            scheduledId: scheduledId ?? agoraProp?.scheduledId ?? '',
            userType: isWhiInfluencer ? 'influencer' : userType,
        }))
    }

    const onHandleThenBlock = (response: GetSocialTokenResponse) => {
        if (response.getStreamingToken.meta.statusCode !== 200) {
            toast.error(response.getStreamingToken.meta.message)
            dispatch(setLoadingState(false))
            return
        }
        setLocalStorage(response)
        redirectToPrepareStreaming()
    }

    useEffect(() => {
        const isReload = localStorage.getItem(LOCAL_STORAGE_KEY.isReload)
        if ((detectBrowser() === 'Mozilla Firefox' || detectBrowser() === 'Safari') && isReload !== 'true') {
            localStorage.setItem(LOCAL_STORAGE_KEY.isReload, 'true')
            window.location.reload()
        }
    }, [])

    const getInstaAccountDetails = (socialPageUuid?: string) => {
        if (!socialPageUuid) {
            return
        }
        getInstaAccount({ variables: { socialPageUuid } }).then(res => {
            const response = res?.data as GetInstagramAccountResponse
            if (response?.getInstaAccount?.data?.uuid) {
                localStorage.setItem(LOCAL_STORAGE_KEY.instaAccount, JSON.stringify({
                    instaUuid: response?.getInstaAccount?.data?.uuid,
                    instaPageName: response?.getInstaAccount?.data?.social_page_title
                }))
            }
        })
    }

    const getLinkedinAccountDetails = async() => {
        // getLinkedinDetails().then(res => {
        //     const linkedinData = res.data?.getLinkendInAuthorizationData?.data;
        //     if(linkedinData?.channel_name){
        //         localStorage.setItem(LOCAL_STORAGE_KEY.linkedinData, JSON.stringify(linkedinData));
        //         return;
        //     }
        //     localStorage.removeItem(LOCAL_STORAGE_KEY.linkedinData);
        // })
    }

    const fetchYoutubeChannels = async() =>{
        const youtubeChannels = await refetchYoutubeChannels();
 
        if(youtubeChannels?.data?.listYouTubeChannels?.data?.length>0){
         const selectedYoutubeChannel = youtubeChannels?.data?.listYouTubeChannels?.data?.filter((i: {last_access : boolean}) => i?.last_access === true)
         if (!selectedYoutubeChannel?.length) {
             return
         }
         localStorage.setItem(LOCAL_STORAGE_KEY.youtubeChannel, selectedYoutubeChannel?.[0]?.uuid ?? '');
         return
        }
        localStorage.removeItem(LOCAL_STORAGE_KEY.youtubeChannel);
    }

    const getTikTokAccountDetails = async() => {
        getTikTokDetails().then(res => {
            const tikTokData = res.data?.getTikTokAuthorizationData?.data;
            if(tikTokData?.channel_name){
                localStorage.setItem(LOCAL_STORAGE_KEY.tikTokAccount, JSON.stringify(tikTokData));
                return;
            }
            localStorage.removeItem(LOCAL_STORAGE_KEY.tikTokAccount);
        })
    }

    useEffect(() => {
        socialPageRefetch().then(res => {
            const response = res?.data as GetSocialPageListResponse
            if (response?.listSocialPages?.data?.length) {
                const selectedPage = response?.listSocialPages?.data?.filter(i => i?.is_selected === true)
                localStorage.setItem(LOCAL_STORAGE_KEY.facebookPage, selectedPage?.[0]?.uuid ?? '')
                getInstaAccountDetails(selectedPage?.[0]?.uuid)
            } else {
                localStorage.removeItem(LOCAL_STORAGE_KEY.facebookPage)
            }
        });
        fetchYoutubeChannels()
        getTikTokAccountDetails()
        getLinkedinAccountDetails()
        return () => {
            dispatch(dispatch(setLoadingState(false)))
        }
    }, [path])

    const accordionHandler = useCallback((step: IStep) => {
        if (step === "step4" && !agoraProp.pageUuid) {
            toast.error(Message.STEP_3_REQUIRED)
            return;
        }

        setSteps((prevSteps) => ({
            step1: false, step2: false, step3: false, step4: false,
            [step]: !prevSteps[step]
        }));
    }, [setSteps, agoraProp]);

    return (
        <div>
            <div className="golive-sec">
                <div className="container-lg">
                    <h1 className="golive-title spacing-30">Start Live Session</h1>
                    <div className="golive-inner">
                        <ul className="golive-list list-unstyled">
                            {
                                (!token && !scheduledId) &&
                                <Step1
                                    active={steps.step1}
                                    onSubmitStep1={goToStep2}
                                    accordionHandle={accordionHandler}
                                />
                            }
                            {
                                (userType === 'influencer' || isWhiInfluencer) &&
                                <Step2
                                    hidePrev={token !== null || scheduledId !== null}
                                    active={steps.step2}
                                    onPrev={() => setSteps({ ...steps, step1: true, step2: false })}
                                    onSubmitStep2={goToStep3}
                                    accordionHandle={accordionHandler}
                                    completed={agoraProp?.productId !== ''}
                                />
                            }
                            <Step3
                                hidPrev={userType === 'brand-influencer' && !isWhiInfluencer}
                                active={steps.step3}
                                onPrev={() => setSteps({ ...steps, step2: true, step3: false })}
                                onSubmitStep3={goToStep4}
                                accordionHandle={accordionHandler}
                                completed={agoraProp?.pageUuid !== '' || agoraProp?.instaId || agoraProp?.youTube || agoraProp?.is_linkedin || agoraProp?.is_tiktok}
                            />
                            <Step4
                                isHost={!token}
                                isInsta={agoraProp?.instaId}
                                active={steps.step4}
                                onPrev={() => setSteps({ ...steps, step3: true, step4: false })}
                                onSubmitStep4={onSubmit}
                                accordionHandle={accordionHandler}
                            />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
