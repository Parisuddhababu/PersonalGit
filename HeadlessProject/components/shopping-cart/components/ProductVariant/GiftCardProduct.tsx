import { CartItemFragment } from '@graphcommerce/magento-cart-items'
import { Box, SxProps, Theme, Typography } from '@mui/material'

export type GiftCardProductProps = {
  sx?: SxProps<Theme>
} & CartItemFragment
export const GiftCardProduct = (props: GiftCardProductProps) => {
  const { option } = props
  if (option && option?.length < 0) {
    return <></>
  }
  const senderName = option?.find((item) => item?.code === 'giftcard_sender_name')?.value || ''
  const senderEmail = option?.find((item) => item?.code === 'giftcard_sender_email')?.value || ''
  const recipientName =
    option?.find((item) => item?.code === 'giftcard_recipient_name')?.value || ''
  const recipientEmail =
    option?.find((item) => item?.code === 'giftcard_recipient_email')?.value || ''
  const message = option?.find((item) => item?.code === 'giftcard_message')?.value || ''

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {senderName && (
        <span>
          <Typography sx={{ fontWeight: 'bold' }}>Gift Card Sender</Typography>
          {senderEmail && (
            <Typography>
              {senderName} &lt;{senderEmail}&gt;
            </Typography>
          )}
          {!senderEmail && <Typography>{senderName}</Typography>}
        </span>
      )}
      {recipientName && (
        <span>
          <Typography sx={{ fontWeight: 'bold' }}>Gift Card Recipient</Typography>
          {recipientEmail && (
            <Typography>
              {recipientName} &lt;{recipientEmail}&gt;
            </Typography>
          )}
          {!recipientEmail && <Typography>{recipientName}</Typography>}
        </span>
      )}
      {message && (
        <span>
          <Typography sx={{ fontWeight: 'bold' }}>Gift Card Message</Typography>
          <Typography>{message}</Typography>
        </span>
      )}
    </Box>
  )
}

export default GiftCardProduct
