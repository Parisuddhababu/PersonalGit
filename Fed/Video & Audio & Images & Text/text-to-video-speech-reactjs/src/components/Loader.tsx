import React from 'react';
import { Backdrop, CircularProgress, Paper } from '@mui/material';

interface ILoader {
  loading: boolean;
}

const Loader = ({ loading }: ILoader) => {
  return (
    <Backdrop
      sx={{
        color: (theme) => theme.palette.primary.main + 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={loading}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <CircularProgress
          color='primary'
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
        />
      </Paper>
    </Backdrop>
  );
};

export default Loader;
