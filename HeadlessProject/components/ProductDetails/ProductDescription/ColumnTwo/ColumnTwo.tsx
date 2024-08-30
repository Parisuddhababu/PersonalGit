import { extendableComponent, Row } from '@graphcommerce/next-ui'
import { Box, ContainerProps } from '@mui/material'
import React from 'react'

export type ColumnTwoWithTopProps = ContainerProps & {
  top: React.ReactNode
  left: React.ReactNode
}

const compName = 'ColumnTwoWithTop' as const
const parts = ['root', 'colOne', 'colTwo'] as const
const { classes } = extendableComponent(compName, parts)

export function ColumnTwo(props: ColumnTwoWithTopProps) {
  const { left, sx = [], ...containerProps } = props

  return (
    <Row 
      maxWidth='lg' 
      className={classes.root} 
      {...containerProps}
      sx={{
        padding: '0 !important',
        marginBottom: '0 !important',
        '& p': {
          marginTop: '0'
        }
      }}
    >
      <Box className={classes.colOne} gridArea='left'>
        {left}
      </Box>
    </Row>
  )
}
