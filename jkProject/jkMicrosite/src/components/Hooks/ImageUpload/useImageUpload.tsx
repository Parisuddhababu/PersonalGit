import { useToast } from "@components/Toastr/Toastr";
import { IImageUpload, IImageUploadState } from "@components/Hooks/ImageUpload";
import { useState } from "react";
import APICONFIG from "@config/api.config";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";

const useImageUpload = (props: IImageUpload) => {
  const { showError } = useToast();
  const [formImageData, setFormImageData] = useState<IImageUploadState[]>();
  const { submitFormDataHook } = usePostFormDataHook();


  const onHandleUpload = (event: any, reviewId: string | null = null) => {
    const tempImg: IImageUploadState[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const targetImg = event.target.files[i];
      if (targetImg !== undefined) {
        const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (fileTypes.includes(targetImg.type) === false) {
          resetFileCache();
          showError("Allow only png, jpg and jpeg");
        } else {
          if (targetImg.size / 1000 / 1024 < props.imageSize) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              tempImg.push({
                url: e.target.result,
                noPicture: true,
                obj: targetImg,
              });
              if (reviewId) {
                if (formImageData?.length) {
                  setFormImageData([...formImageData, ...tempImg]);
                } else setFormImageData(tempImg);
              } else setFormImageData(tempImg);
            };
            reader.readAsDataURL(targetImg);
          } else {
            resetFileCache();
            showError("Max upload size " + props.imageSize + " MB");
          }
        }
      }
    }
  };

  const setImages = (data: any) => {
    setFormImageData(data);
  };

  const resetFileCache = () => {
    if (props?.fileUploadRef?.current?.value) {
      props.fileUploadRef.current.value = "";
    }
  };

  const clearImage = () => {
    setFormImageData([]);
  };

  const removeOneImage = async (Img: IImageUploadState) => {
    const index = formImageData?.findIndex((ele) => ele?.obj?.name == Img?.obj?.name);
    if (Img?._id) {
      const response = await submitFormDataHook(
        {
          uuids: Img?._id,
        },
        APICONFIG.REMOVE_IMAGES
      );
      if (response?.meta?.status_code == 200) {
        const temp = [...(formImageData as [])];
        temp.splice(index as number, 1);
        setFormImageData(temp);
      }
    } else {
      const temp = [...(formImageData as [])];
      temp.splice(index as number, 1);
      setFormImageData(temp);
    }
  };

  return {
    formImageData,
    onHandleUpload,
    resetFileCache,
    setImages,
    clearImage,
    removeOneImage,
  };
};

export default useImageUpload;
