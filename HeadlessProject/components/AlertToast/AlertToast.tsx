import { Alert, Box } from '@mui/material'
import { RichContent } from '../../lib/magento-page-builder'

function AlertToast(props) {
  const { alerts, link, sx } = props

  return (
    <Box sx={{}}>
      {alerts?.map((alert) => (
        <Alert
          key={alert.type}
          severity={alert?.type}
          variant='standard'
          sx={{
            ...(link !== alert?.targetLink && { display: 'none' }),
            margin: '0',
            '.MuiAlert-icon': {
              alignItems: 'center',
            },
            ...sx,
          }}
        >
          <RichContent html={alert?.message} />
        </Alert>
      ))}
    </Box>
  )
}

// eslint-disable-next-line import/no-default-export
export default AlertToast
