import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import defaultUser from '@assets/images/default-user-image.png';
import { ROUTES } from '@config/constant';
import { HamburgerMenu } from '@components/icons/icons';
import ProfileModel from '@components/common/profileModel';
import Language from '@components/common/languageModel';
import { HeaderProps } from 'src/types/component';
import i18n from 'src/i18n';
import DecryptionFunction from 'src/services/decryption';

const Header = ({ onClick, logoutConformation }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isShowProfileModel, setIsShowProfileModel] = useState(false);
  const [isShowLanguageModel, setIsShowLanguageModel] = useState(false);
  const [profileNameList, setProfileName] = useState<string | null>();
  const [profileNameLastName, setProfileNameLastName] = useState<string | null>();

  function ProfileModelHandler() {
    setIsShowLanguageModel(false);
    setIsShowProfileModel(prev => !prev);
  }
  const ProfileHandler = useCallback(() => {
    setIsShowProfileModel(false);
    navigate(`/${ROUTES.app}/${ROUTES.profile}`);
  }, []);

  const updateProfileName = () => {
    const newProfileName = localStorage.getItem('valuesList');
    const newProfileLastName = localStorage.getItem('valuesListLastName');

    setProfileName(newProfileName);
    setProfileNameLastName(newProfileLastName);
  };

  useEffect(() => {
    updateProfileName();
    const intervalId = setInterval(updateProfileName, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const encryptedProfileName = localStorage.getItem('profileName') as string;

  const initialValue = encryptedProfileName && DecryptionFunction(encryptedProfileName);
  const languageHandler = useCallback(() => {
    setIsShowProfileModel(false);
    setIsShowLanguageModel(prev => !prev);
  }, [setIsShowLanguageModel, setIsShowProfileModel]);
  const OnClickHandler = useCallback(() => {
    if (onClick) {
      onClick(prev => !prev);
    }
  }, [onClick]);
  return (
    <header className="bg-white  z-10 h-[55px] border-b border-[#c8ced3] px-2 pt-3">
      <nav className="flex items-center " aria-label="Global">
        <div onClick={OnClickHandler} className="sm:hidden">
          <HamburgerMenu className="hover:cursor-pointer mt-[8px] ml-5" fontSize="26px" />
        </div>
        <div className="hidden ml-5 sm:block">
          <ul className="flex items-center">
            <li>
              <NavLink to={`/${ROUTES.app}/${ROUTES.settings}`} className=" font-medium  text-[0.875rem] text-slate-500">
                {t('Settings')}
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex justify-end flex-1">
          <div className="flex items-center justify-end space-x-3">
            <div className="relative cursor-pointer ">
              <a className="text-sm text-gray-600 uppercase" onClick={languageHandler}>
                {i18n.language}
              </a>
              {isShowLanguageModel && <Language onClick={languageHandler} />}
            </div>
            <div className="text-right">
              <p className="font-normal text-[0.875rem]">
                {profileNameList ?? initialValue} {profileNameLastName}
              </p>
            </div>

            <div onClick={() => ProfileModelHandler()}>
              <img className="h-8 rounded-full cursor-pointer " src={defaultUser} alt="" />
            </div>
          </div>
        </div>
      </nav>

      {isShowProfileModel && <ProfileModel profileHandler={ProfileHandler} logoutHandler={logoutConformation} />}
    </header>
  );
};

export default Header;
