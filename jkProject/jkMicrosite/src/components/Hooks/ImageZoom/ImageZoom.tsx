export interface IImageZoom {
  src: string;
  magnifierHeight?: number;
  magnifieWidth?: number;
  zoomLevel?: number;
  imgWidth: number;
  imgHeight: number;
  x: number;
  y: number;
  showMagnifier: boolean;
}

const ImageZoom = ({
  src,
  magnifierHeight = 500,
  magnifieWidth = 700,
  zoomLevel = 3,
  imgWidth,
  imgHeight,
  x,
  y,
  showMagnifier,
}: IImageZoom) => {
  return (
    <>
      <div
        className="img-zoom-custom-img"
        style={{
          display: showMagnifier ? "" : "none",
          height: magnifierHeight,
          width: magnifieWidth,
          backgroundImage: `url('${src}')`,
          //calculate zoomed image size
          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
          //calculete position of zoomed image.
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      ></div>
    </>
  );
};

export default ImageZoom;
