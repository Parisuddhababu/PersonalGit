import { useEffect, useState } from "react";
import { ICustomImageSilderProps } from "@components/Hooks/products";
import { IImageVideo } from "@type/Pages/productDetails";

const useCustomImageSlider = ({ images, refrence }: ICustomImageSilderProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<IImageVideo>();

  useEffect(() => {
    if (images && images[0]) {
      if (refrence && refrence.current) {
        refrence.current = refrence.current.slice(0, images.length);
      }

      setSelectedImageIndex(0);
      setSelectedImage(images[0]);
    }
    // eslint-disable-next-line
  }, [images]);

  const handleSelectedImageChange = (newIdx: number) => {
    if (images && images.length > 0) {
      setSelectedImage(images[newIdx]);
      setSelectedImageIndex(newIdx);
      if(images[newIdx]?.path){
        var scroller = document.querySelector('#Product-quick-view') || document.querySelector('.product-thumbnail');
        const rect = refrence?.current[newIdx]?.getBoundingClientRect();
        if (scroller) {
          scroller.scrollLeft = rect?.left;
        }
      }
      // if (refrence?.current[newIdx]) {
      //   refrence?.current[newIdx]?.scrollIntoView({
      //     inline: "center",
      //     behavior: "smooth",
      //   });
      // }
    }
  };

  const handleRightClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex + 1;
      if (newIdx >= images.length) {
        newIdx = 0;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  const handleLeftClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex - 1;
      if (newIdx < 0) {
        newIdx = images.length - 1;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  return {
    selectedImageIndex,
    selectedImage,
    handleSelectedImageChange,
    handleRightClick,
    handleLeftClick,
  };
};

export default useCustomImageSlider;
