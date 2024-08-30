export type PopUpPreviewProps = {
    selectedImage: string;
    onClose: () => void;
    setSelectedImage: (image: string) => void;
    src:string;
    setOpenPopup:(value:boolean)=>void;
  }