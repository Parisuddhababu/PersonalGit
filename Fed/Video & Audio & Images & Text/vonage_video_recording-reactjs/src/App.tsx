import React, { useState, useEffect } from "react";
import "opentok-solutions-css";
import './App.css'
import VideoRecord from "./components/videoRecord";
import { Grid, FormGroup, Stack, InputLabel, Typography } from "@mui/material";
import { VIEWARCHIVE } from "./framework/queries/videoRecord";
import client from "./framework/apploclient";

let archiveInterval: number;

function App () {
  const [videoRecordThumbnail, setVideoRecordThumbnail] = useState<any>('');
  const [questionVideoRecordUrl, setQuestionVideoRecordUrl] = useState<string>('');
  const [questionVideoRecordId, setQuestionVideoRecordId] = useState<string>('');
  const [questionVideoRecordStatus, setQuestionVideoRecordStatus] =
    useState<boolean>(false);

  const getArchiveVideo = async (uuid: string) => {
    clearInterval(archiveInterval);
    if (!uuid) {
      return { status: '', url: '' };
    }
    const { data } = await client.query({
      fetchPolicy: 'network-only',
      query: VIEWARCHIVE,
      variables: {
        uuid,
      },
    });
    // status : UPLOADED / IN_PROGRESS
    const archiveStatus = data?.viewArchive?.data?.status;
    const archiveUrl = data?.viewArchive?.data?.url;
    setQuestionVideoRecordUrl(archiveUrl);
    setQuestionVideoRecordStatus(
      archiveStatus === 'UPLOADED'
    );

    // set interval for get uploaded video
    if (archiveStatus === 'IN_PROGRESS') {
      archiveInterval = window.setInterval(async () => {
        await getArchiveVideo(uuid);
      }, 5000);
    } else {
      clearInterval(archiveInterval);
    }
  };

  useEffect(() => {
    if (questionVideoRecordId) {
      (async () => {
        await getArchiveVideo(questionVideoRecordId);
      })();
    }
  }, [questionVideoRecordId]);

  return (
    <div className="App">
      <Grid item xs={12} padding={10} maxWidth={1400} sx={{ margin: "auto" }}>
        <FormGroup>
          <Stack
            flexDirection='row'
            alignContent='center'
            justifyContent='space-between'
            alignItems='center'
            sx={{ marginBottom: '10px', padding: '10px 0px 0px 10px' }}
          >
            <InputLabel htmlFor='question-video' required>
              Record Video
            </InputLabel>
            <Stack
              flexDirection='row'
              alignContent='center'
              justifyContent='space-between'
              flexWrap='wrap'
              alignItems='center'
              sx={{ marginLeft: '20px' }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '14px' },
                  color: '#787A7C',
                  marginRight: { xs: '10px', lg: '20px' },
                }}
              >
                Record now
              </Typography>
            </Stack>
          </Stack>
        </FormGroup>
        <VideoRecord
          videoRecordId={setQuestionVideoRecordId}
          videoUrl={questionVideoRecordUrl}
          publisherClass='question-video'
          posterUrl={videoRecordThumbnail}
          receivedThumbnail={setVideoRecordThumbnail}
          uploadStatus={questionVideoRecordStatus}
        />
      </Grid>
    </div>
  );
}

export default App;
