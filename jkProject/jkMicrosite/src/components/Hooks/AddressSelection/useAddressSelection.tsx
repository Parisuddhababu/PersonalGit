import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const useAddressSelection = () => {
    const [shipping, setShipping] = useState<string>('')
    const [billing, setBilling] = useState<string>('')

    useEffect(() => {
        if (Cookies.get('shippingAddress'))
            setShipping(Cookies.get('shippingAddress') as string);
        if (Cookies.get('billingAddress'))
            setBilling(Cookies.get('billingAddress') as string);
    }, [])

    const setShippingAddress = (id: string) => {
        setShipping(id)
        Cookies.set('shippingAddress', id)
    }
    const setBillingAddress = (id: string) => {
        setBilling(id)
        Cookies.set('billingAddress', id)
    }
    return {
        setShippingAddress,
        setBillingAddress,
        shipping,
        billing
    }
}

export default useAddressSelection
