import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import { CropImageProps } from "../../util";
import "react-image-crop/dist/ReactCrop.css";
import "./crop.css";

const CropImage: React.FC<CropImageProps> = (props) => {
  const { selectedImage, setSelectedImage, src, setOpen, setOpenPopup } = props;
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false); // New state variable

  // Function to convert data URL to File object
  const dataURLtoFile = (dataurl: string): File | null => {
    const filename = `recording_thumbnail_${new Date().getTime()}.png`;
    const arr = dataurl.split(',');
    const mime = arr[0].split(':')[1].split(';')[0];
    const bstr = window.atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    if (!completedCrop || !imgRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const image: HTMLImageElement | null = imgRef.current;

    if (!image) {
      return;
    }
    const crop = completedCrop;

    const scaleX: number = image.naturalWidth / image.width;
    const scaleY: number = image.naturalHeight / image.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    const baseFile: string = canvas.toDataURL("image/png");

    setCroppedImage(baseFile);
  }, [completedCrop]);

  //handle cropping Functionality
  const handleCrop = useCallback(() => {
    const cropImageUrl = dataURLtoFile(croppedImage) as string | null;
    setSelectedImage(cropImageUrl as string);
    setOpen(false);
    if (croppedImage) {
      setSelectedImage(croppedImage);
    }
    setOpenPopup(false);
  }, [croppedImage]);

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          // You don't need to pass a complete crop into
          // makeAspectCrop or centerCrop.
          unit: "%",
          width: 0,
        },
        0,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  //start cropping image
  const handleCropStart = useCallback(() => {
    setIsCropping(true);
  }, []);


  const onCompleteCrop = useCallback((c: Crop) => {
    if (!c || c?.width === 0 || c?.height === 0) {
      return;
    }
    setCompletedCrop(c);
  }, []);

  return (
    <Box
      width={"100%"}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {selectedImage && (
        <Box
          width={"100%"}
          sx={{ display: "flex", flexDirection: "row" }}
          gap={"15px"}
        >
          <Box width={"50%"} sx={{ img: { width: "100%" } }}>
            <Typography
              variant="h6"
              sx={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
            >
              Crop Image
            </Typography>
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              onComplete={onCompleteCrop}
              onDragStart={handleCropStart} // Handle crop start
              aspect={1} // Set the aspect ratio for cropping (square in this case)
            >
              <img ref={imgRef} src={src} alt="" onLoad={onLoad} id="Img" />
            </ReactCrop>
          </Box>
          <Divider></Divider>
          <Box width={"50%"} sx={{ img: { width: "100%" } }}>
            <Typography
              variant="h6"
              sx={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
            >
              Preview Image
            </Typography>
            <img
              id="Img"
              src={croppedImage ?? selectedImage}
              alt="Cropped"
            />
          </Box>
        </Box>
      )}

      {isCropping && (
        <Button
          variant="contained"
          onClick={handleCrop}
          sx={{ marginBottom: "1rem" }}
        >
          Crop Image
        </Button>
      )}
    </Box>
  );
};

export default CropImage;
