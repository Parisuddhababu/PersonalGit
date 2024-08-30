import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { SideBarProps } from 'src/types/component';
import {
  AngleLeft,
  AngleRight,
  Reports,
  EducationEngagement,
  EquipmentMaintenance,
  Management,
  Logout,
  AngleDown,
  AngleUp,
  Category,
  Home,
  Alerts,
  Location,
  AnnouncementIco,
  DiversionAdminIcon,
  ReportsTracking,
  ProfileIcon,
  Settings,
} from '@components/icons/icons';
import { API_BASE_URL, IMAGE_BASE_URL, ROUTES, RedirectPages, USER_TYPE } from '@config/constant';
import logo from '@assets/images/sidebar-logo.png';
import RespLogo from '@assets/images/sidebar-logo-resp.png';
import { useSelector } from 'react-redux';
import { UserProfileType, UserRoles } from 'src/types/common';
import { useQuery } from '@apollo/client';
import { GET_ANNOUNCEMENT_COUNT } from '@framework/graphql/queries/admin';
import { NavlinkReturnFunction } from '@utils/helpers';

const NormalSideBar = ({ menuHandler, setToggleImage, logoutConformation }: SideBarProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [firstLevelSidebar, setFirstLevelSidebar] = useState(false);
  const [secondLevelSidebar, setSecondLevelSidebar] = useState(false);
  const [thirdLevelSidebar] = useState(false);
  const [fourthLevelSidebar, setFourthLevelSidebar] = useState(false);
  const [fifthLevelSidebar, setFifthLevelSidebar] = useState(false);
  const [sixthLevelSidebar, setSixthLevelSidebar] = useState(false);
  const [sevenLevelSidebar, setSevenLevelSidebar] = useState(false);
  const [eighthLevelSidebar, setEighthLevelSidebar] = useState(false);
  const [ninthLevelSidebar, setNinthLevelSidebar] = useState(false);
  const [tenthLevelSidebar, setTenthLevelSidebar] = useState(false);
  const [elevenLevelSidebar, setElevenLevelSidebar] = useState(false);
  const [twelfthLevelSidebar, setTwelfthLevelSidebar] = useState(false);
  const [categoryLevelSidebar, setCategoryLevelSidebar] = useState(false);
  const [userManagementLevelSidebar, setUserManagementLevelSidebar] = useState(false);
  const [customerSupportLevelSidebar, setCustomerSupportLevelSidebar] = useState(false);
  const [announcementLevelSidebar, setAnnouncementLevelSidebar] = useState(false);
  const [settingsLevelSidebar, setSettingsLevelSidebar] = useState(false);
  const [diversionSettingsLevelSidebar, setDiversionSettingsLevelSidebar] = useState(false);
  const [sitesLevelSidebar, setSitesLevelSidebar] = useState(false);
  const [wasteAuditLevelSidebar, setWasteAuditLevelSidebar] = useState(false);
  const [toggler, setToggler] = useState(false);
  const [iconShower, setIconShower] = useState(true);
  const sidebarRef = useRef<HTMLUListElement>(null);
  const { show } = useSelector((state: { coursesManagement: { show: boolean } }) => state.coursesManagement);
  const {
    rolePermission,
    category,
    userManagement,
    tenant,
    contractor,
    employee,
    subscriberManagement,
    technicalManualsGuides,
  } = useSelector(
    (state: {
      rolesManagement: {
        rolePermission: UserRoles;
        category: UserRoles;
        subscriberManagement: UserRoles;
        technicalManualsGuides: UserRoles;
        companyDirectory: UserRoles;
        userManagement: UserRoles;
        employee: UserRoles;
        tenant: UserRoles;
        contractor: UserRoles;
      };
    }) => state.rolesManagement,
  );
  const { userProfileData, readAnnouncement } = useSelector(
    (state: { userProfile: { userProfileData: UserProfileType; readAnnouncement: boolean } }) => state.userProfile,
  );
  const { data, refetch: announcementRefetch } = useQuery(GET_ANNOUNCEMENT_COUNT);

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const locationChanger = useCallback(
    (Redirect: string, className: string) => {
      return location.pathname.includes(Redirect) ? `${className}` : '';
    },
    [location],
  );

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);

  useEffect(() => {
    if (screenSize.width < 1280) {
      setIconShower(true);
    }
  }, [screenSize.width]);

  useEffect(() => {
    if (secondLevelSidebar || firstLevelSidebar || thirdLevelSidebar) {
      const handleBodyClick = () => {
        if (screenSize.width < 1280) {
          menuHandler(prev => !prev);
        }
      };
      document.getElementById('aside')?.addEventListener('click', handleBodyClick);
      return () => {
        document.getElementById('aside')?.removeEventListener('click', handleBodyClick);
      };
    }
  }, [show, secondLevelSidebar, firstLevelSidebar, thirdLevelSidebar]);

  const toggleHandler = () => {
    setToggler(prev => !prev);
    setToggleImage(prev => !prev);
    setIconShower(!iconShower);
  };

  const profilePictureLogo = userProfileData?.getProfile?.data?.profile_picture ?? '';
  const companyId = userProfileData?.getProfile?.data?.company_id?.uuid ?? '';
  const branchId = userProfileData?.getProfile?.data?.branch_locations?.[0]?.uuid ?? '';
  const userType = userProfileData?.getProfile?.data?.user_type ?? '';
  const subscriberUUID = userProfileData?.getProfile?.data?.subscriber_id?.uuid;
  const subscriberMainLogo = userProfileData?.getProfile?.data?.subscriber_id?.logo ?? '';
  const subscriberThumbnail = userProfileData?.getProfile?.data?.subscriber_id?.thumbnail ?? '';

  const onAlert = useCallback(() => {
    if (userType !== USER_TYPE.SUPER_ADMIN || userType !== USER_TYPE.SUBSCRIBER_ADMIN) {
      navigate(`/${ROUTES.app}/${ROUTES.announcement}`);
    }
  }, [userType]);

  useEffect(() => {
    if (readAnnouncement) {
      announcementRefetch();
    }
  }, [readAnnouncement]);

  return (
    <div className="flex flex-col justify-end">
      {/* "menu-horizontal" add remove according to sidebar design */}
      <aside
        id="aside"
        className={`fixed z-50 max-xs:h-[calc(100%-72px)] h-[calc(100%-76px)] ${iconShower ? 'xl:min-w-[318px]' : 'xl:min-w-[81px]'} ${show ? 'min-w-full h-[calc(100%-76px)] max-xl:translate-x-0' : 'max-xl:-translate-x-full'
          }  xl:h-full bg-opacity-30 backdrop-blur-sm  bg-sidebar xl:bg-accent  text-white xl:sticky transition-all duration-300 box-border max-xs:top-[72px] top-[76px] xl:top-[auto] bottom-[0px] xl:bottom-[auto]`}
      >
        {screenSize.width > 1280 && (
          <button
            className="absolute -right-4 z-1 bg-white text-primary p-[10px] top-[30px] rounded-full border border-solid border-border-light-grey drop-shadow-arrow-shadow hidden sm:block"
            onClick={toggleHandler} title={`${t('toggle sidebar')}`}
          >
            {toggler ? <AngleRight className="" fontSize="13px" /> : <AngleLeft className="" fontSize="13px" />}
          </button>
        )}
        <ul
          ref={sidebarRef}
          className="sidebar-li [&::-webkit-scrollbar-track]:bg-accent h-full max-w-[500px] w-[calc(100%-70px)] xl:w-full xl:min-w-full fixed xl:max-h-full overflow-y-auto xl:overflow-hidden xl:hover:overflow-y-auto bg-accent box-border flex flex-col"
        >
          <Link to={NavlinkReturnFunction(userType, USER_TYPE.SUPER_ADMIN, `/${ROUTES.app}/${ROUTES.dashboard}`, `/${ROUTES.app}/${ROUTES.subscriber}`)}>
            {iconShower ? (
              <img className="max-h-[60px] max-w-[227px] mx-auto my-5" src={(userType !== USER_TYPE.SUPER_ADMIN) ? (process.env.REACT_APP_IMAGE_BASE_URL + '/' + subscriberMainLogo) : logo} alt="LogoImageSidebar" />
            ) : (
              <img className="max-h-[47px] mx-auto my-5" src={(userType !== USER_TYPE.SUPER_ADMIN) ? (process.env.REACT_APP_IMAGE_BASE_URL + '/' + subscriberThumbnail) : RespLogo} alt="LogoImageSidebar" />
            )}
          </Link>
          <li className="flex-auto">
            <ul>
              {iconShower && (
                <div className="flex items-center justify-start font-normal mx-5 mb-2 rounded-xl text-xs-14 text-light-grey hover:bg-primary hover:text-white">
                  <li className="w-full">
                    <NavLink
                      to={ROUTES.myAccount}
                      className={`flex items-center gap-2.5 p-5 bg-dark-blue rounded-t-xl ${iconShower ? '' : 'px-2 py-3 justify-center'
                        } ${locationChanger(RedirectPages.myAccount, 'bg-primary text-white')}`}
                    >
                      <picture>
                        <img
                          src={profilePictureLogo ? IMAGE_BASE_URL + profilePictureLogo : logo}
                          alt="Profile"
                          title="Profile"
                          width="50"
                          height="50"
                          className="object-contain h-[50px] w-[50px] min-w-[50px] rounded-full"
                        />
                      </picture>
                      <div className="flex flex-col gap-2.5">
                        <span className="overflow-hidden break-all text-border-primary line-clamp-2">
                          {userProfileData?.getProfile?.data?.first_name + ' ' + userProfileData?.getProfile?.data?.last_name}
                        </span>
                        <span className="text-xs text-light-grey">{userProfileData?.getProfile?.data?.role_name}</span>
                      </div>
                    </NavLink>
                    <div className="py-2.5 px-5 bg-navy-blue rounded-b-xl flex justify-between cursor-pointer" onClick={() => onAlert()}>
                      <span className="flex items-center gap-2.5 text-sm">
                        <Alerts fontSize="20" />
                        <span>Alerts</span>
                      </span>
                      <span className="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-error">
                        {data?.getAnnouncementCount?.data?.count}
                      </span>
                    </div>
                  </li>
                </div>
              )}
              {!iconShower && (
                <NavLink
                  to={ROUTES.myAccount}
                  className={`flex items-center justify-start mx-2.5 mb-5 font-normal rounded-xl text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                    }`}
                >
                  <li>
                    <div className="p-1 mx-auto mb-5 rounded-lg">
                      <picture>
                        <img
                          src={profilePictureLogo ? API_BASE_URL + profilePictureLogo : logo}
                          alt="Profile"
                          title="Profile"
                          width="40"
                          height="40"
                          className="object-contain h-full mx-auto rounded-full min-w-[40px] min-h-[40px]"
                        />
                      </picture>
                    </div>
                    <div className="relative flex items-center justify-center max-w-[50px] mx-auto">
                      <span className={`text-light-grey ${locationChanger(RedirectPages.myAccount, 'text-white')}`}>
                        <Alerts fontSize="25" />
                      </span>
                      <span className="absolute right-0 -top-1.5">
                        <span className="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-error">{data?.getAnnouncementCount?.data?.count}</span>
                      </span>
                    </div>
                  </li>
                </NavLink>
              )}
              {userType !== USER_TYPE.SUPER_ADMIN && <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                <NavLink
                  to={ROUTES.dashboard}
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                    } ${locationChanger(RedirectPages.dashBoard, 'bg-primary text-white')}`}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <Home />
                  </span>
                  {iconShower && <span> {t('Dashboard')}</span>}
                </NavLink>
              </li>}
              
              {subscriberUUID && (
                <li
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                    } ${sixthLevelSidebar ? 'sub-menu-active' : ''}`}
                  onClick={() => setSixthLevelSidebar(prev => !prev)}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <EducationEngagement />
                  </span>
                  {iconShower && (
                    <>
                      <span className="text-sm">{t('Education & Training')} </span>
                      {sixthLevelSidebar ? (
                        <span className="ml-auto">
                          <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      ) : (
                        <span className="ml-auto">
                          <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      )}
                    </>
                  )}
                </li>
              )}
              {sixthLevelSidebar && iconShower && (
                <>
                  {subscriberUUID && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.myAssignments}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.myAssignments,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Training Dashboard')} </span>
                      </NavLink>
                    </li>
                  )}
                  {subscriberUUID && (
                    <li className="sub-list">
                      <NavLink
                        to={ROUTES.allCourses}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.allCourses,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('All Courses')}</span>
                      </NavLink>
                    </li>
                  )}
                  {subscriberUUID && (userType === USER_TYPE.SUPER_ADMIN || userType === USER_TYPE.SUBSCRIBER_EMPLOYEE) && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.educationAndEngagement}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.educationAndEngagement,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Create a Course')} </span>
                      </NavLink>
                    </li>
                  )}
                  {userType === USER_TYPE.SUBSCRIBER_ADMIN && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.educationAndEngagement}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.educationAndEngagement,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Create a Course')} </span>
                      </NavLink>
                    </li>
                  )}
                  {([USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) || userProfileData?.getProfile?.data?.is_course_creator) &&
                    <li className='sub-list'>
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.draftsManagement}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.draftsManagement,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span>{t('Course Drafts')}</span>
                      </NavLink>
                    </li>}
                  {([USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) || userProfileData?.getProfile?.data?.is_course_creator) &&
                    <li className='sub-list'>
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.archivesManagement}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.archivesManagement,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span>{t('Course Archives')}</span>
                      </NavLink>
                    </li>}
                  {subscriberUUID && (userType === USER_TYPE.SUPER_ADMIN || userType === USER_TYPE.SUBSCRIBER_EMPLOYEE) && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.playlist}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.playlist,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Manage Course Playlists')} </span>
                      </NavLink>
                    </li>
                  )}

                  {userType === USER_TYPE.SUBSCRIBER_ADMIN && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.playlist}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.playlist,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Manage Course Playlists')} </span>
                      </NavLink>
                    </li>
                  )}

                  {userType === USER_TYPE.SUBSCRIBER_ADMIN &&
                    <li
                      className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${iconShower ? 'mx-5' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                        } ${sevenLevelSidebar ? 'sub-menu-active' : ''}`}
                      onClick={() => setSevenLevelSidebar(prev => !prev)}
                    >
                      {iconShower && (
                        <>
                          <span className="text-sm">{t('Settings')} </span>
                          {sevenLevelSidebar ? (
                            <span className="ml-auto">
                              <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                            </span>
                          ) : (
                            <span className="ml-auto">
                              <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                            </span>
                          )}
                        </>
                      )}
                    </li>
                  }
                  {sevenLevelSidebar && <>
                    {userType === USER_TYPE.SUBSCRIBER_ADMIN &&
                      <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                        <NavLink
                          to={`/${ROUTES.app}/${ROUTES.courseAdminList}`}
                          className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                            RedirectPages.courseAdmin,
                            'font-semibold text-white',
                          )}`}
                        >
                          <span>{t('Add Course Administrators')}</span>
                        </NavLink>
                      </li>}
                    <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.courseCreatorList}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.courseCreator,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span>{t('Add Course Creator')}</span>
                      </NavLink>
                    </li>

                  </>}
                </>
              )}
              {!subscriberUUID && (
                <li
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                    } ${secondLevelSidebar ? 'sub-menu-active' : ''}`}
                  onClick={() => setSecondLevelSidebar(prev => !prev)}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <EducationEngagement />
                  </span>
                  {iconShower && (
                    <>
                      <span className="mr-1 text-sm">{t('Education & Training')} </span>
                      {secondLevelSidebar ? (
                        <span className="ml-auto">
                          <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      ) : (
                        <span className="ml-auto">
                          <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      )}
                    </>
                  )}
                </li>
              )}
              {secondLevelSidebar && iconShower && (
                <>
                  {!subscriberUUID && (
                    <li className="sub-list">
                      <NavLink
                        to={ROUTES.allCourses}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.allCourses,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('All Courses')}</span>
                      </NavLink>
                    </li>
                  )}
                  {!subscriberUUID && ([USER_TYPE.SUPER_ADMIN, USER_TYPE.SUBSCRIBER_EMPLOYEE, USER_TYPE.SUBSCRIBER_ADMIN].includes(userType)) && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.educationAndEngagement}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.educationAndEngagement,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Create a Course')} </span>
                      </NavLink>
                    </li>
                  )}

                  {([USER_TYPE.SUPER_ADMIN].includes(userType) || userProfileData?.getProfile?.data?.is_course_creator) &&
                    <li className='sub-list'>
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.draftsManagement}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.draftsManagement,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span>{t('Course Drafts')}</span>
                      </NavLink>
                    </li>}

                  {([USER_TYPE.SUPER_ADMIN].includes(userType) || userProfileData?.getProfile?.data?.is_course_creator) && <li className='sub-list'>
                    <NavLink
                      to={`/${ROUTES.app}/${ROUTES.archivesManagement}`}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                        RedirectPages.archivesManagement,
                        'font-semibold text-white',
                      )}`}
                    >
                      <span>{t('Course Archives')}</span>
                    </NavLink>
                  </li>}
                  {(subscriberUUID ? category?.read && subscriberUUID : category?.read) && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.category}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.category,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Manage Course Tags')} </span>
                      </NavLink>
                    </li>
                  )}
                </>
              )}
              {[USER_TYPE.SUPER_ADMIN].includes(userType) && <li
                className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                  } ${twelfthLevelSidebar ? 'sub-menu-active' : ''}`}
                onClick={() => setTwelfthLevelSidebar(prev => !prev)}
              >
                <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                  <DiversionAdminIcon />
                </span>
                {iconShower && (
                  <>
                    <span className="mr-1 text-sm">{t('Diversion Report Categories')} </span>
                    {twelfthLevelSidebar ? (
                      <span className="ml-auto">
                        <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    ) : (
                      <span className="ml-auto">
                        <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    )}
                  </>
                )}
              </li>}
              {twelfthLevelSidebar && iconShower && (
                <>
                  <li className="sub-list">
                    <NavLink
                      to={ROUTES.volumeManagement}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white  ${locationChanger(RedirectPages.volumeManagement, 'font-semibold text-white')}`}
                    >

                      {iconShower && <span> {t('Volume')}</span>}
                    </NavLink>
                  </li>
                  <li className="sub-list">
                    <NavLink
                      to={ROUTES.equipmentManagement}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white  ${locationChanger(RedirectPages.equipmentManagement, 'font-semibold text-white')}`}
                    >

                      {iconShower && <span> {t('Equipment')}</span>}
                    </NavLink>
                  </li>
                  <li className="sub-list">
                    <NavLink
                      to={ROUTES.materialManagement}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white   ${locationChanger(RedirectPages.materialManagement, 'font-semibold text-white')}`}
                    >

                      {iconShower && <span> {t('Material')}</span>}
                    </NavLink>
                  </li>
                  <li className="sub-list">
                    <NavLink
                      to={ROUTES.frequencyManagement}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white  ${locationChanger(RedirectPages.frequencyManagement, 'font-semibold text-white')}`}
                    >
                      {iconShower && <span> {t('Frequency')}</span>}
                    </NavLink>
                  </li>
                </>)}
              {subscriberUUID && technicalManualsGuides?.read && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={ROUTES.itemByCategory}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.itemByCategory, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <Reports />
                    </span>
                    {iconShower && <span> {t('Manuals & Guides')} </span>}
                  </NavLink>
                </li>
              )}
              
              {/* report sidebar  */}
              {[USER_TYPE.SUBSCRIBER_ADMIN, USER_TYPE.DIVERSION_ADMIN, USER_TYPE.SUBSCRIBER_CONTRACTOR, USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR].includes(userType) && <li
                className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                  } ${tenthLevelSidebar ? 'sub-menu-active' : ''}`}
                onClick={() => setTenthLevelSidebar(prev => !prev)}
              >
                <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                  <DiversionAdminIcon />
                </span>
                {iconShower && (
                  <>
                    <span className="mr-1 text-sm">{t('Diversion Reports')} </span>
                    {tenthLevelSidebar ? (
                      <span className="ml-auto">
                        <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    ) : (
                      <span className="ml-auto">
                        <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    )}
                  </>
                )}
              </li>}
              {tenthLevelSidebar && iconShower && (
                <>
                  {[USER_TYPE.SUBSCRIBER_ADMIN, USER_TYPE.DIVERSION_ADMIN].includes(userType) && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.viewReports}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(RedirectPages.viewReports, 'font-semibold text-white')}`}
                      >
                        {iconShower && <span> {t('View Reports')}</span>}
                      </NavLink>
                    </li>
                  )}

                  {[USER_TYPE.SUBSCRIBER_ADMIN, USER_TYPE.DIVERSION_ADMIN].includes(userType) && <li className="sub-list">
                    <NavLink
                      to={`/${ROUTES.app}/${ROUTES.diversionReportList}`}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                        RedirectPages.diversionReportList,
                        'font-semibold text-white',
                      )}`}
                    >
                      <span> {t('Service List')} </span>
                    </NavLink>
                  </li>}

                  {[USER_TYPE.SUBSCRIBER_ADMIN, USER_TYPE.DIVERSION_ADMIN].includes(userType) && (
                    <li >
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.diversionContractor}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white 
                          ${locationChanger(RedirectPages.diversionContractor, 'font-semibold text-white')}`}
                      >
                        {iconShower && <span> {t('Assigned Services')}</span>}
                      </NavLink>
                    </li>
                  )}
                  {[USER_TYPE.SUBSCRIBER_CONTRACTOR, USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR].includes(userType) && <li className="sub-list">
                    <NavLink
                      to={`/${ROUTES.app}/${ROUTES.weightList}`}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                        RedirectPages.weightList,
                        'font-semibold text-white',
                      )}`}
                    >
                      <span> {t('Add Weights')} </span>
                    </NavLink>
                  </li>}
                  {subscriberUUID &&
                    (userType === USER_TYPE.SUBSCRIBER_ADMIN ||
                      userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ||
                      userType === USER_TYPE.SUBSCRIBER_CONTRACTOR) && (
                      <li
                        className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                          } ${ninthLevelSidebar ? 'sub-menu-active' : ''}`}
                        onClick={() => setNinthLevelSidebar(prev => !prev)}
                      >
                        <span className={`${iconShower ? 'text-xl mr-8' : 'text-xl-25'}`} />
                        {iconShower && (
                          <>
                            <span className="text-sm">{t('Manage Invoice')} </span>
                            {ninthLevelSidebar ? (
                              <span className="ml-auto">
                                <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                              </span>
                            ) : (
                              <span className="ml-auto">
                                <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                              </span>
                            )}
                          </>
                        )}
                      </li>
                    )}
                  {ninthLevelSidebar && iconShower && (
                    <>
                      {subscriberUUID &&
                        (userType === USER_TYPE.SUBSCRIBER_ADMIN ||
                          userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ||
                          userType === USER_TYPE.SUBSCRIBER_CONTRACTOR) && (
                          <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                            <NavLink
                              to={`/${ROUTES.app}/${ROUTES.downloadInvoice}`}
                              className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                                RedirectPages.downloadInvoice,
                                'font-semibold text-white',
                              )}`}
                            >
                              <span> {t('Download Invoice')} </span>
                            </NavLink>
                          </li>
                        )}
                      {subscriberUUID && contractor?.read && companyId && userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR && (
                        <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.uploadInvoice}/?company_uuid=${companyId}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.uploadInvoice,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span> {t('Upload Invoice')} </span>
                          </NavLink>
                        </li>
                      )}
                      {subscriberUUID && contractor?.read && companyId && userType === USER_TYPE.SUBSCRIBER_CONTRACTOR && (
                        <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.uploadInvoice}/?company_uuid=${companyId}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.uploadInvoice,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span> {t('Upload Invoice')} </span>
                          </NavLink>
                        </li>
                      )}
                    </>
                  )}
                  {[USER_TYPE.DIVERSION_ADMIN, USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) && <li
                    className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${iconShower ? 'mx-5' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                      } ${diversionSettingsLevelSidebar ? 'sub-menu-active' : ''}`}
                    onClick={() => setDiversionSettingsLevelSidebar(prev => !prev)}
                  >
                    {iconShower && (
                      <>
                        <span className="text-sm">{t('Settings')} </span>
                        {diversionSettingsLevelSidebar ? (
                          <span className="ml-auto">
                            <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                          </span>
                        ) : (
                          <span className="ml-auto">
                            <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                          </span>
                        )}
                      </>
                    )}
                  </li>}
                  {diversionSettingsLevelSidebar && <>

                    {[USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) && (
                      <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                        <NavLink
                          to={`/${ROUTES.app}/${ROUTES.diversionAdminManagement}`}
                          className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(RedirectPages.diversionAdminManagement, 'font-semibold text-white')}`}
                        >
                          {iconShower && <span> {t('Add Report Administrator')}</span>}
                        </NavLink>
                      </li>)}
                    {[USER_TYPE.DIVERSION_ADMIN, USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) && <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.diversionSettings}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.diversionSettings,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Report Frequency')} </span>
                      </NavLink>
                    </li>}
                  </>}
                </>
              )}
              
                {[USER_TYPE.SUBSCRIBER_CONTRACTOR,USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR,USER_TYPE.SUBSCRIBER_ADMIN].includes(userType)&&<li
                className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                  } ${wasteAuditLevelSidebar ? 'sub-menu-active' : ''}`}
                onClick={() => setWasteAuditLevelSidebar(prev => !prev)}
              >
                <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                  <ReportsTracking />
                </span>
                {iconShower && (
                  <>
                    <span className="text-sm">{t('Waste Audits')} </span>
                    {eighthLevelSidebar ? (
                      <span className="ml-auto">
                        <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    ) : (
                      <span className="ml-auto">
                        <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    )}
                  </>
                )}
              </li>}
              {wasteAuditLevelSidebar&&
                <>
                {subscriberUUID && companyId && userType === USER_TYPE.SUBSCRIBER_CONTRACTOR && (
                  <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                    <NavLink
                      to={`${ROUTES.createWasteAuditReportUI}/?company_uuid=${companyId}`}
                      className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:text-white 
                         ${locationChanger(RedirectPages.createWasteAuditReportUI, 'font-semibold text-white')}`}
                    >
                       <span> {t('Create Waste Audit Report')}</span>
                    </NavLink>
                  </li>
                )}
                  {subscriberUUID && companyId && userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR && (
                    <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                      <NavLink
                        to={`${ROUTES.createWasteAuditReportUI}/?company_uuid=${companyId}`}
                        className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:text-white 
                           ${locationChanger(RedirectPages.createWasteAuditReportUI, 'font-semibold text-white')}`}
                      >
                         <span> {t('Create Waste Audit Report')}</span>
                      </NavLink>
                    </li>
                  )}
                  {subscriberUUID &&
                    (userType === USER_TYPE.SUBSCRIBER_ADMIN ||
                      userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ||
                      userType === USER_TYPE.SUBSCRIBER_CONTRACTOR) && (
                      <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                        <NavLink
                          to={`${ROUTES.wasteAudit}`}
                          className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:text-white
                           ${locationChanger(RedirectPages.wasteAudit, 'font-semibold text-white')}`}
                        >
                           <span> {t('Download Waste Audit Report')}</span>
                        </NavLink>
                      </li>
                    )}
                </>
              }
              
              {technicalManualsGuides?.read && !subscriberUUID && (
                <li
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                    } ${firstLevelSidebar ? 'sub-menu-active' : ''}`}
                  onClick={() => setFirstLevelSidebar(prev => !prev)}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <Reports />
                  </span>
                  {iconShower && (
                    <>
                      <span className="mr-1 text-sm">{t('Manuals & Guides')} </span>
                      {firstLevelSidebar ? (
                        <span className="ml-auto">
                          <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      ) : (
                        <span className="ml-auto">
                          <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      )}
                    </>
                  )}
                </li>
              )}
              {firstLevelSidebar && iconShower && (
                <>
                  {!subscriberUUID && technicalManualsGuides?.read && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.itemByCategory}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.itemByCategory,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('All Manuals & Guides')} </span>
                      </NavLink>
                    </li>
                  )}
                  {!subscriberUUID && technicalManualsGuides?.read && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.subTechnicalManualsGuides}/${ROUTES.userManual}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.userManual,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Add a Document')} </span>
                      </NavLink>
                    </li>
                  )}
                  <li
                    className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                      } ${categoryLevelSidebar ? 'sub-menu-active' : ''}`}
                    onClick={() => setCategoryLevelSidebar(prev => !prev)}
                  >
                    {iconShower && (
                      <>
                        <span className="mr-1 text-sm">{t('Categories')} </span>
                        {categoryLevelSidebar ? (
                          <span className="ml-auto">
                            <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                          </span>
                        ) : (
                          <span className="ml-auto">
                            <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                          </span>
                        )}
                      </>
                    )}
                  </li>
                  {categoryLevelSidebar && <>
                    {!subscriberUUID && technicalManualsGuides?.write && (
                      <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                        <NavLink
                          to={`/${ROUTES.app}/${ROUTES.technicalManualsGuides}`}
                          className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                            } ${locationChanger(RedirectPages.technicalManualsGuides, 'font-semibold text-white')}`}
                        >
                          <span className={`${iconShower ? 'text-xl mr-12' : 'text-xl-25'}`} />
                          {iconShower && <span> {t('Manage Category')}</span>}
                        </NavLink>
                      </li>
                    )}
                    {!subscriberUUID && technicalManualsGuides?.write && (
                      <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                        <NavLink
                          to={`/${ROUTES.app}/${ROUTES.subTechnicalManualsGuides}`}
                          className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                            } ${locationChanger(RedirectPages.subTechnicalManualsGuides, 'font-semibold text-white')}`}
                        >
                          <span className={`${iconShower ? 'text-xl mr-12' : 'text-xl-25'}`} />
                          {iconShower && <span> {t('Manage Sub-Category')}</span>}
                        </NavLink>
                      </li>
                    )}
                  </>}
                </>
              )}
              {(subscriberUUID ? subscriberManagement?.read && subscriberUUID && userType === USER_TYPE.SUPER_ADMIN : subscriberManagement?.read && userType === USER_TYPE.SUPER_ADMIN) && (
                <li
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                    } ${userManagementLevelSidebar ? 'sub-menu-active' : ''}`}
                  onClick={() => setUserManagementLevelSidebar(prev => !prev)}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <ProfileIcon />
                  </span>
                  {iconShower && (
                    <>
                      <span className="text-sm">{t('Manage Subscribers')} </span>
                      {userManagementLevelSidebar ? (
                        <span className="ml-auto">
                          <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      ) : (
                        <span className="ml-auto">
                          <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      )}
                    </>
                  )}
                </li>
              )}
              {userManagementLevelSidebar && iconShower && <>
                <li >
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.subscriber}`}
                    className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.subscriber, 'font-semibold text-white')}`}
                  >
                    <span>{'All Subscribers'} </span>
                  </NavLink>
                </li>
                <li >
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.subscriber}/add`}
                    className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.addSubscriber, 'font-semibold text-white')}`}
                  >
                    <span>{'Add New Subscriber'} </span>
                  </NavLink>
                </li>
                {!subscriberUUID && rolePermission?.read && (
                <li >
                  <NavLink
                    to={ROUTES.rolePermissions}
                    className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey  hover:text-white 
                       ${locationChanger(RedirectPages.rolePermissions, 'font-semibold text-white')}`}
                  >
                    <span> {t('User Roles & Rights')}</span>
                  </NavLink>
                </li>
              )}
              </>}
              {subscriberUUID && userType === USER_TYPE.SUBSCRIBER_ADMIN && (
                <li
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                    } ${sitesLevelSidebar ? 'sub-menu-active' : ''}`}
                  onClick={() => setSitesLevelSidebar(prev => !prev)}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <Location />
                  </span>
                  {iconShower && (
                    <>
                      <span className="mr-1 text-sm">{t('Manage Sites')} </span>
                      {sitesLevelSidebar ? (
                        <span className="ml-auto">
                          <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      ) : (
                        <span className="ml-auto">
                          <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      )}
                    </>
                  )}
                </li>
              )}
              {sitesLevelSidebar && <>
                <li className='sub-list' >
                  <NavLink
                    to={ROUTES.locationManagement}
                    className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:text-white
                       ${locationChanger(RedirectPages.locationManagement, 'font-semibold text-white')}`}
                  >
                    <span> {t('Manage Locations')}</span>
                  </NavLink>
                </li>
                <li className='sub-list' >
                  <NavLink
                    to={ROUTES.zone}
                    className={`flex items-center justify-start font-normal rounded-xl ml-14 p-4 text-xs-14 text-light-grey hover:text-white 
                       ${locationChanger(RedirectPages.ZoneManagement, 'font-semibold text-white')}`}
                  >
                    <span> {t('Manage Zones')}</span>
                  </NavLink>
                </li>
              </>}
              {subscriberUUID &&
                // (userManagement?.read || employee?.read || rolePermission?.read || ( ( tenant?.read && [USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN].includes(userType)) || (contractor?.read&&[USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR].includes(userType)) )) && (
              (userType === USER_TYPE.SUBSCRIBER_EMPLOYEE ? (tenant?.read || contractor?.read || employee?.read) : userType === USER_TYPE.SUBSCRIBER_ADMIN)&&(
                  <li
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                      } ${fourthLevelSidebar ? 'sub-menu-active' : ''}`}
                    onClick={() => setFourthLevelSidebar(prev => !prev)}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <Management />
                    </span>
                    {iconShower && (
                      <>
                        <span className="text-sm">{t('Manage Users')} </span>
                        {fourthLevelSidebar ? (
                          <span className="ml-auto">
                            <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                          </span>
                        ) : (
                          <span className="ml-auto">
                            <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                          </span>
                        )}
                      </>
                    )}
                  </li>
                )}
              {fourthLevelSidebar && iconShower && (
                <>

                  {subscriberUUID &&
                    (userType === USER_TYPE.SUBSCRIBER_EMPLOYEE ? (tenant?.read || contractor?.read || employee?.read) : userType === USER_TYPE.SUBSCRIBER_ADMIN) && (
                      <li
                        className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                          } ${fifthLevelSidebar ? 'sub-menu-active' : ''}`}
                        onClick={() => setFifthLevelSidebar(prev => !prev)}
                      >
                        <span className={`${iconShower ? 'text-xl mr-8' : 'text-xl-25'}`} />
                        {iconShower && (
                          <>
                            <span className="text-sm">{t('Manage Users')} </span>
                            {fifthLevelSidebar ? (
                              <span className="ml-auto">
                                <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                              </span>
                            ) : (
                              <span className="ml-auto">
                                <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                              </span>
                            )}
                          </>
                        )}
                      </li>
                    )}
                  {fifthLevelSidebar && iconShower && (
                    <>
                      {subscriberUUID && (userType === USER_TYPE.SUBSCRIBER_EMPLOYEE ? employee?.read : userType === USER_TYPE.SUBSCRIBER_ADMIN) && (
                        <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                          <NavLink
                            to={ROUTES.employeeUser}
                            className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                              } ${locationChanger(RedirectPages.employeeUser, 'bg-primary text-white')}`}
                          >
                            <span className={`${iconShower ? 'text-xl mr-12' : 'text-xl-25'}`} />
                            {iconShower && <span> {t('Manage Users')}</span>}
                          </NavLink>
                        </li>
                      )}
                      {subscriberUUID && (userType === USER_TYPE.SUBSCRIBER_EMPLOYEE ? tenant?.read : userType === USER_TYPE.SUBSCRIBER_ADMIN) && (
                        <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                          <NavLink
                            to={ROUTES.tenantManagement}
                            className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                              } ${locationChanger(RedirectPages.tenantManagement, 'bg-primary text-white')}`}
                          >
                            <span className={`${iconShower ? 'text-xl mr-12' : 'text-xl-25'}`} />
                            {iconShower && <span> {t('Manage Tenants')}</span>}
                          </NavLink>
                        </li>
                      )}
                      {subscriberUUID &&
                        (userType === USER_TYPE.SUBSCRIBER_EMPLOYEE ? contractor?.read : userType === USER_TYPE.SUBSCRIBER_ADMIN) && (
                          <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                            <NavLink
                              to={ROUTES.contractorManagement}
                              className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                                } ${locationChanger(RedirectPages.contractorManagement, 'bg-primary text-white')}`}
                            >
                              <span className={`${iconShower ? 'text-xl mr-12' : 'text-xl-25'}`} />
                              {iconShower && <span> {t('Manage Contractors')}</span>}
                            </NavLink>
                          </li>
                        )}
                    </>
                  )}
                 
                  {subscriberUUID &&
                    (userType === USER_TYPE.SUBSCRIBER_EMPLOYEE ? (tenant?.read || contractor?.read || employee?.read) : userType === USER_TYPE.SUBSCRIBER_ADMIN) && (
                      <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                        <NavLink
                          to={`/${ROUTES.app}/${ROUTES.createNewAccount}/?employees-user-list=true`}
                          className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                            } ${locationChanger(RedirectPages.rolePermissions, 'bg-primary text-white')}`}
                        >
                          <span className={`${iconShower ? 'text-xl mr-8' : 'text-xl-25'}`} />
                          {iconShower && <span> {t('Add New User')}</span>}
                        </NavLink>
                      </li>
                    )}
                     {[USER_TYPE.SUPER_ADMIN, USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) && subscriberUUID && rolePermission?.read && (
                    <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                      <NavLink
                        to={ROUTES.rolePermissions}
                        className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                          } ${locationChanger(RedirectPages.rolePermissions, 'bg-primary text-white')}`}
                      >
                        <span className={`${iconShower ? 'text-xl mr-8' : 'text-xl-25'}`} />
                        {iconShower && <span> {t('User Roles & Rights')}</span>}
                      </NavLink>
                    </li>
                  )}

                  {/* {subscriberUUID && (userType === USER_TYPE.SUBSCRIBER_ADMIN || userType === USER_TYPE.SUPER_ADMIN || userProfileData?.getProfile?.data?.is_course_creator) && (
                    <li
                      className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                        } ${eighthLevelSidebar ? 'sub-menu-active' : ''}`}
                      onClick={() => setEighthLevelSidebar(prev => !prev)}
                    >
                      <span className={`${iconShower ? 'text-xl mr-8' : 'text-xl-25'}`} />
                      {iconShower && (
                        <>
                          <span className="text-sm">{t('Manage Courses')} </span>
                          {eighthLevelSidebar ? (
                            <span className="ml-auto">
                              <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                            </span>
                          ) : (
                            <span className="ml-auto">
                              <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                            </span>
                          )}
                        </>
                      )}
                    </li>
                  )} */}
                  {/* {eighthLevelSidebar && iconShower && (
                    <>
                      {subscriberUUID && (userType === USER_TYPE.SUPER_ADMIN || userType === USER_TYPE.SUBSCRIBER_EMPLOYEE) && (
                        <li className="sub-list">
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.educationAndEngagement}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.educationAndEngagement,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span> {t('Create New Course')} </span>
                          </NavLink>
                        </li>
                      )}
                      {userType === USER_TYPE.SUBSCRIBER_ADMIN && (
                        <li className="sub-list">
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.educationAndEngagement}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.educationAndEngagement,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span> {t('Create New Course')} </span>
                          </NavLink>
                        </li>
                      )}
                      {subscriberUUID && (userType === USER_TYPE.SUPER_ADMIN || userType === USER_TYPE.SUBSCRIBER_EMPLOYEE) && (
                        <li className="sub-list">
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.playlist}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.playlist,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span> {t('Playlist Management')} </span>
                          </NavLink>
                        </li>
                      )}

                      {userType === USER_TYPE.SUBSCRIBER_ADMIN && (
                        <li className="sub-list">
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.playlist}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.playlist,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span> {t('Playlist Management')} </span>
                          </NavLink>
                        </li>
                      )}
                      {userType === USER_TYPE.SUBSCRIBER_ADMIN &&
                        <li className='sub-list'>
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.courseCreatorList}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.courseCreator,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span>{t('Course Creator Management')}</span>
                          </NavLink>
                        </li>}
                      {userType === USER_TYPE.SUBSCRIBER_ADMIN &&
                        <li className='sub-list'>
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.courseAdminList}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.courseAdmin,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span>{t('Course Admin Management')}</span>
                          </NavLink>
                        </li>}
                      {([USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) || userProfileData?.getProfile?.data?.is_course_creator) &&
                        <li className='sub-list'>
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.draftsManagement}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.draftsManagement,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span>{t('Drafts Management')}</span>
                          </NavLink>
                        </li>}
                      {([USER_TYPE.SUBSCRIBER_ADMIN].includes(userType) || userProfileData?.getProfile?.data?.is_course_creator) &&
                        <li className='sub-list'>
                          <NavLink
                            to={`/${ROUTES.app}/${ROUTES.archivesManagement}`}
                            className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                              RedirectPages.archivesManagement,
                              'font-semibold text-white',
                            )}`}
                          >
                            <span>{t('Archives Management')}</span>
                          </NavLink>
                        </li>}


                    </>
                  )} */}
                </>
              )}
              {/* {companyDirectory?.read && !subscriberUUID && (
                <li
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                    } ${sevenLevelSidebar ? 'sub-menu-active' : ''}`}
                  onClick={() => setSevenLevelSidebar(prev => !prev)}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <CompaniesDirectory />
                  </span>
                  {iconShower && (
                    <>
                      <span className="mr-1 text-sm">{t('Companies Directory Management')} </span>
                      {fifthLevelSidebar ? (
                        <span className="ml-auto">
                          <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      ) : (
                        <span className="ml-auto">
                          <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      )}
                    </>
                  )}
                </li>
              )} */}
              {/* {sevenLevelSidebar && iconShower && !subscriberUUID && companyDirectory?.read && (
                <>
                  {companyDirectory?.read && !subscriberUUID && (
                    <li className="sub-list">
                      <NavLink
                        to={ROUTES.companiesDirectoryManagement}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.companiesDirectoryManagement,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Companies Directory Management')}</span>
                      </NavLink>
                    </li>
                  )}
                  {companyDirectory?.read && !subscriberUUID && (
                    <li className="sub-list">
                      <NavLink
                        to={`/${ROUTES.app}/${ROUTES.requestedCompany}`}
                        className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white ${locationChanger(
                          RedirectPages.requestedCompany,
                          'font-semibold text-white',
                        )}`}
                      >
                        <span> {t('Requested Company List')} </span>
                      </NavLink>
                    </li>
                  )}
                </>
              )} */}

              {/* {companyDirectory?.read && subscriberUUID && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={ROUTES.companiesDirectoryManagement}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.companiesDirectoryManagement, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <CompaniesDirectory />
                    </span>
                    {iconShower && <span> {t('Companies Directory')}</span>}
                  </NavLink>
                </li>
              )} */}
              
              {(subscriberUUID ? subscriberManagement?.read && subscriberUUID && userType !== USER_TYPE.SUPER_ADMIN : subscriberManagement?.read && userType !== USER_TYPE.SUPER_ADMIN) && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.subscriber}`}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white hover:bg-primary ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.subscriber, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <EquipmentMaintenance />
                    </span>
                    {iconShower && <span> {t('Subscribers management')} </span>}
                  </NavLink>
                </li>
              )}

              {subscriberUUID && userManagement?.write && [USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN, USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR].includes(userType) && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.createNewAccount}`}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white hover:bg-primary ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.createNewAccount, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <EquipmentMaintenance />
                    </span>
                    {iconShower && <span> {t('Add Employee')} </span>}
                  </NavLink>
                </li>
              )}
              {subscriberUUID && companyId && userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.tenantDetailsPage}/?company_uuid=${companyId}&branch_id=${branchId}`}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white hover:bg-primary ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.tenantDetailsPage, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <Category />
                    </span>
                    {iconShower && <span> {t('Company Details Page')} </span>}
                  </NavLink>
                </li>
              )}
              {/* {subscriberUUID && tenant?.read && companyId && userType === USER_TYPE.SUBSCRIBER_TENANT && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.tenantDetailsPage}/?company_uuid=${companyId}&branch_id=${branchId}`}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white hover:bg-primary ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.tenantDetailsPage, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <Category />
                    </span>
                    {iconShower && <span> {t('Tenant Details Page')} </span>}
                  </NavLink>
                </li>
              )} */}
              {subscriberUUID && companyId && (userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ) && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.vendorDetails}/?company_uuid=${companyId}&branch_id=${branchId}`}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white hover:bg-primary ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.vendorDetails, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <Category />
                    </span>
                    {iconShower && <span> {t('Company Details')} </span>}
                  </NavLink>
                </li>
              )}
              {/* {subscriberUUID && contractor?.read && companyId && userType === USER_TYPE.SUBSCRIBER_CONTRACTOR && (
                <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.vendorDetails}/?company_uuid=${companyId}&branch_id=${branchId}`}
                    className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:text-white hover:bg-primary ${iconShower ? '' : 'px-2 py-3 justify-center'
                      } ${locationChanger(RedirectPages.vendorDetails, 'bg-primary text-white')}`}
                  >
                    <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                      <Category />
                    </span>
                    {iconShower && <span> {t('Company Details')} </span>}
                  </NavLink>
                </li>
              )} */}
              <li
                className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                  } ${customerSupportLevelSidebar ? 'sub-menu-active' : ''}`}
                onClick={() => setCustomerSupportLevelSidebar(prev => !prev)}
              >
                <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                  <Management />
                </span>
                {iconShower && (
                  <>
                    <span className="mr-1 text-sm">{[USER_TYPE.SUPER_ADMIN].includes(userType) ? 'Customer Support' : 'Support'} </span>
                    {customerSupportLevelSidebar ? (
                      <span className="ml-auto">
                        <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    ) : (
                      <span className="ml-auto">
                        <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    )}
                  </>
                )}
              </li>
              {customerSupportLevelSidebar && iconShower && <>
                {userType === USER_TYPE.SUPER_ADMIN && <li >
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.ticketsList}`}
                    className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(RedirectPages.ticketsList, 'font-semibold text-white')}`}
                  >
                    <span> {t('Support Tickets')}</span>
                  </NavLink>
                </li>}
                {userType !== USER_TYPE.SUPER_ADMIN && (
                  <li >
                    <NavLink
                      to={`/${ROUTES.app}/${ROUTES.customerService}`}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white
                         ${locationChanger(RedirectPages.customerService, 'font-semibold text-white')}`}
                    >
                      <span> {t('Submit a Support Ticket')}</span>
                    </NavLink>
                  </li>
                )}
              </>}
              {(userType === USER_TYPE.SUPER_ADMIN || userType === USER_TYPE.SUBSCRIBER_ADMIN) && (
                <li
                  className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                    } ${announcementLevelSidebar ? 'sub-menu-active' : ''}`}
                  onClick={() => setAnnouncementLevelSidebar(prev => !prev)}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <AnnouncementIco />
                  </span>
                  {iconShower && (
                    <>
                      <span className="mr-1 text-sm">{t('Announcements')} </span>
                      {announcementLevelSidebar ? (
                        <span className="ml-auto">
                          <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      ) : (
                        <span className="ml-auto">
                          <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                        </span>
                      )}
                    </>
                  )}
                </li>
              )}
              {announcementLevelSidebar && iconShower && <>
                {(userType === USER_TYPE.SUPER_ADMIN || userType === USER_TYPE.SUBSCRIBER_ADMIN) && <li className="sub-list">
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.sendAnnouncements}`}
                    className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white  
                      ${locationChanger(RedirectPages.sendAnnouncements, 'font-semibold text-white')}`}
                  >
                    <span> {t('Send Announcement')}</span>
                  </NavLink>
                </li>}
                {(userType === USER_TYPE.SUPER_ADMIN || userType === USER_TYPE.SUBSCRIBER_ADMIN) && (<li className="sub-list">
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.CMS}`}
                    className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white  
                      ${locationChanger(RedirectPages.cms, 'font-semibold text-white')}`}
                  >
                    <span> {t('Announcement Templates')}</span>
                  </NavLink>
                </li>)}
              </>}

              <li
                className={`hidden items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                  } ${elevenLevelSidebar ? 'sub-menu-active' : ''}`}
                onClick={() => { setElevenLevelSidebar(prev => !prev) }}
              >
                <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                  <ReportsTracking />
                </span>
                {iconShower && (
                  <>
                    <span className="mr-1 text-sm">{t('Waste Audit Report')} </span>
                    {elevenLevelSidebar ? (
                      <span className="ml-auto">
                        <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    ) : (
                      <span className="ml-auto">
                        <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    )}
                  </>
                )}
              </li>
              {elevenLevelSidebar && iconShower && (
                <>
                  <li className="sub-list">
                    <NavLink
                      to={ROUTES.createWasteAuditReportUI}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                        RedirectPages.createWasteAuditReportUI,
                        'font-semibold text-white',
                      )}`}
                    >
                      <span> {t('Create Waste Audit Reports')}</span>
                    </NavLink>
                  </li>
                  <li className="sub-list">
                    <NavLink
                      to={ROUTES.wasteAudit}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-xs-14 text-light-grey hover:text-white ${locationChanger(
                        RedirectPages.wasteAudit,
                        'font-semibold text-white',
                      )}`}
                    >
                      <span> {t('Waste Audit Reports')}</span>
                    </NavLink>
                  </li>

                </>
              )}

              <li
                className={`hidden items-center justify-start font-normal rounded-xl p-4 ml-14 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                  } ${elevenLevelSidebar ? 'sub-menu-active' : ''}`}
                onClick={() => setElevenLevelSidebar(prev => !prev)}
              >
                {iconShower && (
                  <>
                    <span className="mr-1 text-sm">{t('Invoice')} </span>
                    {elevenLevelSidebar ? (
                      <span className="ml-auto">
                        <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    ) : (
                      <span className="ml-auto">
                        <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    )}
                  </>
                )}
              </li>
              <li
                className={`flex items-center justify-start font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary mb-2 hover:text-white ${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5 px-2 py-3 justify-center'
                  } ${settingsLevelSidebar ? 'sub-menu-active' : ''}`}
                onClick={() => setSettingsLevelSidebar(prev => !prev)}
              >
                <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                  <Settings />
                </span>
                {iconShower && (
                  <>
                    <span className="mr-1 text-sm">{t('Settings')} </span>
                    {settingsLevelSidebar ? (
                      <span className="ml-auto">
                        <AngleDown className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    ) : (
                      <span className="ml-auto">
                        <AngleUp className={`ml-auto angle-down ${iconShower ? '' : 'hidden'}`} fontSize="12px" />
                      </span>
                    )}
                  </>
                )}
              </li>

              {settingsLevelSidebar && iconShower && <>
                {userType === USER_TYPE.SUPER_ADMIN && (<li className="sub-list">
                  <NavLink
                    to={`/${ROUTES.app}/${ROUTES.SystemCMS}`}
                    className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white  
                       ${locationChanger(RedirectPages.systemCMS, 'font-semibold text-white')}`}
                  >
                    <span> {t('System Email Templates')}</span>
                  </NavLink>
                </li>)}
                {[USER_TYPE.SUPER_ADMIN].includes(userType) && (
                  <li className="sub-list">
                    <NavLink
                      to={ROUTES.landingPageManagement}
                      className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white 
                       ${locationChanger(RedirectPages.landingPageManagement, 'font-semibold text-white')}`}
                    >
                      <span> {t('Manage Landing Page')}</span>
                    </NavLink>
                  </li>
                )}
                <li className="sub-list">
                  <NavLink
                    to={ROUTES.myAccount}
                    className={`flex items-center justify-start font-normal ml-14 p-4 text-[0.875rem] text-light-grey hover:text-white 
                       ${locationChanger(RedirectPages.myAccount, 'font-semibold text-white')}`}
                  >
                    <span> {t('My Account Settings')}</span>
                  </NavLink>
                </li>
              </>}
              <li className={`${iconShower ? 'mx-5 mb-2' : 'mx-2.5 mb-5'}`}>
                <button
                  onClick={() => logoutConformation()}
                  className={`flex items-center justify-start w-full font-normal rounded-xl p-4 text-xs-14 text-light-grey hover:bg-primary hover:text-white ${iconShower ? '' : 'px-2 py-3 justify-center'
                    }`}
                >
                  <span className={`${iconShower ? 'text-xl mr-3' : 'text-xl-25'}`}>
                    <Logout />
                  </span>
                  {iconShower && <span> {t('Logout')}</span>}
                </button>
              </li>
            </ul>
            <div className="pt-4 pb-6 px-7">
              <span
                className={` ${iconShower ? 'opacity-100' : 'opacity-0 hidden'
                  } text-xs transition-[opacity] ease-in-out duration-500 delay-300 leading-[15px] text-light-grey`}
              >
                {t('Powered by ')}
                <span className="text-primary">{t('Terraforma Systems')}</span>
              </span>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default React.memo(NormalSideBar);
