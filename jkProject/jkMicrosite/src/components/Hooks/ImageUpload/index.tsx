export interface IImageUpload  {
    imageSize: number;
    fileUploadRef: any;
}

export interface IImageUploadState {
  url: string;
  noPicture: boolean;
  obj: any;
  path?: string;
  _id?: string;
}