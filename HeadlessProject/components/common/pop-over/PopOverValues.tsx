import { CloseIcon, QuestionIcon } from "@components/Icons"
import { Box, IconButton, Popover, SxProps, Theme, Typography } from "@mui/material"
import { useState } from "react"

export type PopOverValuesProps = {
  sx?: SxProps<Theme>
  iconProps?: any //TODO: Type defination for the icon props.
  text: string
}

export const PopOverValues = (props: PopOverValuesProps) => {
  const {sx, iconProps, text} = props
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const icon = iconProps ? iconProps : <QuestionIcon />

  return (
    <Box sx={sx}>
      <IconButton aria-describedby={id} aria-label="info" onClick={handleClick}>
        {icon}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{text}</Typography>
      </Popover>
    </Box>
  )
}

export default PopOverValues