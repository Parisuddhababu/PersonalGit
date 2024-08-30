
'use client'
import { LOCAL_STORAGE_KEY } from "@/constant/common";
import { GET_PRODUCTS } from "@/framework/graphql/queries/catalog";
import { GET_CURRENT_USER_STREAMING, START_LIVE_STREAMING } from "@/framework/graphql/queries/goLive";
import "@/styles/pages/video-platform-golive.scss";
import { AgoraProps, Product } from "@/types/pages";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { JoinStreamingResponse, StartStreamingResponse, StreamingSocketResponse } from "@/types/graphql/pages";
import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import config from "@/components/GoLive/config";
import AgoraManager from ".";
import { useRouter, useSearchParams } from "next/navigation";
import { JOIN_MULTI_LIVE_STREAMING } from "@/framework/graphql/mutations/multiHost";
import { Message } from "@/constant/errorMessage";
import { io } from "socket.io-client";
import { NEXT_PUBLIC_SOCKET_TRANSPORT, NEXT_PUBLIC_SOCKET_URL } from "@/config/app.config";
import { handleGraphQLErrors } from "@/utils/helpers";
import { ISocketType } from "@/types/components";

const AgoraStreaming = ({ agoraAppId }: {
    agoraAppId: string
}) => {
    const params = useSearchParams();
    const token = params.get?.('token')
    const scheduledId = params.get?.('scheduledId');
    const { data } = useQuery(GET_PRODUCTS);
    const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));
    const [joined, setJoined] = useState(false);
    const [startLiveStreaming, { error }] = useMutation(START_LIVE_STREAMING);
    const [joinMultiLiveStreaming, { error: mError }] = useMutation(JOIN_MULTI_LIVE_STREAMING);
    const { refetch: getCurrentSteaming } = useLazyQuery(GET_CURRENT_USER_STREAMING)[1]
    const [agoraProp, setAgoraProp] = useState<AgoraProps>({
        streamTitle: '',
        streamDescription: '',
        productId: '',
        pageUuid: '',
        token: '',
        uid: '',
        channelName: '',
        type: '',
        live_video_id: '',
        start_time: '',
        end_time: '',
        instaId: false,
        converterId: '',
        broadcastId: '',
        product: undefined,
        userType: undefined,
        scheduledId: '',
        streamingUserId: undefined,
        is_fb: false,
        youTube: false,
        // is_linkedin: false,
    })
    const [connected, setConnected] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product>()
    const router = useRouter();
    const [connectedSocket, setConnectedSocket] = useState<ISocketType | undefined>();

    useEffect(() => {
        const session = localStorage.getItem(LOCAL_STORAGE_KEY.goLiveSession)
        if (!session) {
            toast.error(Message.SESSION_EXPIRED)
            gotBack()
            return
        }
        setAgoraProp(JSON.parse(session) as AgoraProps)
    }, [])

    useEffect(() => {
        if (selectedProduct?.keyword) {
            return
        }
        const userDetails = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.userDetails)!)
        if (agoraProp?.userType === 'brand-influencer' && agoraProp?.product) {
            setSelectedProduct({ ...agoraProp?.product, keyword: userDetails?.key_words })
        }
        if (agoraProp?.userType === 'influencer' && data?.fetchProducts?.data?.productData?.length && agoraProp?.productId) {
            const product = data?.fetchProducts?.data?.productData?.filter((i: Product) => i?.uuid === agoraProp?.productId)
            setSelectedProduct({ ...product?.[0], keyword: `${userDetails?.key_words}${userDetails?.key_word_count}` })
        }
    }, [data, agoraProp])

    const handleReconnectOnRefresh = async () => {
        if (!selectedProduct || !connected) {
            return;
        }

        const instaGram = localStorage.getItem(
            LOCAL_STORAGE_KEY.instaGramDetails
        );

        if (agoraProp?.instaId && !instaGram) {
            toast.error(Message.INSTA_SESSION_EXPIRED);
            gotBack();
            return;
        }

        try {
            const data = await getCurrentSteaming();
            if (data?.data?.getCurrentUserStreaming?.data === null) {
                initiateLiveStreaming();
                return;
            }
            handleExistingStreamingJoining();
        } catch {
            initiateLiveStreaming();
        }
    };

    useEffect(() => {
        handleReconnectOnRefresh()
    }, [selectedProduct, connected])

    const handleExistingStreamingJoining = () => {
        setTimeout(() => {
            if (connectedSocket) {
                connectedSocket.emit("userId", agoraProp?.uid);
                connectedSocket.emit('joinRoom', agoraProp?.scheduledId, agoraProp?.uid)
            }
            setJoined(true);
        }, 1000);
    };

    useEffect(() => {
        if (error) {
            handleGraphQLErrors(error)
        }
        if (mError) {
            handleGraphQLErrors(mError)
        }
    }, [error, mError])

    const gotBack = () => {
        if (agoraProp?.instaId) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.instaGramDetails)
        }
        localStorage.removeItem(LOCAL_STORAGE_KEY.isReload)

        if (token) {
            router.replace('/')
            return
        }
        router.back()
    }

    const gotBackToHome = () => {
        if (agoraProp?.instaId) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.instaGramDetails)
        }
        router.replace('/')
    }

    const initiateLiveStreaming = () => {
        if (token) {
            joinMultiHostLiveStreaming()
            return
        }
        const instaGram = localStorage.getItem(LOCAL_STORAGE_KEY.instaGramDetails)
        startLiveStreaming({
            variables: {
                startStreamingInputParameters: {
                    product_id: agoraProp?.productId,
                    stream_title: agoraProp?.streamTitle,
                    stream_description: agoraProp?.streamDescription,
                    page_uuid: agoraProp?.pageUuid,
                    is_fb: agoraProp?.is_fb,
                    is_insta: agoraProp?.instaId,
                    username: JSON.parse(instaGram!)?.username ?? '',
                    password: JSON.parse(instaGram!)?.password ?? '',
                    streaming_key: JSON.parse(instaGram!)?.streaming_key ?? '',
                    streaming_url: JSON.parse(instaGram!)?.streaming_url ?? '',
                    location: scheduledId ? 2 : 1,
                    scheduled_uuid: scheduledId ?? null,
                    is_insta_login: JSON.parse(instaGram!)?.password ? true : false,
                    is_youtube_login: agoraProp?.youTube,
                    auto_start_streaming: true,
                    is_tiktok:agoraProp?.is_tiktok,
                    // is_linkedin: agoraProp?.is_linkedin
                }
            },
        })
            .then((res) => {
                const data = res?.data as StartStreamingResponse;
                if (data?.startStreaming?.meta?.statusCode === 200) {
                    return
                }
            }).catch(() => {
                gotBack()
            })
    }

    const redirectToStreaming = (_data: StreamingSocketResponse) => {
        console.log(_data,"@@");
        const userStreamingPlatform = _data?.data?.userStreamingPlatform?.filter(i => i?.streaming_platform === "Facebook" || i?.streaming_platform === "Instagram" || i?.streaming_platform === "Youtube" || i?.streaming_platform === "TikTok" || i?.streaming_platform === "LinkedIn")
        if (!userStreamingPlatform?.length) {
            gotBack()
            return
        }
        setJoined(true);
        if (_data?.data?.key_word) {
            localStorage.setItem(LOCAL_STORAGE_KEY.keyword, _data?.data?.key_word)
            localStorage.setItem(LOCAL_STORAGE_KEY.selectedProduct, JSON.stringify(selectedProduct))
        }
        localStorage.setItem(LOCAL_STORAGE_KEY.goLiveSession, JSON.stringify({
            ...agoraProp,
            live_video_id: userStreamingPlatform?.[0].live_video_id,
            start_time: _data?.data?.start_time,
            end_time: _data?.data?.end_time,
        }))
        setAgoraProp({
            ...agoraProp,
            live_video_id: userStreamingPlatform?.[0].live_video_id,
            start_time: _data?.data?.start_time,
            end_time: _data?.data?.end_time,
        })
    }

    const joinMultiHostLiveStreaming = () => {
        const instaGram = localStorage.getItem(LOCAL_STORAGE_KEY.instaGramDetails)
        joinMultiLiveStreaming({
            variables: {
                joinLiveStreamingInputParameters: {
                    product_uuid: agoraProp?.productId,
                    page_uuid: agoraProp?.pageUuid,
                    is_fb: agoraProp?.is_fb,
                    is_insta: agoraProp?.instaId,
                    streaming_user_id: Number(agoraProp?.streamingUserId),
                    scheduled_id: Number(agoraProp?.scheduledId),
                    username: JSON.parse(instaGram!)?.username ?? '',
                    password: JSON.parse(instaGram!)?.password ?? '',
                    streaming_key: JSON.parse(instaGram!)?.streaming_key ?? '',
                    streaming_url: JSON.parse(instaGram!)?.streaming_url ?? '',
                    is_insta_login: JSON.parse(instaGram!)?.password ? true : false,
                    auto_start_streaming: true,
                    is_youtube_login: agoraProp?.youTube,
                    is_tiktok:agoraProp?.is_tiktok,
                    // is_linkedin: agoraProp?.is_linkedin
                }
            },
        })
            .then((res) => {
                const data = res?.data as JoinStreamingResponse;
                if (data?.joinLiveStreaming?.meta?.statusCode === 200) {
                    return
                }
            }).catch(() => {
                gotBackToHome()
            })
    }

    // socket connection
    useEffect(() => {
        if (!selectedProduct) {
            return
        }

        // Create Socket.IO client instance
        const socket = io(NEXT_PUBLIC_SOCKET_URL,
            {
                path: '/socket.io',
                transports: [NEXT_PUBLIC_SOCKET_TRANSPORT]
            });

        // Connect to the server
        socket.connect();

        // Event listeners
        socket.on('connect', () => {
            setConnectedSocket(socket);
            setConnected(true)
        });

        socket.on('disconnect', () => {
            setConnected(false)
        });

        socket.emit("userId", agoraProp?.uid);

        socket.on(agoraProp?.uid, (res?: StreamingSocketResponse) => {
            let data = res;
            if (typeof res === 'string') {
                data = JSON.parse(res)
            }
            if (data?.meta?.statusCode === 200) {
                redirectToStreaming(data)
                return
            }
            if (data?.extensions?.meta?.statusCode && data?.extensions?.meta?.statusCode !== 200) {
                toast.error(data?.extensions?.meta?.message)
                gotBack()
                return
            }
            toast.error(Message.FAILED_TO_PREPARE_STREAM)
            gotBack()
        });
    }, [selectedProduct]);

    return (
        <div className="container-lg">
            {
                !joined &&
                <div className="loader-spin">
                    <div className="circle"></div>
                    <div className="loading-text">Preparing Live Stream
                        <span className="dot-one"> .</span>
                        <span className="dot-two"> .</span>
                        <span className="dot-three"> .</span>
                    </div>
                </div>
            }
            {
                joined &&
                <AgoraRTCProvider client={agoraEngine}>
                    <AgoraManager config={{
                        ...config, rtcToken: agoraProp?.token,
                        uid: agoraProp?.uid, channelName: agoraProp?.channelName,
                        appId: agoraAppId,
                        socket: connectedSocket
                    }}
                        productId={agoraProp?.productId}
                        product={selectedProduct}
                        start_time={agoraProp?.start_time}
                        end_time={agoraProp?.end_time}
                        live_video_id={agoraProp?.live_video_id}
                        broadcastId={agoraProp?.broadcastId}
                        scheduledId={agoraProp?.scheduledId}
                    />
                </AgoraRTCProvider>
            }
        </div>
    )
}

export default AgoraStreaming