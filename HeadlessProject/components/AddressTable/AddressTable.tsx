/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQuery } from '@graphcommerce/graphql'
import { DeleteCustomerAddressFormDocument } from '@graphcommerce/magento-customer/components/DeleteCustomerAddressForm/DeleteCustomerAddressForm.gql'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import { iconChevronDown, IconSvg } from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { UIContext } from '../common/contexts/UIContext'

function AddressTable(props) {
  const { additionalAddresses } = props
  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'network-only' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [delId, setDelId] = useState<number>()
  const [pageSize, setPageSize] = useState(10)
  const [, setState] = useContext(UIContext)

  const [page, setPage] = useState(1)

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const itemsToShow = additionalAddresses.slice(startIndex, endIndex)
  const pageCount = Math.ceil(additionalAddresses.length / pageSize)
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1)

  const { handleSubmit } = useFormGqlMutation(
    DeleteCustomerAddressFormDocument,
    {
      onComplete: () => {
        setState((prevData) => ({
          ...prevData,
          alerts: [
            {
              type: 'success',
              message: 'You deleted the address',
              timeout: 5000,
              targetLink: '/account/addresses',
            },
          ],
        }))
      },
      defaultValues: { id: delId },
    },
    { errorPolicy: 'all', refetchQueries: ['AccountDashboardAddresses'] },
  )
  const submitHandler = handleSubmit(() => {})

  const buttonStyle = {
    color: '#006bb4',
    justifyContent: 'flex-start',
    paddingLeft: '0px',
    paddingRight: '1rem',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
    '&:active': {
      color: 'red',
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
  }

  return (
    <>
      <TableContainer>
        <Table
          sx={{
            tableLayout: 'fixed',
            'tr th, tr td': { padding: '10px 10px' },
            overflowX: 'auto',
            '& .MuiTableBody-root': {
              '& .MuiTableRow-root' :{
                borderBottom: '0',
              }
            }
          }}
        >
          <TableHead sx={{}}>
            <TableRow sx={{ th: { fontWeight: '600' } }}>
              <TableCell>
                <Trans id='First Name' />
              </TableCell>
              <TableCell>
                <Trans id='Last Name' />
              </TableCell>
              <TableCell>
                <Trans id='Street Address' />
              </TableCell>
              <TableCell>
                <Trans id='City' />
              </TableCell>
              <TableCell>
                <Trans id='Country' />
              </TableCell>
              <TableCell>
                <Trans id='State' />
              </TableCell>
              <TableCell>
                <Trans id='Zip/Postal Code' />
              </TableCell>
              <TableCell>
                <Trans id='Phone' />
              </TableCell>
              <TableCell>
                <Trans id='' />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{}}>
            {itemsToShow?.map((address) => {
              const country = countries?.find(
                (item) => item?.two_letter_abbreviation === address?.country_code,
              )
              return (
                <TableRow key={address?.id}>
                  <TableCell data-th="First Name">{address?.firstname}</TableCell>
                  <TableCell data-th="Last Name">{address?.lastname}</TableCell>
                  <TableCell data-th="Street Address">
                    {address?.street?.[0]}
                    {address?.street?.[1] && `, ${address?.street?.[1]}`}
                  </TableCell>
                  <TableCell data-th="City">{address?.city}</TableCell>
                  <TableCell data-th="Country">{country?.full_name_locale}</TableCell>
                  <TableCell data-th="State">{address?.region?.region}</TableCell>
                  <TableCell data-th="Zip/Postal Code">{address?.postcode}</TableCell>
                  <TableCell data-th="Phone">{address?.telephone}</TableCell>
                  <TableCell data-th="Actions">
                    <Box 
                       sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center'
                      }}
                    >
                      <Button
                        disableRipple
                        color='secondary'
                        size='medium'
                        sx={{ 
                          padding: '0',
                          minHeight: 'initial',
                          height: 'auto',
                          fontWeight: '400',
                          fontVariationSettings: "'wght' 400",
                          minWidth: 'initial',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={() =>
                          router.push(`/account/addresses/edit?addressId=${address?.id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Box
                        sx={{
                          display: 'inline-block',
                          width: '0.063rem',
                          height: '0.75rem',
                          backgroundColor: '#a6a6a6',
                          margin: '0 0.5rem'
                        }}
                      />
                      <Button
                        disableRipple
                        color='secondary'
                        size='medium'
                        sx={{ 
                          padding: '0',
                          minHeight: 'initial',
                          height: 'auto',
                          fontWeight: '400',
                          fontVariationSettings: "'wght' 400",
                          minWidth: 'initial',
                          color:"#d10029",
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                          setDelId(parseInt(address?.id, 10))
                          setOpenDialog(true)
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography>
          {additionalAddresses.length} item{additionalAddresses.length > 1 && 's'}
        </Typography>
        {pageNumbers?.length > 1 && (
          <Box>
            {page > 1 && (
              <Button
                disableRipple
                sx={{
                  fontSize: '0.9rem !important',
                  transform: 'rotate(90deg)',
                  '&:hover': { backgroundColor: 'white' },
                }}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  setPage(page - 1)
                }}
              >
                <IconSvg src={iconChevronDown} size='medium' />
              </Button>
            )}
            {pageNumbers.map((pageNumber) => (
              <Button
                disableRipple
                variant={page === pageNumber ? 'contained' : 'text'}
                size='medium'
                sx={{
                  padding: '0px 0px',
                  minWidth: '20px',
                  margin: '5px',
                  color: '#006bb4',
                  ...(page === pageNumber && {
                    fontWeight: '600',
                    borderRadius: '0',
                    backgroundColor: '#e5e5e5',
                    color: 'black',
                  }),
                  // padding: '0 0',
                }}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  setPage(pageNumber)
                }}
              >
                {pageNumber}
              </Button>
            ))}
            {page < pageCount && (
              <Button
                disableRipple
                sx={{
                  fontSize: '0.9rem !important',
                  transform: 'rotate(-90deg)',
                  '&:hover': { backgroundColor: 'white' },
                }}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  setPage(page + 1)
                }}
              >
                <IconSvg src={iconChevronDown} size='medium' />
              </Button>
            )}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Trans id='Show' />
          <Select
            labelId='items-to-show-label'
            id='items-to-show'
            value={pageSize}
            onChange={(e) => {
              setPage(1)
              setPageSize(Number(e.target.value))
            }}
            sx={{ 
              margin: '0 0.5rem',
              padding: '0',
              backgroundColor: '#f0f0f0',
              boxShadow: 'inset 0 1px 0 0 #fff, inset 0 -1px 0 0 rgba(204,204,204,0.3)',
              borderRadius: '3px',
              '& .MuiSelect-select': {
                padding: '4px 25px 5px 10px',
              }
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Trans id='per page' />
        </Box>
      </Box>
      <ConfirmDialog
        openDialog={openDialog}
        onClose={() => {
          setDelId(undefined)
          setOpenDialog(false)
        }}
        title='Are you sure you want to delete this address?'
        handleSubmit={() => {
          setOpenDialog(false)
          submitHandler()
        }}
      />
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default AddressTable
