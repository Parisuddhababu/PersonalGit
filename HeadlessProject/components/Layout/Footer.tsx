import { FooterQueryFragment } from './FooterQueryFragment.gql'
import { RichContent } from '@lib/magento-page-builder'
import { Box, Container, Typography } from '@mui/material'
import { GuestNewsletter } from '@components/Newsletter/GuestNewsletter'
export type FooterProps = FooterQueryFragment

export function Footer(props: FooterProps) {
  return (
    <>
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: { xs: '0px', md: '18px' },
          paddingLeft: { xs: '0px', md: '22px' },
          paddingRight: { xs: '0px', md: '22px' },
          paddingBottom: { xs: '0px', md: '30px' },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {props?.GetFooterCMSLinks?.allBlocks?.map((link) => (
          <RichContent html={link?.content} />
        ))}
        <Box
          sx={{
            padding: '0',
          }}
        >
          <GuestNewsletter />
        </Box>
      </Container>
      <Box
        sx={{
          backgroundColor: '#6e716e',
          color: '#ffffff',
          display: 'block',
          padding: '10px 0',
          textAlign: 'center',
        }}
      >
        <Container
          maxWidth='lg'
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '13px !important',
              lineHeight: '18px',
            }}
          >
            Copyright &copy; 2023-present Brainvire, Inc. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  )
}
