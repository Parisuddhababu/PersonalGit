
const APIURL = process.env.REACT_APP_API_URL;

const APPCONFIG = {
  LIST_AVATART: APIURL + 'avatars',
  CREATE_VIDEO: APIURL + 'videos',
  RENDER_VIDEO: APIURL + 'videos/render/',
  RETRIVE_VIDEO: APIURL + 'videos/',
  LIST_VOICE: APIURL + 'voices/'
};

export default APPCONFIG;