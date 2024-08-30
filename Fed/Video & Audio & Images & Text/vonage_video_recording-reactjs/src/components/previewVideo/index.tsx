import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import { CvPlayVideo, CvPauseVideo } from '../icons/icons';
import './preview-video.scss';
import ReactPlayer from 'react-player';
import { secondsToTime } from '../../helper.js';

interface IPreviewVideo {
  videoURL: string | undefined;
  videoWidth?: string;
  videoHeight?: string;
  uploadStatus?: boolean;
  videoType?: string;
  displayPlayIcon?: boolean;
  thumbnail?: string;
  autoPlay?: boolean;
  videoEnded?: (endVideo: boolean) => void;
  displayQuestion?: (display: boolean) => void;
}
const PreviewVideo = ({
  videoURL,
  // uploadStatus = false,
  videoWidth = '420',
  videoHeight = '345',
  displayPlayIcon = true,
  thumbnail = '',
  autoPlay,
  videoEnded,
  displayQuestion,
}: IPreviewVideo) => {
  const vidPlayerRef = useRef(null);
  const [play, setPlay] = useState(true);
  const [pause, setPause] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalVideoTimer, setTotalVideoTimer] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  const playVideo = useCallback(() => {
    setPause(true);
    setPlay(false);
    setIsPlaying(true);
    // If auto play is true then need to display the video question
    if (displayQuestion && autoPlay) {
      displayQuestion(true);
    }
  }, [displayQuestion, autoPlay]);

  const pauseVideo = useCallback(() => {
    setPause(false);
    if (!autoPlay) {
      setPlay(true);
    }
    setIsPlaying(false);
  }, [autoPlay]);
  useEffect(() => {
    if (!autoPlay && videoURL) {
      pauseVideo();
    }
  }, [videoURL, autoPlay, pauseVideo]);

  const handleVideoEnded = useCallback(() => {
    // If Video Played Ended then retrun props to parent component
    if (videoEnded) {
      // Once Video ended total second is less then one second of total time so added timeout
      setTimeout(() => {
        videoEnded(true);
        setPlay(true);
      }, 1000);
    }
    if (!autoPlay) {
      setPlay(true);
    }
    setPause(false);
    setIsPlaying(false);
  }, [videoEnded, autoPlay]);

  /**
   * Handle Play & Paused Video on Particular Stack click event
   */
  const handlePlayPauseVideoOnNode = useCallback(() => {
    if (play && displayPlayIcon) {
      playVideo();
    } else if (!autoPlay && pause) {
      pauseVideo();
    }
  }, [play, pause, autoPlay, displayPlayIcon, playVideo, pauseVideo]);

  /**
   * Display Title on Hover the particular HTML Node for video play and pause
   * @returns string
   */
  const getHoverNodeTitle = useCallback(() => {
    if (play && displayPlayIcon) {
      return 'Play';
    } else if (!autoPlay && pause) {
      return 'Pause';
    }
    return '';
  }, [play, pause, autoPlay, displayPlayIcon]);

  return (
    // #Note: Please add 'playing' class name after play button clicked
    <Stack
      onClick={handlePlayPauseVideoOnNode}
      title={getHoverNodeTitle()}
      className={`preview-video-section${isPlaying ? ' playing' : ''}`}
    >
      <Stack
        flexDirection='row'
        justifyContent='Center'
        alignItems='center'
        className={'video-control-wrapper'}
      >
        {displayPlayIcon && (
          <Stack
            flexDirection='column'
            justifyContent='Center'
            alignItems='center'
            className='video-control'
          >
            {play && (
              <Typography
                variant='h3'
                sx={{
                  color: '#ffffff',
                  textAlign: 'center',
                  maxWidth: '330px',
                  position: 'absolute',
                  top: {
                    xs: 'calc(45% - 40px)',
                    md: 'calc(45% - 50px)',
                    lg: 'calc(45% - 60px)',
                    xl: 'calc(45% - 70px)',
                  },
                  marginBottom: {
                    xs: '16px',
                    md: '22px',
                    lg: '28px',
                    xl: '34px',
                  },
                  lineHeight: { lg: '25px', xl: '30px' },
                  fontSize: {
                    xs: '14px',
                    sm: '18px',
                    md: '20px',
                    xl: '22px',
                    xxl: '24px',
                  },
                }}
              >
                Press play button to watch.
              </Typography>
            )}
            {play && (
              <IconButton
                onClick={playVideo}
                aria-label='Play-Pause-Video'
                className='play-pause-btn'
              >
                <CvPlayVideo />
              </IconButton>
            )}
            {!autoPlay && pause && (
              <IconButton
                onClick={pauseVideo}
                aria-label='Play-Pause-Video'
                className='play-pause-btn'
              >
                <CvPauseVideo />
              </IconButton>
            )}
          </Stack>
        )}
        <ReactPlayer
          url={videoURL}
          height={videoHeight}
          width={videoWidth}
          playing={!play}
          onEnded={handleVideoEnded}
          ref={vidPlayerRef}
          className='video-control-wrapper'
          controls={false}
          onPlay={playVideo}
          onPause={pauseVideo}
          onDuration={useCallback((e:any) => {
            setTotalVideoTimer(e);
            setCurrentSeconds(0);
          }, [])}
          onClickPreview={playVideo}
          onProgress={useCallback((e:any) => {
            const currentTime = e.playedSeconds;
            setCurrentSeconds(currentTime);
          }, [])}
          config={{
            file: {
              attributes: {
                onContextMenu: (e: any) => e.preventDefault(),
                poster: thumbnail,
                allow: 'autoplay;playsinline;',
              },
            },
          }}
          playsinline={true}
          title={getHoverNodeTitle}
          onContextMenu={useCallback((e: any) => e.preventDefault(), [])}
        />
        <Stack className='control-wrapper'></Stack>
      </Stack>
      {displayPlayIcon && (
        <div className='time-counter'>
          {secondsToTime(currentSeconds)} / {secondsToTime(totalVideoTimer)}
        </div>
      )}
    </Stack>
  );
};

export default PreviewVideo;
