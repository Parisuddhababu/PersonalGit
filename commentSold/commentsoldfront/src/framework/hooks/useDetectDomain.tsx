import { DOMAIN_STRING_ARRAY, LOCAL_STORAGE_KEY } from "@/constant/common";
import { DomainType } from "@/types/hooks";
import { useEffect, useState } from "react";

const useDetectDomain = () => {
    const [domainType, setDomainType] = useState<DomainType>('Influencer')

    useEffect(() => {
        const hostname = window.location.hostname;
        const domainString = DOMAIN_STRING_ARRAY;
        const subdomain = hostname?.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').split('.');

        if (subdomain.includes('whi')) {
            localStorage.setItem(LOCAL_STORAGE_KEY.brandName, 'whi');
            setDomainType('WHIBrand')
            return
        }
        localStorage.removeItem(LOCAL_STORAGE_KEY.brandName);
        if (subdomain.every((element) => domainString.includes(element))) {
            setDomainType('Influencer')
        } else {
            setDomainType('Brand')
        }
    }, []);

    return domainType
}

export default useDetectDomain