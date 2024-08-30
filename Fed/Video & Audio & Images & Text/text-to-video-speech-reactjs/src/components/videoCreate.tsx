import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import APPCONFIG from '../constant/app-config';
import { IListAvatar } from '../interface/createVideo';
import http from '../axios/axios';
import Loader from './Loader';

interface IVideoCreateInitialValue {
  avatar?: string;
  avatarImageUrl?: string;
  voiceMessage?: string;
  gender?: string;
  avatarObj?: {
    id: string | number;
    gender: string;
    name: string;
    version: string | number;
  };
  voiceAudio?: string;
  voiceId?: string;
  voiceObj?: {
    voice: string;
    voiceProvider: string;
  };
}

interface IVoiceList {
  name: string;
}

const VideoCreate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarList, setAvatarList] = useState<IListAvatar[]>([]);
  const [voiceList, setVoiceList] = useState<any[]>([]);
  const [createdVideoId, setCreatedVideoId] = useState<string>();
  const [videoLink, setVideoLink] = useState<string>();
  const [videoThumbnail, setVideoThumbnail] = useState<string>();
  const [initialValue, setInitialValue] = useState<IVideoCreateInitialValue>();
  let intervalCallTimeout: any;

  /**
   * Get Avatar List from the api of elai.io
   */
  const getAvatarList = () => {
    http
      .get(APPCONFIG.LIST_AVATART)
      .then((res) => {
        setAvatarList(res?.data ?? []);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  /**
   * Get Voice List from the api of elai.io
   */
  const getVoiceList = () => {
    http
      .get(APPCONFIG.LIST_VOICE)
      .then((res) => {
        const filterVoiceEnglish = res?.data?.filter(
          (ele: IVoiceList) => ele.name === 'English'
        );
        setVoiceList([
          ...filterVoiceEnglish[0].male,
          ...filterVoiceEnglish[0].female,
        ]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getAvatarList();
    getVoiceList();
  }, []);

  /**
   * Selected Avatar change
   * @param e Selection change value
   */
  const handleOnChangeAvatar = (e: SelectChangeEvent<string>) => {
    const avatarObj = avatarList?.filter((ele) => ele._id === e.target.value);
    setInitialValue({
      ...initialValue,
      avatar: e.target.value,
      avatarImageUrl: avatarObj?.[0]?.variants?.[0]?.thumbnail,
      gender: avatarObj?.[0]?.gender,
      avatarObj: {
        id: avatarObj?.[0]?.id,
        name: avatarObj?.[0]?.name,
        gender: avatarObj?.[0]?.gender,
        version: avatarObj?.[0]?.version,
      },
    });
  };

  /**
   * Selected Voice Change
   * @param e Selection change value
   */
  const handleOnChangeVoice = useCallback(
    (e: SelectChangeEvent<string>) => {
      const voiceObj = voiceList?.filter(
        (ele) => ele.character === e.target.value
      );
      setInitialValue({
        ...initialValue,
        voiceId: e.target.value,
        voiceAudio:
          voiceObj?.[0]?.url ??
          voiceObj?.[0]?.playedTags?.[0]?.playedTags?.[0]?.url,
        voiceObj: {
          voice:
            voiceObj?.[0]?.voice ??
            voiceObj?.[0]?.locale +
              voiceObj?.[0]?.characted +
              voiceObj?.[0]?.playedTags?.[0]?.name,
          voiceProvider: voiceObj?.[0]?.name,
        },
      });
    },
    [initialValue, voiceList]
  );

  /**
   * Create video button click api calling
   */
  const createVideo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      name: 'Api Video',
      public: true,
      data: {
        skipEmails: false,
        subtitlesEnabled: 'false',
        format: '16_9',
        resolution: 'FullHD',
      },
      slides: [
        {
          id: 1,
          canvas: {
            background: '#ffffff',
            version: '4.4.0',
            objects: [
              {
                id: 1,
                type: 'avatar',
                src: initialValue?.avatarImageUrl,
                top: 20,
                left: 150,
                scaleX: 0.37,
                scaleY: 0.37,
                avatarType: 'transparent',
                version: 2,
              },
            ],
          },
          avatar: {
            id: initialValue?.avatarObj?.id,
            name: initialValue?.avatarObj?.name,
            gender: initialValue?.avatarObj?.gender,
            version: initialValue?.avatarObj?.version,
          },
          animation: 'fade_in',
          language: 'English',
          speech: initialValue?.voiceMessage,
          voiceType: 'text',
          voice: initialValue?.voiceObj?.voice,
          voiceProvider: initialValue?.voiceObj?.voiceProvider,
        },
      ],
    };
    setIsLoading(true);
    http
      .post(APPCONFIG.CREATE_VIDEO, formData)
      .then((res) => {
        if (res?.data?.status === 'draft') {
          callRenderVideoApi(res?.data?._id);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  /**
   * Call elai.io api for video render after create a video
   * @param id
   */
  const callRenderVideoApi = (id: string) => {
    http
      .post(APPCONFIG.RENDER_VIDEO + id, {})
      .then((res) => {
        if (res?.data?.accepted) {
          callIntervalOfStatus();
          setCreatedVideoId(id);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (createdVideoId) {
      intervalCallTimeout = setInterval(callIntervalOfStatus, 10000);
    }
  }, [createdVideoId]);

  /**
   * checked elai.io current video is ready for play or not
   */
  const callIntervalOfStatus = () => {
    if (createdVideoId) {
      http
        .get(APPCONFIG.RETRIVE_VIDEO + createdVideoId)
        .then((res) => {
          if (res?.data?.status === 'ready') {
            clearInterval(intervalCallTimeout);
            setVideoLink(res?.data?.url);
            setVideoThumbnail(res?.data?.thumbnail);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  };
  const handleVoiceMessage = useCallback((e: any) => {
    setInitialValue({
      ...initialValue,
      voiceMessage: e.target.value,
    });
  }, []);

  return (
    <>
      <Loader loading={isLoading} />
      <Container maxWidth='xl' sx={{ m: 10 }}>
        <Paper elevation={3} sx={{ p: '10px' }}>
          <Typography variant='h5' gutterBottom>
            Create Video
          </Typography>
          <form onSubmit={createVideo}>
            <Grid container>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label' required>
                    Select Avatar
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={initialValue?.avatar}
                    label='Select Avatar'
                    onChange={handleOnChangeAvatar}
                    required
                  >
                    {avatarList?.map((ele) => (
                      <MenuItem key={ele._id} value={ele._id}>
                        {ele?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ mt: 2, mb: 2 }}>
                {initialValue?.avatarImageUrl && (
                  <img
                    src={initialValue?.avatarImageUrl}
                    height={100}
                    width={100}
                  />
                )}
              </Grid>
              <Grid item xs={6} sx={{ mt: 2, mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label' required>
                    Select Avatar Voice
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={initialValue?.voiceId}
                    label='Select Avatar Voice'
                    onChange={handleOnChangeVoice}
                    required
                  >
                    {voiceList?.map((ele) => (
                      <MenuItem
                        key={ele?.character}
                        disabled={
                          ele?.url || ele?.playedTags?.[0]?.playedTags?.[0]?.url
                            ? false
                            : true
                        }
                        value={ele.character}
                      >
                        {ele?.character}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ mt: 2, mb: 2 }}>
                {initialValue?.voiceAudio && (
                  <audio src={initialValue.voiceAudio} controls></audio>
                )}
              </Grid>
              <Grid item xs={6} sx={{ mt: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  id='outlined-helperText'
                  label='Add Your Voice Message to Video'
                  value={initialValue?.voiceMessage ?? ''}
                  onChange={handleVoiceMessage}
                  required
                />
              </Grid>
            </Grid>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: '20px' }}
              type='submit'
            >
              Create Video
            </Button>
          </form>
        </Paper>
        {videoLink && (
          <Paper elevation={3} sx={{ p: '10px', m: '10px' }}>
            <Typography variant='h5' gutterBottom>
              Preview Of Video
            </Typography>
            <Grid container>
              <Grid item xs={12}>
                <video
                  src={videoLink}
                  poster={videoThumbnail}
                  width='500'
                  height='500'
                  controls
                ></video>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default VideoCreate;
