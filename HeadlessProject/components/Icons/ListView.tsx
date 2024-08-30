import { createSvgIcon } from '@mui/material'

export const ListView = createSvgIcon(
  <svg
    className='feather feather-list'
    fill='none'
    height='24'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    viewBox='0 0 24 24'
    width='24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <line x1='8' x2='21' y1='6' y2='6' />
    <line x1='8' x2='21' y1='12' y2='12' />
    <line x1='8' x2='21' y1='18' y2='18' />
    <line x1='3' x2='3.01' y1='6' y2='6' />
    <line x1='3' x2='3.01' y1='12' y2='12' />
    <line x1='3' x2='3.01' y1='18' y2='18' />
  </svg>,
  'List-View',
)

// eslint-disable-next-line import/no-default-export
export default ListView
