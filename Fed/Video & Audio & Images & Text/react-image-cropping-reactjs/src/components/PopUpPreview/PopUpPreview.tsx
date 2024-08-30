import { Box, Dialog, DialogContent, Divider, IconButton, Typography} from "@mui/material";
import React,{ useCallback, useState } from "react";
import { PopUpPreviewProps } from "../../util";
import CropImage from "../CropImage/CropImage";
import Closemenu from "../Common/CloseMenu/CloseMenu";

const PopUpPreview:React.FC<PopUpPreviewProps>=(props) => {
  const { selectedImage, onClose,setSelectedImage,src,setOpenPopup } = props;
  const [open, setOpen] = useState(true);
  const handleClose = useCallback(() => {
    setOpen(false);
    onClose() // Call the onClose function from props
  }, [onClose]);

  return (
    <Dialog

      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="xl"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "72rem",
          borderRadius: "0",
        },
      }}
    >
      <DialogContent

        sx={{
          padding: {
            xs: "2.625rem 1.5rem 1.5rem",
            md: "2.625rem 1.875rem 1.875rem",
          },
        }}
      >
        <Typography variant="h4">Image Crop </Typography>
        <Divider/>
        {open && (
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "0.5rem",
              right: "1rem",
            }}
          >
            <Closemenu onClick={handleClose}/>
          </IconButton>
        )}
        <Box sx={{display:'flex',flexDirection:'row'}}>
          <CropImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} src={src} setOpen={setOpen} setOpenPopup={setOpenPopup} />
        </Box>

      </DialogContent>
    </Dialog>
  );
};
export default PopUpPreview;
