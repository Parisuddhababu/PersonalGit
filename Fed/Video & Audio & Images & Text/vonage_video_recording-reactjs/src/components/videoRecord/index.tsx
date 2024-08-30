import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Cvstoprecording, Cvstartrecording } from '../icons/icons';
import './videoRecord.scss';
import { useMutation, useQuery } from '@apollo/client';
import { GETVONAGETOKEN } from '../../framework/queries/videoRecord';
import {
  STARTRECORDING,
  STARTRETAKERECORDING,
  STOPRECORDING,
} from '../../framework/mutations/videoRecord';
import { toast } from 'react-toastify';
import UploadVideo from '../uploadVideo';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import useMaxVideoRecording from 'src/hooks/useMaxVideoRecording';
import { secondsToTime, convertDataURLtoFile } from 'src/helper.js';

export interface MyWindow extends Window {
  OT: any;
}
declare const window: MyWindow;
let OT = window.OT;

export interface VideoRecordProps {
  videoRecordId: (value: string) => void;
  videoUrl: string;
  posterUrl: string;
  uploadStatus: boolean;
  publisherClass: string;
  receivedThumbnail: (value: File) => void
}
const VideoRecord = ({
  videoRecordId,
  videoUrl = '',
  posterUrl = '',
  uploadStatus = false,
  publisherClass,
  receivedThumbnail,
}: VideoRecordProps) => {
  const apiKey = useRef('');
  const sessionId = useRef('');
  const token = useRef('');
  const archiveMyId = useRef('');
  let archive;
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isTimer, setIsTimer] = useState<boolean>(false);
  const [publisherUpdated, setPublisherUpdated] = useState<any>(null);
  const [retake, setRetake] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(posterUrl);
  const [videoPermissions, setVideoPermissions] = useState<boolean>(true);
  let intervalCallTimeout: NodeJS.Timer;

  const { refetch: getToken } = useQuery(GETVONAGETOKEN);
  const [getStartVideo] = useMutation(STARTRECORDING);
  const [getStartRetakeVideo] = useMutation(STARTRETAKERECORDING);
  const [getStopVideo] = useMutation(STOPRECORDING);

  const {
    autoSaveVideoCounter,
    startTimerVideoRec,
    setAutoSaveVideoCounter,
    initializeRecorderCounter,
    setStopAutoSaveCounter,
  } = useMaxVideoRecording();

  /**
   * If maximum video recording limit exceed then directly call save recording api
   */
  useEffect(() => {
    if (autoSaveVideoCounter < 0) {
      return;
    }
    if (autoSaveVideoCounter === 0) {
      stopArchiving();
    }
  }, [autoSaveVideoCounter]);

  let connected = false;
  let publisherInitialized = false;

  function handleError (error: any) {
    // Using ANY type due to no solution available for window.OT type
    if (error) {
      toast.error(error);
    }
  }

  const removeVideoPlayer = () => {
    // Stop camera
    if (publisherUpdated) {
      publisherUpdated.destroy();
    }
    return true;
  };

  // prettier-ignore
  function initializeSession (retakeArchiving = false) {// NOSONAR
    if (publisherUpdated) {
      publisherUpdated.destroy();
    }
    const session = OT.initSession(apiKey.current, sessionId.current);

    // Subscribe to a newly created stream
    session.on('streamCreated', (event: any) => {
      const subscriberOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        fitMode: 'cover',
      };
      session.subscribe(
        event.stream,
        'subscriber',
        subscriberOptions,
        handleError
      );
    });

    session.on('archiveStarted', (event: any) => {
      archive = event;
      localStorage.setItem('archiveId', archive.id);
    });

    session.on('archiveStopped', (event: any) => {
      archive = event;
      localStorage.setItem('archiveId', archive.id);
      removeVideoPlayer();
    });

    session.on('sessionDisconnected', (event: any) => {
      toast.error('Disconnected', event.reason);
    });

    // initialize the publisher
    const publisherOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      fitMode: 'cover',
      showControls: false,
    };

    let publisher = OT.initPublisher(
      publisherClass,
      publisherOptions,
      function (err: any) {
        if (err) {
          if (err.name === 'OT_USER_MEDIA_ACCESS_DENIED') {
            // setIsDisabled(true)
            // Access denied can also be handled by the accessDenied event
            // toast.error(MESSAGES.MEDIA_ACCESS);
          } else {
            handleError(err);
          }
          publisher.destroy();
          publisher = null;
        } else {
          publisherInitialized = true;
          setPublisherUpdated(publisher);
          if (connected && publisherInitialized) {
            session.publish(publisher, handleError);
          }
        }
      }
    );

    // Connect to the session
    session.connect(token.current, (error: any) => {
      if (error) {
        handleError(error);
      } else {
        if (retakeArchiving) {
          startArchiving();
        }
        connected = true;
        // If the connection is successful, publish the publisher to the session
        // if (connected && publisherInitialized) {
        if (connected) {
          setPublisherUpdated(publisher);
          session.publish(publisher, handleError);
        }
      }
    });
  }

  const checkIfPublisherDivExist = () => {
    const PublisherExist = document.getElementById(publisherClass);
    if (PublisherExist) {
      getTokenVideoPlayer(true);
      clearInterval(intervalCallTimeout);
    }
  };

  const retakeArchiving = () => {
    if (videoUrl) {
      videoUrl = '';
    }
    setRetake(true);
    intervalCallTimeout = setInterval(checkIfPublisherDivExist, 100);
  };

  const startArchiving = async () => {
    setIsDisabled(true);
    setIsTimer(true);
    if (!sessionId.current) {
      return;
    }
    if (videoUrl) {
      videoUrl = '';
      try {
        if (archiveMyId.current) {
          await getStartRetakeVideo({
            variables: {
              archiveId: archiveMyId.current,
              sessionId: sessionId.current,
            },
          }).then(
            (res) => {
              archiveMyId.current = res?.data?.retakeVideo?.data.archiveId;
              setIsRecording(true);
              startTimerVideoRec();
              setIsDisabled(false);
              setIsTimer(false);
              retakeArchiving();
            },
            (err) => {
              toast.error('Start Archiving Error', err);
            }
          );
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsDisabled(false);
        setIsTimer(false);
      }
    } else {
      try {
        await getStartVideo({
          variables: { sessionId: sessionId.current },
        }).then(
          (res) => {
            archiveMyId.current = res?.data?.startArchive?.data.archiveId;
            setIsRecording(true);
            startTimerVideoRec();
            setIsDisabled(false);
            setIsTimer(false);
          },
          (err) => {
            toast.error('Start Archiving Error', err);
          }
        );
      } catch (error) {
        handleError(error);
      } finally {
        setIsDisabled(false);
        setIsTimer(false);
      }
    }
  };
  const stopArchiving = useCallback(async () => {
    setIsDisabled(true);
    setIsTimer(true);
    if (!archiveMyId.current) {
      return;
    }
    try {
      setLoading(true);
      setRetake(false);
      setStopAutoSaveCounter(true);
      await getStopVideo({
        variables: { archiveId: archiveMyId.current },
      }).then(
        (res) => {
          // Stop camera
          setAutoSaveVideoCounter(-1);
          videoRecordId(res.data?.stopArchive?.data?.archiveId);
          setIsRecording(false);
          setLoading(false);
          const imgData = publisherUpdated.getImgData();
          setThumbnailUrl(`data:image/png;base64,${imgData}`);
          if (receivedThumbnail) {
            receivedThumbnail(
              convertDataURLtoFile(`data:image/png;base64,${imgData}`)
            );
          }
          if (publisherUpdated) {
            publisherUpdated.destroy();
            setPublisherUpdated(null);
          }
        },
        (err) => {
          toast.error('Stop Archiving Error', err);
          setLoading(false);
        }
      );
    } catch (error) {
      handleError(error);
      setLoading(false);
    } finally {
      setIsDisabled(false);
      setIsTimer(false);
      if (publisherUpdated) {
        publisherUpdated.destroy();
      }
    }
  }, [publisherUpdated, setIsDisabled, setLoading, handleError, videoRecordId, setAutoSaveVideoCounter, setThumbnailUrl, setIsRecording]);

  useEffect(() => {
    getTokenVideoPlayer();
    checkForUserMediaPermissions();
  }, []);

  const getTokenVideoPlayer = (callStartArchiving = false) => {
    getToken().then((res) => {
      console.log('setToken')
      localStorage.setItem(
        'openTock-Token',
        res?.data?.getSessionToken?.data.token
      );
      sessionId.current = res?.data?.getSessionToken?.data.sessionId;
      apiKey.current = res?.data?.getSessionToken?.data.apiKey;
      token.current = res?.data?.getSessionToken?.data.token;
      // Not initialize session if get video URL
      if (!videoUrl) {
        if (callStartArchiving) {
          initializeSession(callStartArchiving);
          return;
        } else {
          initializeSession();
        }
      }
    });
  };
  const checkForUserMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setIsDisabled(false);
      setVideoPermissions(true);
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      setIsDisabled(true);
      toast.error('Media Access');
      setVideoPermissions(false);
      return false;
    }
  };
  const startRetakeRecording = useCallback(() => {
    if (!videoUrl) {
      startArchiving();
    } else {
      videoUrl = '';
      retakeArchiving();
    }
  }, [])

  return (
    <Paper
      elevation={0}
      sx={{
        padding: { xs: '15px 15px', lg: '15px 25px' },
        marginBottom: {
          xs: '15px',
          md: '20px',
          lg: '25px',
          xl: '30px',
        },
        border: '1px solid #E2E0E0',
        borderRadius: '10px',
      }}
      className='video-record-wrapper'
    >
      <Grid container rowSpacing={{ xs: 2, lg: 1 }} columnSpacing={{ xs: 3.8 }}>
        <Grid item xs={12} sm={6} md={7.5}>
          <Typography
            variant='body2'
            sx={{
              marginTop: { lg: '14px' },
              marginBottom: '2px',
              color: '#787A7C',
            }}
          >
            Record a Personal Video:
          </Typography>
          <ul className='record-video-notes'>
            <li>Increased response rate</li>
            <li>Opportunity to explain the next steps</li>
            <li>Easily communicate your brand</li>
            <li>Build rapport with your audience</li>
          </ul>
          {!isRecording && (
            <Button
              size='large'
              variant='contained'
              sx={{
                width: '100%',
                maxWidth: '322px',
              }}
              startIcon={<Cvstartrecording />}
              onClick={startRetakeRecording}
              id='start'
              disabled={
                isDisabled ||
                  loading ||
                  (videoPermissions && videoUrl && !isRecording && !uploadStatus)
                  ? true
                  : false
              }
            >
              {!videoUrl ? 'Start Recording' : 'Retake Recording'}
            </Button>
          )}

          {isRecording && (
            <Button
              size='large'
              variant='contained'
              sx={{
                color: '#787A7C',
                width: '100%',
                maxWidth: '322px',
              }}
              startIcon={<Cvstoprecording />}
              onClick={stopArchiving}
              id='stop'
            >
              Stop Recording
            </Button>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4.5}
          sx={{
            display: { md: 'flex' },
            justifyContent: { md: 'flex-end' },
          }}
        >
          <Stack
            sx={{
              maxWidth: '400px',
              width: '100%',
              // maxHeight: '220px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {!isRecording && isTimer && (
              <Paper
                elevation={1}
                sx={{
                  maxWidth: '400px',
                  // maxHeight: '220px',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
                className='video-timer'
              >
                <Stack
                  flexDirection='row'
                  justifyContent='center'
                  alignItems='center'
                  height='100%'
                >
                  <Stack
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='center'
                    height='100%'
                  >
                    <Box sx={{ position: 'relative', textAlign: 'center' }}>
                      <CircularProgress></CircularProgress>
                      <Typography
                        variant='h4'
                        sx={{ margin: '0', textAlign: 'center', color: '#fff' }}
                      >
                        {initializeRecorderCounter}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            )}
            {!videoPermissions && !videoUrl && (
              <Paper
                elevation={1}
                sx={{
                  maxWidth: '400px',
                  // maxHeight: '220px',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
                className='blink-wrapper'
              >
                <Stack
                  sx={{
                    width: '100%',
                    height: '100%',
                  }}
                  justifyContent='center'
                  alignItems='center'
                  className='publisher'
                >
                  <VideocamOffOutlinedIcon
                    sx={{ mb: 2, fontSize: 30 }}
                    color='error'
                  />
                  <Typography color='gray' variant='subtitle1'>
                    Video Permission Required!
                  </Typography>
                </Stack>
              </Paper>
            )}
            {videoUrl &&
              !retake &&
              !isRecording &&
              (uploadStatus ? (
                <UploadVideo videoURL={videoUrl} thumbnailUrl={thumbnailUrl} />
              ) : (
                <Paper
                  elevation={1}
                  sx={{
                    maxWidth: '300px',
                    borderRadius: '8px',
                  }}
                  className='video-wrapper'
                >
                  <Stack
                    sx={{
                      width: '100%',
                      height: '100%',
                    }}
                    justifyContent='center'
                    alignItems='center'
                    className='publisher'
                  >
                    <CircularProgress
                      size={24}
                      color='primary'
                      sx={{ mb: 2 }}
                    />
                    <Typography color='gray' variant='subtitle1'>
                      Uploading Video
                    </Typography>
                  </Stack>
                </Paper>
              ))}

            <div className='videos'>
              <div className='blink-wrapper'>
                <div className='publisher' id={publisherClass}>
                  {isRecording && (
                    <>
                      <div className='blink-section'>
                        <span className='blink'></span>REC
                      </div>
                      <div className='time-counter'>
                        {secondsToTime(autoSaveVideoCounter)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Stack>
        </Grid>
      </Grid>
    </Paper >
  );
};

export default VideoRecord;
