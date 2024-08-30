import { iconChevronDown, IconSvg } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Button, MenuItem, Select } from '@mui/material'

export const Pagination = (props) => {
  const {
    totalPages,
    currentPageState,
    routingFn = () => {},
    pageNumbers,
    pageSizeState,
    sizeOptions,
    itemsCount,
  } = props
  const [currentPage, setCurrentPage] = currentPageState
  const [pageSize, setPageSize] = pageSizeState
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: { xs: 'center', md: 'space-between' },
        alignItems: 'center',
        marginBottom: { xs: '1rem', md: '2.4rem', lg: '3.4rem' },
      }}
    >
      {itemsCount && itemsCount}
      <Box>
        {totalPages > 1 && (
          <>
            <Button
              sx={{
                fontSize: '0.9rem !important',
                transform: 'rotate(90deg)',
                padding: '0 0.125rem 0 0',
                height: '1.875rem',
                width: '1.875rem',
                minWidth: '1.875rem',
                '&:hover': { backgroundColor: 'white' },
                ...(currentPage === 1 && { display: 'none' }),
              }}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1)
                  routingFn('pageNum', currentPage - 1)
                }
              }}
            >
              <IconSvg src={iconChevronDown} size='medium' />
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                size='medium'
                sx={{
                  padding: '0px 0px',
                  minWidth: '1.563rem',
                  height: '1.563rem',
                  width: '1.563rem',
                  margin: '5px',
                  color: '#006bb4',
                  ...(currentPage === pageNumber && {
                    fontWeight: '600',
                    borderRadius: '0',
                    backgroundColor: '#e5e5e5',
                    color: 'black',
                  }),
                }}
                key={pageNumber}
                onClick={() => {
                  setCurrentPage(pageNumber)
                  routingFn('pageNum', pageNumber)
                }}
                disabled={pageNumber === currentPage}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              sx={{
                fontSize: '0.9rem !important',
                transform: 'rotate(-90deg)',
                padding: '0 0.125rem 0 0',
                height: '1.875rem',
                minWidth: '1.875rem',
                width: '1.875rem',
                '&:hover': { backgroundColor: 'white' },
                ...(currentPage === totalPages && { display: 'none' }),
              }}
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1)
                  routingFn('pageNum', currentPage + 1)
                }
              }}
            >
              <IconSvg src={iconChevronDown} size='medium' />
            </Button>
          </>
        )}
      </Box>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Trans id='Show' />
        <Select
          labelId='items-to-show-label'
          id='items-to-show'
          value={pageSize}
          onChange={(e) => {
            setCurrentPage(1)
            setPageSize(Number(e.target.value))
            routingFn('pageSize', Number(e.target.value))
          }}
          sx={{
            margin: '0px 10px',
            // padding: '0 0',
            // '& .MuiSelect-select': {
            //   padding: '0.375rem 0.875rem 0.375rem 0.625rem',
            // },
            // '&.Mui-focused': {
            //   '& .MuiOutlinedInput-notchedOutline': {
            //     borderColor: '#1979c3',
            //   },
            // },
          }}
        >
          {sizeOptions &&
            sizeOptions?.length > 0 &&
            sizeOptions.map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
        </Select>
        <Trans id='per page' />
      </Box>
    </Box>
  )
}
