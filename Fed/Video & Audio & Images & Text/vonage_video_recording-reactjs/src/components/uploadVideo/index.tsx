import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './upload-video.scss';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { CvPlayVideo, Cvclose, Cvdelete } from '../icons/icons';
import PreviewVideo from '../previewVideo';
import ReactPlayer from 'react-player/lazy';

export interface UploadVideoProps {
  videoURL: string;
  thumbnailUrl: string;
  deleteVideo?: () => void;
  videoType?: string;
}
const UploadVideo = ({
  videoURL,
  thumbnailUrl,
  deleteVideo,
  videoType,
}: UploadVideoProps) => {
  const [uploadVideo, setUploadVideo] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (vidRef.current) {
      vidRef.current.setAttribute('playsinline', 'true');
    }
  }, []);

  return (
    <>
      <div
        className='video-wrapper'
        title='Play'
        onClick={() => setUploadVideo(true)}
      >
        <ReactPlayer
          controls={false}
          url={videoURL}
          className='external-player'
          config={{
            file: {
              attributes: {
                poster: thumbnailUrl,
              },
            },
          }}
          playsinline={true}
          height={'inherit'}
          width={'inherit'}
          onContextMenu={useCallback((e: SyntheticEvent) => e.preventDefault(), [])}
        />
        <IconButton
          className={`upload-btn ${videoType === 'LINK' ? 'external-video-player' : ''
            }`}
          onClick={useCallback(() => setUploadVideo(true), [])}
        >
          <CvPlayVideo />
        </IconButton>
        {deleteVideo && (
          <IconButton className='delete-btn' onClick={deleteVideo}>
            <Cvdelete />
          </IconButton>
        )}
      </div>
      <Dialog
        open={uploadVideo}
        id='preview-video'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth={true}
        maxWidth='md'
        className='video-player'
      >
        <IconButton
          className='close-icon'
          onClick={useCallback(() => {
            setUploadVideo(false);
          }, [])}
        >
          <Cvclose />
        </IconButton>
        <DialogContent
          className='preview-Video-dialog-content'
          sx={{ padding: '0 !important' }}
        >
          <PreviewVideo
            videoURL={videoURL}
            videoType={videoType}
            thumbnail={thumbnailUrl}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadVideo;
