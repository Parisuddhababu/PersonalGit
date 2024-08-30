import { Box, Button, Dialog, DialogTitle, Slide, Typography, IconButton } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import React from 'react'
import { Closemenu } from '../../Icons'

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction='down' ref={ref} {...props} />,
)

export const ConfirmDialog = (props) => {
  const {
    onClose,
    openDialog,
    title,
    handleSubmit,
    cancelButtonText = 'Cancel',
    okButtonText = 'Ok',
    cancelButtonColor = 'inherit',
    headerTitle = undefined,
  } = props
  return (
    <Dialog
      TransitionComponent={Transition}
      open={openDialog}
      onClose={onClose}
      sx={{
        padding: '1.25rem 1.25rem',
        '.MuiDialog-container': {
          alignItems: 'flex-start',
        },
        '& .MuiDialog-paper': {
          maxWidth: '31.25rem',
          margin: '1.875rem 0 0',
          borderRadius: '0',
        },
        transition: 'ease-in-out 0.5s',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding: '0.5rem 0.75rem 0.5rem 1.875rem',
        }}
      >
        <IconButton
          aria-label='delete'
          size='small'
          onClick={onClose}
          sx={{
            marginLeft: 'auto',
            '& > svg': {
              fontSize: '1.125rem',
            },
          }}
        >
          <Closemenu fontSize='inherit' />
        </IconButton>
      </Box>
      {headerTitle && (
        <Box
          sx={{
            padding: '0 1.875rem',
          }}
        >
          <Typography
            variant='h3'
            sx={{
              borderBottom: '1px solid',
              marginBottom: '0.5rem',
            }}
          >
            {headerTitle}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          padding: '0 1.875rem',
        }}
      >
        <Typography
          dangerouslySetInnerHTML={{
            __html: title as string,
          }}
        />
        {/* {title} */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          padding: '1.875rem',
          gap: '0.25rem',
        }}
      >
        {cancelButtonText && (
          <Button
            disableRipple
            variant='contained'
            size='medium'
            color={cancelButtonColor}
            onClick={onClose}
          >
            {cancelButtonText}
          </Button>
        )}
        {okButtonText && (
          <Button
            onClick={() => {
              onClose()
              handleSubmit()
            }}
            disableRipple
            variant='contained'
            color='secondary'
            size='medium'
            sx={{
              minWidth: 'auto',
            }}
          >
            {okButtonText}
          </Button>
        )}
      </Box>
    </Dialog>
  )
}
