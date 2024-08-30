'use client'
import { SEND_USER_COMMENT_CLICK } from "@/framework/graphql/mutations/multiHost";
import { SendUserCommentCLickResponse } from "@/types/graphql/pages";
import { useMutation } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react"
export default function Redirects() {
    const params = useSearchParams();
    const hashCode = params.get?.('code');
    const url = params.get?.('url');
    const [sendUserCommentClick] = useMutation(SEND_USER_COMMENT_CLICK);

    useEffect(() => {
        if (!url) {
            return
        }
        window.location.href = url
    }, [url])
    
    useEffect(() => {
        if (!hashCode) {
            return
        }
        sendUserCommentClick({
            variables: {
                hashCode,
                headersInformation: 'ABC'
            }
        }).then((res) => {
            const response = res?.data as SendUserCommentCLickResponse
            
            if (response?.sendUserCommentClick?.data?.product_details?.url) {
                window.location.href = response?.sendUserCommentClick?.data?.product_details?.url
            }
        })
    }, [hashCode])

    return (
        <div>
            <div className="loader-spin">
                <div className="circle"></div>
                <div className="loading-text">Redirecting to product
                    <span className="dot-one"> .</span>
                    <span className="dot-two"> .</span>
                    <span className="dot-three"> .</span>
                </div>
            </div>
        </div>
    )
}