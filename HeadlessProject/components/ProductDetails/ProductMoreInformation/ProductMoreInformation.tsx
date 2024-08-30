import {
  responsiveVal,
  Row,
  extendableComponent,
  IconSvg,
  iconBox,
  FullPageMessage,
} from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Typography } from '@mui/material'

const name = 'ProductSpecs' as const
const parts = ['root', 'specs', 'options'] as const
const { classes } = extendableComponent(name, parts)

type ProductMoreInformationProps = {
  allAttributeRecords?: Array<{
    label?: string | null
    value?: string | null
    code?: string | null
  } | null> | null
}

export function ProductMoreInformation(props: ProductMoreInformationProps) {
  const { allAttributeRecords } = props
  if (allAttributeRecords?.length === 0)
    return (
      <Box>
        <FullPageMessage
          sx={{ marginTop: 0 }}
          title={<Trans id='Specifications are not available' />}
          icon={<IconSvg src={iconBox} size='xl' />}
        />
      </Box>
    )

  return (
    <Row className={classes.root}
      sx={{
        padding: '0 !important',
        marginBottom: '0 !important',
        '& p': {
          marginTop: '0'
        }
      }}
    >
      <Box
        // component='ul'
        className={classes.specs}
        sx={(theme) => ({
          display: 'grid',
          justifyContent: 'start',
          margin: 0,
          padding: 0,
          gridTemplateColumns: 'minmax(80px,auto) 1fr',
          gridGap: '0.65rem',
        })
      }
      >
        {allAttributeRecords?.map((aggregation) => (
          // <Box key={aggregation?.code}>
          <>
            <Typography 
              variant='body1'
              component='h6'  
              sx={{
                fontWeight: 700,
                fontVariationSettings: "'wght' 700",
              }}
            >
              {aggregation?.label}
            </Typography>
            <Box className={classes.options} sx={{ display: 'flex' }}>
              {aggregation?.value && (
                <Typography dangerouslySetInnerHTML={{ __html: aggregation?.value }} />
              )}
            </Box>
          </>
          // </Box>
        ))}
      </Box>
    </Row>
  )
}
