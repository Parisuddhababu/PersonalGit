import React, { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import picture from "../../images/default.png";
import PopUpPreview from "../PopUpPreview/PopUpPreview";

const PocView = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [originalImage, setOriginalImage] = useState("");


  // Function to handle file upload
  const uploadLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      setOriginalImage(URL.createObjectURL(file));

      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setOpenPopup(true);
      };
      reader.readAsDataURL(file);
    }
  }; 

 // Function to handle image click if selected then open popup else choose file option
const handleImageClick = useCallback(() => {
    if (!selectedImage) {
      document.getElementById("upload-logo")?.click();
    } else {
      setOpenPopup(true);
    }
  }, []);

   // Function to close the popup
  const closePopUpHandler = useCallback(() => {
    setOpenPopup(false);
  }, []);

  const deleteImageHandler = useCallback(() => {
    setSelectedImage("");
    setOpenPopup(false);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      {openPopup && (
        <PopUpPreview
          selectedImage={selectedImage}
          onClose={closePopUpHandler}
          setSelectedImage={setSelectedImage}
          src={originalImage}
          setOpenPopup={setOpenPopup}
        />
      )}

      <Box sx={{ border: "2px solid white" }}>
        <Button onClick={handleImageClick}>
          <img
            src={selectedImage || picture}
            alt={selectedImage ? "Selected" : "Default"}
            style={{ width: "400px", height: "400px", objectFit: "cover" }}
          />
        </Button>
      </Box>
      <Box sx={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
        <Button
          variant="contained"
          component="span"
          color="error"
          size="large"
          onClick={deleteImageHandler}
        >
          Delete
        </Button>{" "}
      </Box>

      <input
        accept="image/*"
        id="upload-logo"
        type="file"
        style={{ display: "none" }}
        onChange={uploadLogo}
      />
      <label htmlFor="upload-logo">
        <Button variant="contained" component="span" size="large">
          Browse File
        </Button>
      </label>
    </Box>
  );
};

export default PocView;
