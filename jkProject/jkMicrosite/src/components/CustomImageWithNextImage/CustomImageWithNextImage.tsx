import Image from "next/image";

interface ICustomImageProps {
  src: string;
  width: string;
  height: string;
  alt?: string;
  title?: string;
  className?: string;
  pictureClassName?: string;
  key?: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  loading?: "lazy" | "eager" | undefined;
  lazyBoundary?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  layout?: "fill" | "intrinsic" | "fixed" | "responsive";
}

interface OnLoadingComplete {
  naturalWidth: number;
  naturalHeight: number;
}

const CustomImageWithNextImage = ({
  src,
  width,
  height,
  alt,
  priority,
  loading,
  quality,
  unoptimized,
  lazyBoundary,
  placeholder,
  layout,
  blurDataURL,
}: ICustomImageProps) => {
  const myLoader = ({ src, width, quality }: any) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const handleImageLoad = ({
    naturalWidth,
    naturalHeight,
  }: OnLoadingComplete) => {
    console.log(naturalWidth, naturalHeight);
  };

  return (
    <>
      <Image
        loader={myLoader}
        src={src}
        alt={alt}
        width={height}
        height={width}
        priority={priority}
        quality={quality}
        unoptimized={unoptimized}
        loading={loading}
        lazyBoundary={lazyBoundary}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        layout={layout}
        onLoadingComplete={handleImageLoad}
      />
    </>
  );
};

export default CustomImageWithNextImage;
