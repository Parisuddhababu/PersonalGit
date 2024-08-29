import CustomImage from "@components/CustomImage/CustomImage";
import Loader from "@components/customLoader/Loader";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import { IMAGE_PATH } from "@constant/imagepath";
import pagesServices from "@services/pages.services";
import { IAPIData, ISignInReducerData } from "@type/Common/Base";
import { getParseUser, setDataInCookies, setDataInLocalStorage } from "@util/common";
import { ChangeEvent,  useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { setLoader } from "src/redux/loader/loaderAction";
import { Action_UserDetails } from "src/redux/signIn/signInAction";

const MyaccountComponent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const signedInUserdata = useSelector((state: ISignInReducerData) => state);
  const [user_detail] = useState(signedInUserdata?.signIn?.userData?.user_detail)
  const [profileImage, setProfileImage] = useState('');

  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const boundActionCreators = bindActionCreators(
    {
      actionUserDetails: Action_UserDetails, // Your action creator
    },
    dispatch
  );
  useEffect(() => {
    setProfileImage(user_detail?.profile_image?.path ? user_detail?.profile_image?.path : IMAGE_PATH.userProfile);
  }, []);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }
    dispatch(setLoader(true));
    let files: FileList = event.target.files;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const file: File = files[0]; // file

    // return if file upload has cancel from file explore
    if (!file) return;

    if (allowedTypes.includes(file.type) === false) {
      // file is not valid then return function
      return;
    }
    if (file.size / 1000 / 1024 > APPCONFIG.maxFileSize) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    await uploadFile(files[0]);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("profile_image", file);
    setIsLoading(true)
    await pagesServices
      .postPage(APICONFIG.PROFILE_IMAGE_API, formData)
      .then((result) => {
        setIsLoading(false)
        if (result && result.meta) {
          dispatch(setLoader(false));

          const data = result.data[0];
          let parseUser = getParseUser();
          if (parseUser && parseUser?.user_detail) {
            parseUser.user_detail.profile_image = data.profile_image;
            boundActionCreators.actionUserDetails(parseUser as IAPIData);;
            setProfileImage(data.profile_image?.path)
            let imageData = JSON.parse(localStorage.getItem('auth') as string);
            imageData.user_detail.profile_image = data.profile_image
            setDataInLocalStorage("auth", imageData, true);
            setDataInCookies("auth", imageData);
          }
        }
      });
  };

  const getFullName = () => `${user_detail?.first_name ?? ''} ${user_detail?.last_name ?? ''}`;


  return (
    <>
      {isLoading && <Loader />}
      <section className="banner-sec">
        <div className="banner-image-wrap"></div>
      </section>
      <section className="avtar_info">
        <div className="container">
          <div className="d-row">
            <div className="d-col d-flex align-item-center just-center">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <CustomImage
                    src={profileImage}
                    alt="imagePreview"
                    title="imagePreview"
                    width="180"
                    height="180"
                  />
                </div>
                <div className="avatar-edit">
                  <label className="jkm-camera">
                    <input
                      type="file"
                      id="imageUpload"
                      accept={APPCONFIG.acceptProfileImage}
                      onChange={uploadImage}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
              <div className="avtar_details">
                <h5>
                  {getFullName()}
                </h5>
                <p>
                  {user_detail?.email}
                  <a className="jkm-pencil" href="/my-profile"></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyaccountComponent;
