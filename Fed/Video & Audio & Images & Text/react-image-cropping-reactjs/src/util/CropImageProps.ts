export type CropImageProps = {
    selectedImage: string;
    setSelectedImage: (image: string) => void;
    src:string;
    setOpen:(value:boolean)=>void;
    setOpenPopup:(value:boolean)=>void;
}