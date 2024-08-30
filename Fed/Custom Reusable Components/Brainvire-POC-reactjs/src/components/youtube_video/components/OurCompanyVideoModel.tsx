import { PlayButtonSvg } from "../../../assets/Icons";

const ClientVideo = () => {
  return (
    <>
      <button
        type="button"
        className="video-play-button"
        aria-label="video play button"
      >
        <PlayButtonSvg />
      </button>

      <div className="youtube-video-player">
       
      </div>
    </>
  );
};

export default ClientVideo;
