"use client";
import { ROUTES } from '@/config/staticUrl.config';
import { DEFAULT_PRIMARY_COLOR, LABELS, LOCAL_STORAGE_KEY, RESTRICT_URL } from '@/constant/common';
import { IMAGE_PATH } from '@/constant/imagePath';
import { GET_PROFILE } from '@/framework/graphql/queries/myProfile';
import useHandleCMSScroll from '@/framework/hooks/useHandleCMSScroll';
import usePermission from '@/framework/hooks/usePermission';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import { CommonSliceTypes } from '@/framework/redux/redux';
import '@/styles/components/header.scss'
import { IHeaderProps } from '@/types/components';
import { checkToShowHeaderAndFooter, removeAuthCookie, setDynamicDefaultStyle } from '@/utils/helpers';
import { useLazyQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Header = ({ primaryColor }: IHeaderProps) => {
    const pathName = usePathname()
    const [activeMobileMenu, setActiveMobileMenu] = useState(false)
    const [isBuyLive, setIsBuylive] = useState<boolean | null>(null);
    const [hideHeader, setHideHeader] = useState(false);
    const { refetch: getPrimaryColor } = useLazyQuery(GET_PROFILE, { fetchPolicy: 'network-only' })[1];
    const { headerMenu, userDetails, landingPage, userType, isWhiInfluencer, brandName, isUserHaveActivePlan } = useSelector((state: CommonSliceTypes) => state.common)
    const router = useRouter();
    const path = usePathname();
    const { getPermissionList } = usePermission()
    const dispatch = useDispatch();
    useHandleCMSScroll();

    useEffect(() => {
        userDetails?.email ? handlePrimaryColorChange() : setDynamicDefaultStyle(primaryColor);
    }, [path, userDetails])


    useEffect(() => {
        // Check the domain
        const hostname = window.location.hostname;

        // Set the logo based on the domain
        if (hostname?.includes('buy.live')) {
            setIsBuylive(true);
            return
        }
        setIsBuylive(false);
    }, []);

    const handlePrimaryColorChange = async () => {
        dispatch(setLoadingState(true));
        try {
            const primaryColorRes = await getPrimaryColor();
            setDynamicDefaultStyle(primaryColorRes?.data?.getProfile?.data?.primary_color ?? DEFAULT_PRIMARY_COLOR);
            dispatch(setLoadingState(false));
        } catch {
            setDynamicDefaultStyle(DEFAULT_PRIMARY_COLOR);
            dispatch(setLoadingState(false));
        }
    };

    useEffect(() => {
        if (!userDetails?.email) return;
        const PERMISSION_LIST = getPermissionList(brandName, isWhiInfluencer)
        const permissionFor: string = Object.keys(PERMISSION_LIST).filter((key) => isActive(key) === 'active').join("");
        if (permissionFor !== '' ? PERMISSION_LIST[permissionFor].includes(userType) : true) return;
        router.push('/not-found');
    }, [path, userType, userDetails, brandName, isWhiInfluencer, getPermissionList])

    const logOut = async () => {
        localStorage.clear();
        removeAuthCookie();
        localStorage.setItem(LOCAL_STORAGE_KEY.lastRoute, "/");
        window.location.href = 'sign-in'
    };

    const isActive = (route: string) => {
        const baseRoutePattern = new RegExp(`^\/${route}(?:\/.*)?$`);
        return baseRoutePattern.test(pathName) ? 'active' : '';
    }

    const onMobileMenuClick = () => {
        setActiveMobileMenu(prev => !prev)
    }

    const closeMenu = (goLive: boolean = false) => {
        if (goLive) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.isReload)
        }
        setActiveMobileMenu(false)
    }

    useEffect(() => {
        setHideHeader(pathName === '/change-password')
    }, [pathName])

    useEffect(() => {
        router.prefetch(`/${ROUTES.private.myPlans}`)
    }, [router])

    useEffect(() => {
        if (RESTRICT_URL.includes(path) || userType !== 'influencer' || !userDetails?.email || isUserHaveActivePlan) {
            return
        }
        router.push(`/${ROUTES.private.myPlans}`)
    }, [isUserHaveActivePlan, router, path, userDetails, userType])

    if (checkToShowHeaderAndFooter(path)) {
        return null;
    }

    if (landingPage === undefined || hideHeader) {
        return null
    }

    if (headerMenu) {
        return (
            <header id="header" className={`${activeMobileMenu ? 'active' : ''} ${!userDetails?.email ? 'header-2' : ''}`} >
                {
                    !userDetails?.email ?
                        <div className='container-md'>
                            <div className='header-2-row'>
                                <div className="logo left-header">
                                    {
                                        isBuyLive !== null &&
                                        <Link href="/">
                                            <Image className="" src={isBuyLive ? IMAGE_PATH.BuyLiveNewLogo : IMAGE_PATH.WHIMarketingNewLogo} alt="Logo" width={236} height={34} style={{ objectFit: "contain" }} />
                                        </Link>
                                    }

                                </div>
                                {(path !== `/${ROUTES.public.signIn}`) && <div className='btn-group'>
                                    <Link href={`/${ROUTES.public.signIn}`} >
                                        <button className='btn btn-primary btn-sm'>Login / Register</button>
                                    </Link>
                                </div>}
                            </div>
                        </div>
                        :
                        <div className="container-fluid" >
                            <div className="header-inner">
                                <div className="logo left-header">
                                    <Link href="/">
                                        <Image className="" src={IMAGE_PATH.WHIMarketingNewLogo} alt="Logo" width={236} height={34} style={{ objectFit: "contain" }} />
                                    </Link>
                                </div>
                                <nav className="mainmenu right-header active">
                                    <Link href="" aria-label='Menu Items' className="mobilemenu" onClick={onMobileMenuClick}>
                                        {
                                            activeMobileMenu ?
                                                <span className="icon-close" /> :
                                                <span className="icon-align-justify" />
                                        }
                                    </Link>
                                    <ul className={`main-menubar list-unstyled mainnav ${activeMobileMenu ? 'active' : ''}`}>
                                        {
                                            userType === 'brand' &&
                                            <li>
                                                <Link href={`/${ROUTES.private.manageUser}`} onClick={() => closeMenu()} className={isActive(ROUTES.private.manageUser)}>{LABELS.manageUser}</Link>
                                            </li>
                                        }
                                        {
                                            (userType === 'influencer' || isWhiInfluencer) &&
                                            <li>
                                                <Link href={`/${ROUTES.private.goLive}`} onClick={() => closeMenu(true)} className={isActive(ROUTES.private.goLive)}>{LABELS.goLive}</Link>
                                            </li>
                                        }

                                        <li>
                                            <Link href={`/${ROUTES.private.liveSchedule}`} onClick={() => closeMenu()} className={isActive(ROUTES.private.liveSchedule)}>{LABELS.liveSchedule}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/${ROUTES.private.insights}`} className={isActive(ROUTES.private.insights)}>{LABELS.insights}</Link>
                                        </li>
                                        {
                                            userType !== 'brand' &&
                                            <li>
                                                <Link href={`/${ROUTES.private.replayHistory}`} onClick={() => closeMenu()} className={isActive(ROUTES.private.replayHistory)}>{LABELS.replayHistory}</Link>
                                            </li>
                                        }
                                        {
                                            ((userType === 'brand' && brandName !== 'whi') || userType === 'influencer' || isWhiInfluencer) &&
                                            <li>
                                                <Link href={`/${ROUTES.private.catalog}`} onClick={() => closeMenu()} className={isActive(ROUTES.private.catalog)}>{LABELS.catalog}</Link>
                                            </li>
                                        }
                                        <li className='sub-menu'>
                                            <Link href='' className={isActive(ROUTES.private.myAccount) || isActive(ROUTES.private.myPlans)}>
                                                {LABELS.myAccount}<span className="icon-down"></span>
                                            </Link>
                                            <ul className="sub-menu-dropdown">
                                                <li><Link onClick={() => closeMenu()} className={isActive(ROUTES.private.myAccount)} href={`/${ROUTES.private.myAccount}`}>My Profile</Link></li>
                                                {
                                                    (userType !== 'brand-influencer') &&
                                                    <li><Link onClick={() => closeMenu()} className={isActive(ROUTES.private.myPlans)} href={`/${ROUTES.private.myPlans}`}>My Plans</Link></li>
                                                }
                                            </ul>
                                        </li>
                                        <li>
                                            <Link href="" onClick={logOut}>
                                                {LABELS.signOut}
                                            </Link>
                                        </li>
                                        {
                                            !userDetails?.email &&
                                            <li>
                                                <Link href={`/${ROUTES.public.signIn}`} onClick={() => closeMenu()}><span className="icon-user mr-10"></span>{LABELS.signIn} <span className="icon-down" onClick={logOut}></span></Link>
                                            </li>
                                        }
                                    </ul>
                                </nav>
                            </div>
                        </div>
                }
            </header>
        )
    }
    return null
}

export default Header