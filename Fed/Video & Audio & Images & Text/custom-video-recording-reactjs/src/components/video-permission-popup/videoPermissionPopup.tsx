import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback } from "react";

interface IVideoPermissionProps {
  cameraPermission: boolean;
  modal: boolean;
  setModal: (isOpen: boolean) => void;
}

const VideoPermissionsPopup = ({
  cameraPermission,
  modal,
  setModal,
}: IVideoPermissionProps) => {
  /**
   * Close the popup for error message
   */
  const handleClose = useCallback(() => {
    setModal(false);
  }, [setModal]);

  return (
    <>
      {!cameraPermission ? (
        <Dialog
          open={modal}
          id="preview-video"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
        >
          <IconButton className="close-icon" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <DialogTitle id="camera--microphone-dialog-title" variant="h3">
            {"Camera & Microphone Permission"}
            <Divider
              variant="middle"
              sx={{
                margin: {
                  xl: "20px 0 0",
                  sm: "15px 0 0",
                  xs: "10px 0 0",
                },
              }}
            ></Divider>
          </DialogTitle>
          <DialogContent sx={{ padding: "0 !important" }}>
            <Stack
              display="flex"
              direction={"row"}
              justifyContent="center"
              alignItems="center"
              sx={{
                p: "3% 3% 1% 3%",
              }}
            >
              {!cameraPermission && (
                <>
                  <Typography variant="h5" color={"error"}>
                    Access to your Camera or Microphone is currently blocked.
                    Click the Camera blocked icon in your browser address bar
                    and then refresh this page
                  </Typography>
                </>
              )}
              {cameraPermission && (
                <Typography variant="h5">
                  Please click on below button to allow Camera & Microphone
                  Permission
                </Typography>
              )}
            </Stack>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
};

export default VideoPermissionsPopup;
