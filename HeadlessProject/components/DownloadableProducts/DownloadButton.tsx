import { Box, styled } from '@mui/material'
import React from 'react'

const Link = styled('span')({
  color: 'blue',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
})

const DownloadButton = ({ link, linkName }) => {
  const handleDownload = () => {
    window.open(link, '_blank')
  }

  if (!link) {
    return null // If link is not available, don't render the button
  }

  return (
    <Link
      className='download-button'
      onClick={handleDownload}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <svg
        width='20px'
        height='20px'
        viewBox='0 0 64 64'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M31.667 45.024V18.024'
          stroke='#426AB2'
          stroke-width='4'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M22.667 39.024L31.667 45.024L40.666 39.024'
          stroke='#426AB2'
          stroke-width='4'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M31.667 58.191C46.3948 58.191 58.334 46.2518 58.334 31.5241C58.334 16.7963 46.3948 4.85706 31.667 4.85706C16.9392 4.85706 5 16.7963 5 31.5241C5 46.2518 16.9392 58.191 31.667 58.191Z'
          stroke='#000000'
          stroke-width='4'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>

      {linkName}
    </Link>
  )
}

export default DownloadButton
