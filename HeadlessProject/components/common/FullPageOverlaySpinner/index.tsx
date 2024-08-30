import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
export type FullPageOverlaySpinnerProps = {
  sx?: SxProps<Theme>
}

export const FullPageOverlaySpinner  = (props: FullPageOverlaySpinnerProps) => {
  const {sx} = props;
  return (
    <Box sx={{ 
      position: 'fixed',
      inset: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#d3cece42',
      zIndex: '99999',
      ...sx}}>
      <CircularProgress/>
    </Box>
  )
}

export default FullPageOverlaySpinner