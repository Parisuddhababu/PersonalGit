
'use client'
import { FETCH_STREAMING_PLATFORM_DETAILS } from '@/framework/graphql/mutations/multiHost';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AgoraStreaming = dynamic(() => import('@/components/GoLive/AgoraStreaming'), { ssr: false });

const GoLiveSession = () => {
    const { data, loading, error } = useQuery(FETCH_STREAMING_PLATFORM_DETAILS);
    const dispatch = useDispatch();
    const router = useRouter()

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error?.message) {
            toast.error(error?.message)
            router.back()
        }
    }, [loading, error])

    return (
        <div className="video-platform-golive-wrapper">
            {
                data?.fetchStreamPlatformsDetails?.data?.application_key !== undefined &&
                <AgoraStreaming agoraAppId={data?.fetchStreamPlatformsDetails?.data?.application_key} />
            }
        </div>
    )
}

export default GoLiveSession