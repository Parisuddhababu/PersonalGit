'use client'
import {
    LocalVideoTrack,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRTCClient,
    useRemoteUsers,
    useClientEvent,
} from "agora-rtc-react";
import React, { createContext, useContext, useState, useEffect, Fragment, useMemo, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { END_LIVE_STREAMING, GET_COMMENTS, LIVE_STREAMING_PRODUCT_UPDATE, SEND_COMMENT, SEND_COMMENT_REPLY, UPDATE_LIVE_STREAMING } from "@/framework/graphql/queries/goLive";
import { DATE_TIME_FORMAT, LOCAL_STORAGE_KEY } from "@/constant/common";
import { AgoraContextType, Product } from "@/types/pages";
import { useDispatch, useSelector } from "react-redux";
import {
    EndStreamingResponse, SendCommentReplyResponse, SendCommentResponse,
    UpdateStreamingResponse
} from "@/types/graphql/pages";
import { setHeaderMenuState, setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { toast } from "react-toastify";
import { AgoraManagerTypes, FbInstaComment, ISocketType } from "@/types/components";
import { IS_HIGH_QLY_ENABLED } from "@/config/app.config";
import { useRouter, useSearchParams } from "next/navigation";
import { GET_PRODUCTS } from "@/framework/graphql/queries/catalog";
import moment from 'moment';
import DeletePopup from "../Popup/DeletePopup";
import { CommonSliceTypes } from "@/framework/redux/redux";
import ChatLoader from "../Loader/ChatLoader";
import { IMAGE_PATH } from "@/constant/imagePath";
import { Message } from "@/constant/errorMessage";
import Link from "next/link";
import Image from "next/image";
import AgoraRTC, { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { LIVE_STREAMING_LAYOUT_UPDATE } from "@/framework/graphql/mutations/goLive";
import { handleGraphQLErrors } from "@/utils/helpers";

// Define the shape of the Agora context
// Create the Agora context
const AgoraContext = createContext<AgoraContextType | null>(null);

// AgoraProvider component to provide the Agora context to its children
export const AgoraProvider: React.FC<AgoraContextType> = ({ children, localCameraTrack, localMicrophoneTrack }) => (
    <AgoraContext.Provider value={{ localCameraTrack, localMicrophoneTrack, children }}>
        {children}
    </AgoraContext.Provider>
);

// Custom hook to access the Agora context
export const useAgoraContext = () => {
    const context = useContext(AgoraContext);
    if (!context) throw new Error("useAgoraContext must be used within an AgoraProvider");
    return context;
};

let backupComments: FbInstaComment[] = []
let fetchingComments = false

// AgoraManager component responsible for handling Agora-related logic and rendering UI
export const AgoraManager = ({ config, product,
    end_time, live_video_id, broadcastId, scheduledId }: AgoraManagerTypes) => {
    const { data, refetch: getProducts, loading: pLoading } = useQuery(GET_PRODUCTS);
    const { refetch: getComments } = useQuery(GET_COMMENTS);
    // const { refetch: getViewes } = useQuery(FETCH_VIEWS);
    const [endLiveStreaming] = useMutation(END_LIVE_STREAMING);
    const [updateLiveStreaming, { loading }] = useMutation(UPDATE_LIVE_STREAMING);
    const [sendCommentReply, { error: cError }] = useMutation(SEND_COMMENT_REPLY);
    const [sendComment, { error: cCError }] = useMutation(SEND_COMMENT);
    const [comments, setComments] = useState<FbInstaComment[]>([]);
    const agoraEngine = useRTCClient();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(true);
    const [isMicEnabled, setIsMicEnabled] = useState<boolean>(true);
    const [isViewProductStrip, setIsViewProductStrip] = useState<boolean>(true);
    const [updateProductStrip, { loading : productStripLoading }] = useMutation(LIVE_STREAMING_PRODUCT_UPDATE);
    const [updateStreamLayout, { loading : layoutLoading }] = useMutation(LIVE_STREAMING_LAYOUT_UPDATE);
    const dispatch = useDispatch();
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [defaultProduct, setDefaultProduct] = useState<Product>();
    const router = useRouter()
    const remoteUsers = useRemoteUsers();
    const [remoteUserWithActiveCamera, setRemoteUserWithActiveCamera] = useState<IAgoraRTCRemoteUser[] | {_video_muted_ : boolean}[]>([])
    // const [viewes, setViewes] = useState({
    //     insta: '0',
    //     fb: '0'
    // })
    const diffInSeconds = moment.utc(end_time).diff(moment.utc(), 'seconds');
    const [minutes, setMinutes] = useState(Math.floor(diffInSeconds / 60))
    const [seconds, setSeconds] = useState(diffInSeconds % 60);
    const [commentFilter, setCommentFilter] = useState('all');
    const [comment, setComment] = useState('');
    const [commentType, setCommentType] = useState({
        commentId: '',
        replyTo: ''
    });
    const [chatLoader, setChatLoader] = useState<boolean>(false)
    const [isEndPopup, setIsEndPopup] = useState(false)
    const { userDetails, userType, isWhiInfluencer } = useSelector((state: CommonSliceTypes) => state.common)
    const [keyword, setKeyword] = useState('')
    const params = useSearchParams();
    const urlScheduledId = params.get?.('scheduledId');
    const commentsEndRef = useRef<HTMLDivElement | null>(null);
    const [filteredComments, setFilteredComments] = useState<FbInstaComment[]>([])
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
    const [isCameraDropDownOpen, setIsCameraDropDownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [activeNumberOfCamera,setActiveNumberOfCamera] = useState<number>(1);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsCameraDropDownOpen(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        dispatch(setLoadingState(pLoading || loading || productStripLoading || layoutLoading))
        if (cError?.message) {
            toast.error(cError?.message)
        }
    }, [pLoading, loading, cError, cCError, productStripLoading, layoutLoading]);

    useEffect(()=>{
        if (cCError?.message) {
            toast.error(cCError?.message)
        }
    },[cCError])

    const onSelectProduct = (uuid: string) => {
        if (selectedProduct?.uuid === uuid) {
            return
        }
        if (!selectedProduct?.uuid && product?.uuid === uuid) {
            return
        }
        const p = data?.fetchProducts?.data?.productData?.filter((i: {uuid : string}) => i?.uuid === uuid);
        if (p?.length) {
            setSelectedProduct(p?.[0])
            localStorage.setItem(LOCAL_STORAGE_KEY.selectedProduct,JSON.stringify(p?.[0]));
        }
    };

    const updateProductOnStreamingPlatform = () => {
        dispatch(setLoadingState(true))
        updateLiveStreaming({
            variables: {
                productUuid: selectedProduct?.uuid
            },
        })
            .then((res) => {
                const data = res?.data as UpdateStreamingResponse;
                if (data?.updateStreaming?.data?.uuid) {
                    toast.success(Message.STREAMING_PRODUCT_UPDATED)
                    if (data?.updateStreaming?.data?.key_word) {
                        setKeyword(data?.updateStreaming?.data?.key_word)
                        localStorage.setItem(LOCAL_STORAGE_KEY.keyword, data?.updateStreaming?.data?.key_word)
                    }
                    return
                }
                toast.error(Message.FAILED_TO_UPDATE_PRODUCT)
                setSelectedProduct(undefined)
            }).catch(() => {
                toast.error(Message.FAILED_TO_UPDATE_PRODUCT)
                setSelectedProduct(undefined)
            })

    }

    useEffect(() => {
        if (!selectedProduct) {
            return
        }
        updateProductOnStreamingPlatform()
    }, [selectedProduct])

    useEffect(() => {
      const initializeAgora = async () => {
        if (localCameraTrack && !IS_HIGH_QLY_ENABLED) {
          await localCameraTrack.setEncoderConfiguration({
            width: 160,
            height: 90,
            frameRate: 5, // Very low frame rate
            bitrateMin: 50, // Minimum bitrate in kbps
            bitrateMax: 150, // Maximum bitrate in kbps
          });
        }
      };
      initializeAgora();
    }, [localCameraTrack]);

    // Publish local tracks
    usePublish([localMicrophoneTrack, localCameraTrack]);


    const audioVideoController = (action: 'video' | 'audio' | 'product') => {
        if (action === 'video'  && localCameraTrack) {
          hideAndShowStreamLayout()
        }
        if (action === 'audio'  && localMicrophoneTrack) {
            setIsMicEnabled(!localMicrophoneTrack.enabled);
        }
        if(action === 'product'){
            hideAndShowProductStrip()
        }
    };

    const hideAndShowStreamLayout = () => {
        updateStreamLayout({
            variables: {
                isCamera: !localCameraTrack?.isPlaying
            },
        })
            .then((res) => {
                const data = res?.data;
                if (data?.liveStreamingLayoutUpdate?.meta?.statusCode === 200 && localCameraTrack) {
                    setIsCameraEnabled(!localCameraTrack.isPlaying);
                    setIsMicEnabled(!localCameraTrack.isPlaying);
                    setIsViewProductStrip(!localCameraTrack.isPlaying);
                    hideAndShowProductStrip({isView : !localCameraTrack.isPlaying, from : 'camera'})
                    return
                }
                toast.error(Message.SOMETHING_WENT_WRONG_TRY_AGAIN)
            }).catch((error) => {
                handleGraphQLErrors(error);
            })
    }

    const hideAndShowProductStrip = (productStripData? : {isView : boolean, from : string}) => {
        const isViewProductStripTemp = productStripData?.from === 'camera' ? productStripData?.isView :  !isViewProductStrip;

        updateProductStrip({
            variables: {
                displayProduct: isViewProductStripTemp
            },
        })
            .then((res) => {
                const data = res?.data;
                if (data?.liveStreamingProductUpdate?.data?.uuid) {
                    setIsViewProductStrip(isViewProductStripTemp);
                    return
                }
                toast.error(Message.SOMETHING_WENT_WRONG_TRY_AGAIN)
            }).catch(() => {
                toast.error(Message.SOMETHING_WENT_WRONG_TRY_AGAIN)
            })
    }

    useEffect(() => {
      if (localCameraTrack) localCameraTrack.setEnabled(isCameraEnabled);
      if (localMicrophoneTrack) localMicrophoneTrack.setEnabled(isMicEnabled);
    }, [localCameraTrack, localMicrophoneTrack, isCameraEnabled, isMicEnabled]);

    // Join the Agora channel with the specified configuration
    useJoin({
        appid: config.appId,
        channel: config.channelName,
        token: config.rtcToken,
        uid: config.uid,
    });

    useClientEvent(agoraEngine, "user-joined", () => {
    });

    useClientEvent(agoraEngine, "user-left", () => {
    });

    useClientEvent(agoraEngine, "user-published", () => {
    });

    useEffect(() => {
        backupComments = []
        fetchingComments = false
        return () => {
            localCameraTrack?.close();
            localMicrophoneTrack?.close();
        };
    }, []);

    const fetchComment = ({ filter, reset = false }: { filter: string, reset?: boolean }, loader = false) => {
        if (fetchingComments) {
            return
        }
        setChatLoader(loader)
        let date = ''
        if (backupComments?.length && !reset) {
            const _comment = backupComments?.[backupComments?.length - 1]
            if (_comment?.created_at) {
                date = _comment?.created_at
            }
        }
        fetchingComments = true
        getComments({ filter, date }).then((res) => {
            setChatLoader(false)
            let newComments = res.data?.getStreamingComments?.data as FbInstaComment[]
            if (!newComments?.length) {
                fetchingComments = false
                return
            }
            newComments = newComments?.toReversed()
            if (!date) {
                setComments(newComments)
                backupComments = newComments
                fetchingComments = false
                return
            }
            backupComments = [...backupComments, ...newComments] 
            setComments(prev => [...prev, ...newComments])
            fetchingComments = false
        }).catch(() => {
            setChatLoader(false)
            fetchingComments = false
        })
    }

    // const _getViewes = () => {
    //     getViewes().then((res) => {
    //         if (res.data?.fetchLiveViews?.data) {
    //             setViewes({
    //                 ...viewes,
    //                 fb: formatNumber(res.data?.fetchLiveViews?.data?.facebook_count),
    //                 insta: formatNumber(res.data?.fetchLiveViews?.data?.instagram_count),
    //             })
    //         }
    //     })
    // }

    const fetchIntervalResponse = () => {
        // _getViewes()
        fetchComment({ filter: 'all' })
    }

    useEffect(() => {
        fetchIntervalResponse()
    }, [])

    useEffect(() => {
        // Set up an interval to fetch data every 10 seconds
        const intervalId = setInterval(() => {
            fetchIntervalResponse()
        }, 10000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const streamEnded = (type?: boolean) => {
        if (!type) {
            toast.success('Streaming ended successfully.',{autoClose: 2000});
        }
        router.push('/');
        dispatch(setHeaderMenuState(true))
        dispatch(setLoadingState(false));
        localStorage.removeItem(LOCAL_STORAGE_KEY.goLiveSession)
        localStorage.removeItem(LOCAL_STORAGE_KEY.instaGramDetails)
    }

    const endCallRecursion = () => {
        endLiveStreaming()
            .then((res) => {
                const data = res?.data as EndStreamingResponse;
                if (data?.endliveStreaming?.meta?.statusCode === 200) {
                    streamEnded()
                    return
                } else {
                    // If the streaming is not yet ended, recursively call _endCall
                    endCallRecursion();
                }
            })
            .catch(() => {
                streamEnded(false)
            });
    }

    const endScheduledCallRecursion = () => {
        endLiveStreaming({
            variables: {
                scheduledId: Number(scheduledId)
            }
        })
            .then((res) => {
                const data = res?.data as EndStreamingResponse;
                if (data?.endliveStreaming?.meta?.statusCode === 200) {
                    streamEnded()
                    return
                } else {
                    // If the streaming is not yet ended, recursively call _endCall
                    endCallRecursion();
                }
            })
            .catch(() => {
                streamEnded(false)
            });
    }

    const _endCall = () => {
        dispatch(setLoadingState(true));
        if (scheduledId) {
            endScheduledCallRecursion()
            return
        }
        endCallRecursion();
    }

    const onSearch = (name: string) => {
        getProducts({
            name
        })
    }

    // socket connection
    useEffect(() => {
        dispatch(setHeaderMenuState(false))
        const socket: ISocketType = config.socket;

        socket.on('productUpdated', (data: any) => {
            if (!data) {
                return
            }
        });

        socket.on('userLeft', (data: any) => {
            if (!data) {
                return
            }
            toast.success(data)
        });

        socket.on('endLiveStreaming', (data: any) => {
            if (!data || !scheduledId || urlScheduledId || (userType === 'brand-influencer' && !isWhiInfluencer)) {
                return
            }
            _endCall()
        });

        // Clean up on unmount
        return () => {
            dispatch(setHeaderMenuState(true))
            // socket.disconnect();
        };
    }, []);

    // timer
    useEffect(() => {
        const timer = setInterval(() => {
            const diffInSeconds = moment.utc(end_time).diff(moment.utc(), 'seconds');
            const _minutes = Math.floor(diffInSeconds / 60);
            const _seconds = diffInSeconds % 60;
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timer);
                    toast.warning('Streaming is getting end.',{autoClose: 2000})
                    _endCall()
                } else {
                    setMinutes(_minutes);
                    setSeconds(_seconds);
                    if (minutes.toString().padStart(2, "0") === '01') {
                        toast.warning(`Streaming will be ended in ${minutes.toString().padStart(2, "0")} minutes`,{autoClose: 2000})
                        return
                    }
                }
            } else {
                setSeconds(_seconds);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [minutes, seconds]);

    const onSelect = (filter: string) => {
        if (filter === commentFilter) {
            return
        }
        setCommentFilter(filter)
    }

    const onHandleReply = () => {
        setChatLoader(true)
        sendCommentReply({
            variables: {
                liveVideoId: live_video_id,
                commentId: commentType?.commentId,
                comment
            }
        })?.then((res) => {
            const response = res.data as SendCommentReplyResponse
            if (response?.sendCommentReply?.meta?.statusCode === 200) {
                fetchingComments = true
                getComments({ filter: 'all', date: '' }).then((res) => {
                    setChatLoader(false)
                    setComment('')
                    setCommentType({
                        commentId: '',
                        replyTo: ''
                    })
                    fetchingComments = false
                    let newComments = res.data?.getStreamingComments?.data as FbInstaComment[]
                    if (!newComments?.length) {
                        return
                    }
                    newComments = newComments?.toReversed()
                    setComments(newComments)
                    backupComments = newComments
                }).catch(() => {
                    setChatLoader(false)
                    fetchingComments = false
                })
                return
            }
            setChatLoader(false)
        }).catch(() => {
            setChatLoader(false)
        })
    }

    const onHandleFbComment = () => {
        setChatLoader(true)
        sendComment({
            variables: {
                liveVideoId: live_video_id,
                comment
            }
        })?.then((res) => {
            const response = res.data as SendCommentResponse
            if (response?.sendComment?.meta?.statusCode === 200) {
                fetchingComments = true
                let date = ''
                if (backupComments?.length) {
                    const _comment = backupComments?.[backupComments?.length - 1]
                    if (_comment?.created_at) {
                        date = _comment?.created_at
                    }
                }
                getComments({ filter: 'all', date }).then((res) => {
                    setChatLoader(false)
                    setComment('')
                    fetchingComments = false
                    let newComments = res.data?.getStreamingComments?.data as FbInstaComment[]
                    if (!newComments?.length) {
                        return
                    }
                    newComments = newComments?.toReversed()
                    if (!date) {
                        setComments(newComments)
                        backupComments = newComments
                        return
                    }
                    backupComments = [...backupComments, ...newComments]
                    setComments(prev => [...prev, ...newComments])
                }).catch(() => {
                    setChatLoader(false)
                    fetchingComments = false
                })
                return
            }
            setChatLoader(false)
        }).catch(() => {
            setChatLoader(false)
        })
    }

    const onHandleComment = () => {
        onHandleFbComment()
    }

    useEffect(()=>{
        //@ts-ignore
        const userWithActiveCamera = remoteUsers?.filter((user) => !user?._video_muted_)
        setRemoteUserWithActiveCamera(userWithActiveCamera ?? [])
    },[remoteUsers])

    useEffect(()=>{
        setActiveNumberOfCamera((remoteUserWithActiveCamera?.length ?? 0) + (isCameraEnabled ? 1 : 0));
    },[remoteUserWithActiveCamera,isCameraEnabled])

    useEffect(() => {
        const _keyword = localStorage.getItem(LOCAL_STORAGE_KEY.keyword)
        setKeyword(_keyword ?? `${userDetails?.key_words}${userDetails?.key_word_count}`)
    }, [userDetails])

    useEffect(()=>{
        const _selectedProduct = localStorage.getItem(LOCAL_STORAGE_KEY.selectedProduct);
        _selectedProduct ?  setDefaultProduct(JSON.parse(_selectedProduct)) : setDefaultProduct(product)
    },[product]);

    const onCloseEndModal = () => {
        setIsEndPopup(false)
    };

    const handleEndLiveStream = (isDelete: boolean) => {
        if (!isDelete) return;
        _endCall()
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // Cancel the event to prevent the browser tab from closing
            event.preventDefault();
            // Chrome requires a return value for the event
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Cleanup: Remove the event listener when the component unmounts
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" , block: "end"});
    }, [comments,filteredComments]);

    // Check if devices are still loading
    const deviceLoading = isLoadingMic || isLoadingCam;

    useEffect(()=>{
        switch(commentFilter) {
            case 'all':
                setFilteredComments(comments)
                break;
            case 'with_keyword':
                setFilteredComments(comments.filter(comment => comment.is_keyword))
                break;
            case 'without_keyword':
                setFilteredComments(comments.filter(comment => !comment.is_keyword))
                break;
            default:
                setFilteredComments(comments)
                break;
        }
    },[commentFilter,comments])

    const updateVideoDevices = () => {
        AgoraRTC.getDevices().then((devices) => {
          const videoInputDevices = devices.filter((device) => device.kind === "videoinput");
          setVideoDevices(videoInputDevices);

          if (videoInputDevices.length > 0) {
            const integratedDevice = videoInputDevices.find((device) => device.label.toLowerCase().includes("integrated webcam"));
            if (integratedDevice) {
              setSelectedVideoDeviceId(integratedDevice.deviceId);
            } else {
              setSelectedVideoDeviceId(videoInputDevices[0].deviceId);
            }
          }
        });
    };

    useEffect(() => {
      // Initial device setup
      updateVideoDevices();

      // Set up event listener for device changes
      const handleDeviceChange = () => {
        updateVideoDevices();
      };

      navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
      
      // Cleanup event listener on component unmount
      return () => {
        navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      };
    }, []);

    useEffect(()=>{
        if (localCameraTrack && selectedVideoDeviceId) {
            dispatch(setLoadingState(true));
            localCameraTrack.setDevice(selectedVideoDeviceId).then(()=>{
                dispatch(setLoadingState(false));
            }).catch(() => {
                dispatch(setLoadingState(false));
                updateVideoDevices();
                toast.error(Message.FAILED_TO_SWITCH_CAMERA);
            });
        }
    },[localCameraTrack,selectedVideoDeviceId])
    
    const handleVideoDeviceChange = (deviceId: string) => {
        setSelectedVideoDeviceId(deviceId);
        setIsCameraDropDownOpen(false); 
      };

    // Render the AgoraProvider and associated UI components
    return (
        <div className="video-platform-golive-inner">
            {
                deviceLoading &&
                <div className="loader-spin">
                    <div className="circle"></div>
                    <div className="loading-text">Device loading
                        <span className="dot-one"> .</span>
                        <span className="dot-two"> .</span>
                        <span className="dot-three"> .</span>
                    </div>
                </div>
            }
            <AgoraProvider localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack}>
                <div className="live-data-row spacing-10">
                    <div className="video-top-bar">
                        <div className="live-tag tagbg">
                            <span className="live-icon icon"></span>
                            <span className="tag">Live</span>
                        </div>
                        <ul className="list-unstyled liveStream-data">
                            {/* <li>
                                <div className="tag-bar tagbg">
                                    <span className="icon-instagram icon"></span>
                                    <span className="tag">{viewes.insta}</span>
                                </div>
                            </li>
                            <li>
                                <div className="tag-bar tagbg">
                                    <span className="icon-facebook icon"></span>
                                    <span className="tag">{viewes.fb}</span>
                                </div>
                            </li> */}
                            <li>
                                <div className="tag-bar tagbg">
                                    <span className="icon-time icon"></span>
                                    <span className="tag">{`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</span>
                                </div>
                            </li>
                        </ul>
                        <div className="live-tag tagbg endLive" onClick={() => setIsEndPopup(true)}>
                            <span className="tag">End Live</span>
                        </div>
                    </div>
                </div>
                <div className="row main-row">
                    <div className="showing-col">
                        <div className="showing-col-inner border-box border-box-with-heading spacing-20">
                            <h4 className="heading-bar">Showing Now</h4>
                            <div className="row border-box-row spacing-10">
                                <div className="left-img">
                                    <Image alt="Selected Product" width={85} height={85}  src={selectedProduct?.images?.[0]?.url ?? defaultProduct?.images?.[0]?.url ?? ""} style={{objectFit:"contain"}} />
                                </div>
                                <div className="right-desc">
                                    <h4 className="">{selectedProduct?.name ?? defaultProduct?.name}</h4>
                                    {(selectedProduct?.size || defaultProduct?.size) && <p>Size : <span className="">{selectedProduct?.size ?? defaultProduct?.size}</span></p>}
                                    {(selectedProduct?.color || defaultProduct?.color) && <p>Color : <span className="">{selectedProduct?.color ?? defaultProduct?.color}</span></p>}
                                </div>
                            </div>
                            <div className="price-box">
                                <h4 className="priceTag">$ {selectedProduct?.price ?? defaultProduct?.price}</h4>
                                <div className=""><Link href={selectedProduct?.url ?? defaultProduct?.url ?? ""} target="_blank" className="btn btn-primary btn-sm">View Product</Link></div>
                            </div>
                        </div>
                        {
                            (userType === 'influencer' || isWhiInfluencer) &&
                            <Fragment>
                                <h4 className="titlebar spacing-10">In This Video</h4>
                                <div className="searchbar spacing-10">
                                    <form action="">
                                        <div className="search-form-group">
                                            <div className="form-group-password">
                                                <input className="form-control" type="text" placeholder="Search Products"
                                                    onChange={(e) => onSearch(e?.target?.value)}
                                                />
                                                <span className="icon-search password-icon"></span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Fragment>
                        }
                        <div className="products-col">
                            <div className="products-col-inner">
                                {
                                    (userType === 'influencer' || isWhiInfluencer) &&
                                    <Fragment>
                                        {
                                            data?.fetchProducts?.data?.productData?.map((i: Product) => (
                                                <div className="border-box spacing-10" key={i?.uuid}
                                                    onClick={() => onSelectProduct(i?.uuid as string)}>
                                                    <div className="row border-box-row spacing-10">
                                                        <div className="left-img">
                                                            <Image src={i?.images?.[0]?.url ?? ""} width={85} height={85} alt="Product Image" style={{objectFit:"contain"}}/>
                                                        </div>
                                                        <div className="right-desc">
                                                            <h4 className="">{i?.name}</h4>
                                                            {i?.size && <p>Size : <span className="">{i?.size}</span></p>}
                                                            {i?.color && <p>Color : <span className="">{i?.color}</span></p>}
                                                        </div>
                                                    </div>
                                                    <div className="price-box">
                                                        <h4 className="priceTag">$ {i?.price}</h4>
                                                        <div className=""><Link href={i?.url ?? ""} target="_blank" className="btn btn-primary btn-sm btn-white">View Product</Link></div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {
                                            !data?.fetchProducts?.data?.productData?.length &&
                                            <p>No Product Found</p>
                                        }
                                    </Fragment>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="video-col">
                        <div className={`video-call-inner video-visible-${activeNumberOfCamera.toString()}`}>
                            {isViewProductStrip && <div className="video-topblcok">
                                <div className="video-detail-bar">
                                    <div className="video-titlebar">
                                        <h3 className="spacing-10">{keyword ?? selectedProduct?.name ?? defaultProduct?.name}</h3>
                                        <div className="sub-desc">
                                            {(selectedProduct?.size || defaultProduct?.size) && <p className="sub-title">Sizes: {selectedProduct?.size ?? defaultProduct?.size}</p>}
                                            {(selectedProduct?.color || defaultProduct?.color) && <p className="sub-title colordesc"><span>Colors: </span><span>{selectedProduct?.color ?? defaultProduct?.color}</span></p>}
                                        </div>
                                    </div>
                                    <div className="video-imgbar">
                                        <Image width={56} height={56}  src={selectedProduct?.images?.[0]?.url ?? defaultProduct?.images?.[0]?.url ?? ""} alt="Selected Product"  style={{objectFit:"contain"}} />
                                        <span className="p-price">$ {selectedProduct?.price ?? defaultProduct?.price}</span>
                                    </div>
                                </div>
                            </div>}
                            {localCameraTrack?.enabled && <LocalVideoTrack track={localCameraTrack} play={true} className="video-item" />}
                            {(remoteUserWithActiveCamera as IAgoraRTCRemoteUser[]).map((remoteUser) => (
                                <div className='video-item' key={remoteUser.uid}>
                                    <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
                                </div>
                            ))}
                            <ul className="video-controls-list list-unstyled">
                              <li>
                                <div className="video-controls-dropdown" ref={dropdownRef}>
                                    <div className={`video-controls-dropdown-button ${isCameraDropDownOpen ? 'open' : ''}`} onClick={() => setIsCameraDropDownOpen(!isCameraDropDownOpen)}><span className="icon-arrow-up"></span></div>
                                    <ul className={`video-controls-dropdown-list ${isCameraDropDownOpen ? 'open' : ''}`}>
                                        {videoDevices.map(device => (
                                              <li className={`${selectedVideoDeviceId === device.deviceId ? 'active' : ''}`}  key={device.deviceId} value={device.deviceId} onClick={() => handleVideoDeviceChange(device.deviceId)}>
                                                  {device.label || `Camera ${device.deviceId}`}
                                              </li>
                                        ))}
                                    </ul>
                                </div>
                                <button onClick={() => audioVideoController("video")} disabled={isLoadingCam} type="button" className="video-controls-button">
                                  <span className={`${isCameraEnabled ? "icon-video" : "icon-video-no"}`}></span>
                                </button>
                              </li>
                              <li>
                                <button onClick={() => audioVideoController("audio")} disabled={isLoadingMic || !isCameraEnabled} type="button" className={`video-controls-button ${(isLoadingMic || !isCameraEnabled) ? 'disabled' : ''}`} title={isCameraEnabled ? '' : 'Please turn on the camera to enable microphone.'}>
                                  <span className={`${isMicEnabled ? "icon-sound-plus" : "icon-sound-minus"}`}></span>
                                </button>
                              </li>
                              <li>
                                <button type="button" onClick={() => audioVideoController("product")} disabled={isLoadingMic || !isCameraEnabled} className={`video-controls-button ${(isLoadingMic || !isCameraEnabled) ? 'disabled' : ''}`} title={isCameraEnabled ? '' : 'Please turn on the camera to enable product control.'}>
                                  <span className={`${isViewProductStrip ? "icon-eye-alt" : "icon-eye-alt-slash"}`}></span>
                                </button>
                              </li>
                            </ul>
                        </div>
                    </div>
                    <div className="chat-col">
                        <div className="chat-col-inner border-box border-box-with-heading">
                            <div className="spacing-20 heading-bar">
                                <h4>Chat</h4>
                                {
                                    !broadcastId &&
                                    <div className="select-field filter-chat">
                                        <select className="form-control small" name="select-facebook"
                                            defaultValue={commentFilter}
                                            onChange={(e) => onSelect(e?.target?.value)}
                                        >
                                            <option value='all'>ALL</option>
                                            <option value='with_keyword'>WITH_KEYWORD</option>
                                            <option value='without_keyword'>WITHOUT_KEYWORD</option>
                                        </select>
                                        <span className="icon-down"></span>
                                    </div>
                                }
                            </div>
                            <div className="chat-wrapper">
                                <div className="chat-wrapper-inner">
                                    {
                                        filteredComments?.map((i: FbInstaComment) => (
                                            <Fragment key={i?.uuid}>
                                                <div className="chat-card" key={i?.uuid}>
                                                    <div className="chat-card-inner" >
                                                        <div className="chat-img">
                                                            <Image width={32} height={32} alt="Avatar"  src={IMAGE_PATH.avatar}  style={{objectFit:"contain"}}/>
                                                        </div>
                                                        <div className="chat-detail">
                                                            <div className="person-name-bar spacing-10">
                                                                <span className="pname">{i?.user_social_name}</span>
                                                                <span className="chat-time">
                                                                    {/* <span className={`${i?.comments_platform === 'Instagram' ? 'icon-instagram icon-instagram-gradient' : 'icon-facebook'} icon`}></span> */}
                                                                    {i?.comments_platform === 'Instagram' && <span className="icon icon-instagram icon-instagram-gradient"></span>}
                                                                    {i?.comments_platform === 'Facebook' && <span className="icon icon-facebook"></span>}
                                                                    {i?.comments_platform === 'Youtube' && 
                                                                    <Image className="icon"  src={IMAGE_PATH.youtubeLogo}  alt="youtube icon" width={13} height={13} layout={'fit'} objectFit={'contain'}/>
                                                                    }
                                                                      {i?.comments_platform === 'TikTok' && <span className="icon icon-tiktok"></span>}
                                                                    {moment(i?.created_at).format(DATE_TIME_FORMAT.format2)}
                                                                </span>

                                                            </div>
                                                            <div className="message-bar">
                                                                <p>{i?.comments}</p>
                                                            </div>
                                                            {
                                                                (i?.comments_platform !== 'Instagram' && !i?.is_other_post_comment) &&
                                                                <div className="reply-bar">
                                                                    <span className="reply" onClick={() => {
                                                                        setCommentType({
                                                                            commentId: i?.comment_id,
                                                                            replyTo: `Reply to ${i?.user_social_name}`
                                                                        })
                                                                    }}>Reply</span>
                                                                    <span className="likes"></span>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        i?.replies?.map((reply: FbInstaComment) => (
                                                            <div className="chat-card sub-thread" key={reply?.uuid}>
                                                                <div className="chat-card-inner" >
                                                                    <div className="chat-img">
                                                                        <Image width={32} height={32} alt="Avatar" src={IMAGE_PATH.avatar}  style={{objectFit:"contain"}}/>
                                                                    </div>
                                                                    <div className="chat-detail">
                                                                        <div className="person-name-bar spacing-10">
                                                                            <span className="pname">{reply?.user_social_name}</span>
                                                                            <span className="chat-time">{moment(reply?.created_at).format(DATE_TIME_FORMAT.format2)}</span>
                                                                        </div>
                                                                        <div className="message-bar">
                                                                            <p>{reply?.comments}</p>
                                                                        </div>
                                                                        {
                                                                            (i?.comments_platform !== 'Instagram' && !i?.is_other_post_comment) &&
                                                                            <div className="reply-bar">
                                                                                <span className="reply" onClick={() => {
                                                                                    setCommentType({
                                                                                        commentId: i?.comment_id,
                                                                                        replyTo: `Reply to ${i?.user_social_name}`
                                                                                    })
                                                                                }}>Reply</span>
                                                                                <span className="likes"></span>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                            </Fragment>
                                        ))
                                    }
                                    <div ref={commentsEndRef}></div>
                                </div>
                                {
                                    chatLoader &&
                                    <ChatLoader isText={true}/>
                                }
                            </div>
                            <div className="comment-box">
                                <div className="comment-inner">
                                    <div className="comment-group spacing-10">
                                        {
                                            commentType?.commentId !== '' &&
                                            <Fragment>
                                                <p>{commentType?.replyTo}</p>
                                                <hr />
                                            </Fragment>
                                        }
                                        <textarea name="Enter Your Comment" className="form-control"
                                            onChange={(e) => setComment(e.target.value)}
                                            value={comment}
                                            placeholder={commentType?.commentId != '' ? 'Enter Your Reply' : 'Enter Your Comment'}></textarea>
                                    </div>
                                    <div className="button-group">
                                        {
                                            commentType?.commentId !== '' &&
                                            <button className="btn btn-secondary btn-sm"
                                                onClick={() => setCommentType({
                                                    commentId: '',
                                                    replyTo: ''
                                                })}
                                            >Cancel Reply</button>
                                        }
                                        {
                                            commentType?.commentId !== '' ?
                                                <button className={`btn btn-primary btn-sm ${(chatLoader || !comment) ? 'disable' : ''}`}
                                                    disabled={chatLoader || !comment} onClick={onHandleReply}>Reply</button> :
                                                <button
                                                    className={`btn btn-primary btn-sm ${(chatLoader || !comment) ? 'disable' : ''}`}
                                                    disabled={chatLoader || !comment} onClick={onHandleComment}>Publish comment</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AgoraProvider>
            <DeletePopup
                onClose={onCloseEndModal}
                isDelete={handleEndLiveStream}
                message="Are you sure you want to end live stream ?"
                isShow={isEndPopup}
            />
        </div>
    );
};

// Export the AgoraManager component as the default export
export default AgoraManager;