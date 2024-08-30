import CustomImage from "@components/CustomImage/CustomImage";
import Loader from "@components/customLoader/Loader";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import { IMAGE_PATH } from "@constant/imagepath";
import pagesServices from "@services/pages.services";
import { ISignInReducerData } from "@type/Common/Base";
import { getParseUser, setDataInCookies, setDataInLocalStorage } from "@util/common";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";
import { Action_UserDetails } from "src/redux/signIn/signInAction";

// const { showError, showSuccess } = useToast();

const MyaccountComponent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const signedInUserdata = useSelector((state: ISignInReducerData) => state);
  const [profileImage, setProfileImage] = useState('');

  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfileImage(signedInUserdata?.signIn?.userData?.user_detail?.profile_image?.path ? signedInUserdata?.signIn?.userData?.user_detail?.profile_image?.path : IMAGE_PATH.userProfile);
    // eslint-disable-next-line
  }, []);

  const uploadImage = async (event: any) => {
    // @ts-ignore
    dispatch(setLoader(true));
    let files: FileList = event.target.files;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const file: File = files[0]; // file

    // return if file upload has cancel from file explore
    if (!file) return;

    if (allowedTypes.includes(file.type) === false) {
      // file is not valid then return function
      //   showError("Allow only png, jpg and jpeg");
      return;
    }
    if (file.size / 1000 / 1024 > APPCONFIG.maxFileSize) {
      //   showError("Maximum " + APPCONFIG.maxFileSize + "MB allowed to upload.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    await uploadFile(files[0]);
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("profile_image", file);
    setIsLoading(true)
    await pagesServices
      .postPage(APICONFIG.PROFILE_IMAGE_API, formData)
      .then((result) => {
        setIsLoading(false)
        if (result && result.meta) {
          // @ts-ignore
          dispatch(setLoader(false));

          const data = result.data[0];
          let parseUser = getParseUser();
          // @ts-ignore
          if (parseUser && parseUser?.user_detail) {
            // @ts-ignore
            parseUser.user_detail.profile_image = data.profile_image;
            // @ts-ignore
            dispatch(Action_UserDetails(parseUser));
            setProfileImage(data.profile_image?.path)
            // @ts-ignore
            let imageData = JSON.parse(localStorage.getItem('auth'));
            imageData.user_detail.profile_image = data.profile_image
            setDataInLocalStorage("auth", imageData, true);
            setDataInCookies("auth", imageData);
          }
        }
      });
  };


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
                  {signedInUserdata?.signIn?.userData?.user_detail?.first_name +
                    " " +
                    signedInUserdata?.signIn?.userData?.user_detail?.last_name}
                </h5>
                <p>
                  {signedInUserdata?.signIn?.userData?.user_detail?.email}
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
