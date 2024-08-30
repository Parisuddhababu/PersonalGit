import axios from "axios";
import { useState } from "react";
import { buildHeaderWithToken } from "src/services/Api";
import * as Constant from "src/shared/constant/constant"
import { useToast } from "src/shared/toaster/Toaster";

export const useEditorImage = () => {
  const [editorImages, setEditorImages] = useState([]);
  const { showError } = useToast();
  const base64regex = /^(data:image)+/;

  const removeEditorUploadedImgURL = async () => {
    editorImages.map(async (ele) => {
      const formData = {
        url: ele,
      };
      const secureHeaders = await buildHeaderWithToken();
      await axios
        .post(Constant.EDITOR_DELETE_IMG, formData, { headers: secureHeaders })
        .then((res) => { });
    });
  };

  const getEditorUploadedImagesURL = async (editorTextdata) => {
    let div = document.createElement("div");
    div.innerHTML = editorTextdata;
    const imagesAttributes = div.getElementsByTagName("img") || [];
    const tempArray = [];
    for (const imgAttr of imagesAttributes) tempArray.push(imgAttr.src);
    setEditorImages([...tempArray]);
  };

  const getEditorImageURL = async (editorTextdata) => {
    let div = document.createElement("div");
    div.innerHTML = editorTextdata;
    const imagesAttributes = div.getElementsByTagName("img") || [];

    for (const imgAttr of imagesAttributes) {
      // Add Image To Server
      const base64Response = await fetch(imgAttr.currentSrc);
      const blob = await base64Response.blob();
      let dataCurrentSrc = imgAttr.currentSrc;

      const formData = new FormData();
      formData.append("image", blob, new Date().getTime() + "_editor_img");
      const imageObj = formData.get("image");
      const imagePattern = new RegExp("image"); // NOSONAR
      const secureHeaders = buildHeaderWithToken();

      if (imagePattern.test(imageObj.type)) {
        await axios
          .post(Constant.EDITOR_UPLOAD_IMG, formData, { headers: secureHeaders })
          .then(async res => {
            dataCurrentSrc = await res.data.data.image.path;
          })
          .catch(() => {
            div = false;
            showError(
              "Something went wrong images was not uploaded properly. Please try again"
            );
          });
      }

      imgAttr.setAttribute("src", dataCurrentSrc);
    }
    return div;
  };

  // Returns the images uploaded on the editor at edit time but removed by the user on update.
  const getEditorUploadedUserRemovedImages = description => {
    let editorUploadedUserRemovedImages = [];
    let div = document.createElement("div");

    div.innerHTML = description;
    const imagesAttributes = div.getElementsByTagName("img") || [];
    const userAddedImages = [];

    for (const imgAttr of imagesAttributes) {
      if (imgAttr?.currentSrc && !base64regex.test(imgAttr.currentSrc)) {
        userAddedImages.push(imgAttr.currentSrc);
      }
    }

    for (const editorImg of editorImages) {
      if (!userAddedImages.includes(editorImg)) {
        editorUploadedUserRemovedImages.push(editorImg);
      }
    }

    return editorUploadedUserRemovedImages;
  }

  // Removes given image Urls from s3 bucket.
  const removeImagesFromBucket = imageUrls => {
    imageUrls.forEach(async imageUrl => {
      if (!base64regex.test(imageUrl)) {
        const formData = { url: imageUrl };
        const secureHeaders = buildHeaderWithToken();

        await axios.post(Constant.EDITOR_DELETE_IMG, formData, { headers: secureHeaders });
      }
    });
  }

  return {
    getEditorUploadedUserRemovedImages,
    removeEditorUploadedImgURL,
    getEditorUploadedImagesURL,
    getEditorImageURL,
    removeImagesFromBucket,
    editorImages
  }
};

export default useEditorImage;