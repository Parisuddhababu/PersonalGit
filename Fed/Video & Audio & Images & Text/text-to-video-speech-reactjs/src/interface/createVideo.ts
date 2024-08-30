export interface IListAvatar {
  _id: string;
  id: string;
  name: string;
  type: string;
  version: number;
  status: number;
  gender: string;
  thumbnail: string;
  canvas: string;
  tilt: {
    top: number;
    left: number;
  }
  variants: {
    canvas: string;
    id: string;
    limit: number;
    name: string;
    thumbnail: string;
  }[]
}

export interface IListVoice {

}