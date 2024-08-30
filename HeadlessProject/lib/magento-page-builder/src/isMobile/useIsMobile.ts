import { useEffect, useState } from 'react'

const MOBILE_WIDTH = 767

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    const updateOnResize = () => {
        setIsMobile(window.innerWidth <= MOBILE_WIDTH)
    }

    useEffect(() => {
        updateOnResize()
        window.addEventListener('resize', updateOnResize, false)
        return () => window.removeEventListener('resize', updateOnResize, false)
    }, [])

    return isMobile
}
