import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export const useAnchorNavigation = (html = null) => {
    const elementRef = useRef()
    const history = useRouter()
    useEffect(() => {
        if (!elementRef.current) {
            return
        }
        elementRef.current.querySelectorAll('a').forEach((anchor) => {
            try {
                if (anchor.target || !anchor.href) {
                    return
                }
                let url = new URL(anchor.href)
                if (url.origin !== window.location.origin) {
                    return
                }
                const clickListener = (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    history.push(url.href.replace(url.origin, ''))
                }
                anchor.removeEventListener('click', clickListener)
                anchor.addEventListener('click', clickListener)
            } catch (e) {
                console.log(e)
            }
        })
    }, [elementRef.current, html])
    return elementRef
}
