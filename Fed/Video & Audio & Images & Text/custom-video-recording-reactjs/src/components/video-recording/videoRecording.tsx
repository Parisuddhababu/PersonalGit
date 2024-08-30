import { useCallback, useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import VideoPermissionsPopup from '../video-permission-popup/videoPermissionPopup';
import { CONFIG_CONSTANT } from '../../config/app-constant';

const VideoRecording = () => {
  const [modal, setModal] = useState<boolean>(true);
  const [cameraPermission, setCameraPermission] = useState<boolean>(true);
  const [videoRecordingStream, setVideoRecordingStream] =
    useState<MediaStream>();
  const videoRecord = useRef<HTMLVideoElement>(null);
  const [startedRecording, setStartedRecording] = useState<boolean>(false);
  const mimeTypes = { mimeType: CONFIG_CONSTANT.videoMimeTypes };
  const mediaRecorder = useRef<MediaRecorder>();
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);

  /**
   * Click on Start button Check the video Permissions and set the current live stream
   */
  const handleGetPermissions = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      const combinedAudioVideoStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
      setVideoRecordingStream(combinedAudioVideoStream);
      setCameraPermission(true);
      setStartedRecording(true);
      if (videoRecord.current) {
        videoRecord['current']['srcObject'] = videoStream;
      }
    } catch {
      setCameraPermission(false);
    }
  };

  /**
   * After Click on Video Recording Object update then display current Stream
   */
  useEffect(() => {
    if (videoRecordingStream) {
      handleVideoRecording();
    }
  }, [videoRecordingStream]);

  /**
   * Store Chunk of the video
   */
  const handleVideoRecording = async () => {
    if (videoRecordingStream) {
      const media = new MediaRecorder(videoRecordingStream, { ...mimeTypes });

      mediaRecorder['current'] = media;

      mediaRecorder.current.start();

      let localVideoChunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') {
          return true;
        }
        if (event.data.size === 0) {
          return true;
        }
        localVideoChunks.push(event.data);
      };
      setVideoChunks(localVideoChunks);
    }
  };

  /**
   * Start Video Recording Button click
   */
  const startVideoRecording = useCallback(async () => {
    handleGetPermissions();
  }, [handleGetPermissions]);

  /**
   * Stop Video Recording with Bolb Object URL
   */
  const stopVideoRecording = useCallback(() => {
    setStartedRecording(false);

    if (mediaRecorder.current) {
      mediaRecorder.current.stop();

      mediaRecorder.current.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: mimeTypes.mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);

        setRecordedVideoURL(videoUrl);

        setVideoChunks([]);
      };
    }
  }, [
    setStartedRecording,
    mediaRecorder,
    videoChunks,
    mimeTypes.mimeType,
    setRecordedVideoURL,
  ]);

  return (
    <>
      <Box
        display={'flex'}
        m={2}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Card
          sx={{
            width: '80%',
          }}
        >
          <CardHeader
            avatar={<Avatar aria-label='recipe'>V</Avatar>}
            title={
              <Typography component={'div'} variant='h5'>
                Video Recording
              </Typography>
            }
            subheader='You can record a video'
            action={
              <>
                {!startedRecording && (
                  <Button
                    variant='contained'
                    disabled={startedRecording}
                    onClick={startVideoRecording}
                  >
                    Start Video Recording
                  </Button>
                )}
                {startedRecording && (
                  <Button
                    disabled={!startedRecording}
                    variant='contained'
                    color='error'
                    onClick={stopVideoRecording}
                  >
                    Stop Video Recording
                  </Button>
                )}
              </>
            }
          ></CardHeader>
          <CardContent>
            {/* <Stack spacing={6}> */}
            {!recordedVideoURL && (
              <div className='blink-wrapper'>
                {startedRecording && (
                  <div className='blink-section'>
                    <span className='blink'></span>REC
                  </div>
                )}
                <video
                  ref={videoRecord}
                  autoPlay
                  className='live-player'
                ></video>
              </div>
            )}
            {recordedVideoURL && (
              <Stack
                display={'flex'}
                justifyContent={'center'}
                justifyItems={'center'}
              >
                <Stack flexDirection='row' justifyContent={'center'}>
                  <video
                    className='live-player'
                    src={recordedVideoURL}
                    controls
                  ></video>
                </Stack>
                <Stack flexDirection={'row'} justifyContent={'center'}>
                  <Button
                    variant='contained'
                    sx={{ mt: 2 }}
                    download
                    href={recordedVideoURL}
                  >
                    Download Recording
                  </Button>
                </Stack>
              </Stack>
            )}
            {/* </Stack> */}
          </CardContent>
        </Card>
      </Box>
      <VideoPermissionsPopup
        cameraPermission={cameraPermission}
        modal={modal}
        setModal={useCallback((isVisible) => setModal(isVisible), [])}
      />
    </>
  );
};

export default VideoRecording;
