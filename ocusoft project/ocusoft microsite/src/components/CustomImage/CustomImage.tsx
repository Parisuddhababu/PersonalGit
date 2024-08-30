import React, { useState, useRef } from "react";
import { useIntersection } from "@components/CustomImage/Intersection";

interface ICustomImageProps {
  src: string;
  width: string;
  height: string;
  alt?: string;
  title?: string;
  className?: string;
  pictureClassName?: string;
  key?: string | number;
  sourceClassName?: string;
  imgClassName?: string;
}

const CustomImage = ({ src, width, height, alt, title, pictureClassName, sourceClassName, imgClassName }: ICustomImageProps) => {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLPictureElement>(null);
  
  useIntersection(imgRef, () => {
    setIsInView(true);
  });

  return (
    <picture ref={imgRef} className={pictureClassName}>
      {isInView && (
        <>
          <source srcSet={src} type="image/webp" className={sourceClassName} />
          <source srcSet={src} type="image/jpg" />
          <img
            decoding="async"
            src={src}
            alt={alt}
            title={title}
            height={height.replace("px", "")}
            width={width.replace("px", "")}
            className={imgClassName}
          />
        </>
      )}
    </picture>
  );
};

export default CustomImage;
