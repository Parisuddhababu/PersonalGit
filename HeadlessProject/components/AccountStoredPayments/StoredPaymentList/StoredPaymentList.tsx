/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { NoOrdersFound } from '@graphcommerce/magento-customer'
import { AccountOrdersFragment } from '@graphcommerce/magento-customer/components/AccountOrders/AccountOrders.gql'
import { Trans } from '@lingui/react'
import {
  SxProps,
  Theme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import DeleteConfirmationBar from '../DeletConfirmatonBar/DeleteConfirmationBar'
import style from '../Spreedly.module.scss'

export type AccountOrdersProps = AccountOrdersFragment & {
  sx?: SxProps<Theme>
}
type creditCardMapType = {
  [key: string]: string
}

export const creditCardIconsMap: creditCardMapType = {
  VI: 'visa',
  AE: 'american_express',
  MC: 'master',
  MI: 'maestro',
  JCB: 'jcb',
  DN: 'diners_club',
  DI: 'discover',
}

type PaymentToken = {
  __typename: string
  details: string
  public_hash: string
  payment_method_code: string
  type: string
}

export function StoredPaymentList(props: { paymentMethods: PaymentToken[] }) {
  const { paymentMethods } = props

  return (
    <div className={style['saved-card-wrapper']}>
      {paymentMethods && paymentMethods.length ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans id='Card Number' />
                </TableCell>
                <TableCell>
                  <Trans id='Expiration Date' />
                </TableCell>
                <TableCell colSpan={2}>
                  <Trans id='Type' />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentMethods?.map(({ type, public_hash, details }) => {
                if (type === 'card') {
                  const { type: detailsType, maskedCC, expirationDate } = JSON.parse(details)
                  return (
                    <TableRow key={type + detailsType + expirationDate + public_hash}>
                      <TableCell data-th={`${'Card Number'}`}>
                        {maskedCC && `${'ending in'} ${maskedCC} `}
                      </TableCell>
                      <TableCell data-th={`${'Expiration Date'}`}>
                        {expirationDate && `${expirationDate}`}
                      </TableCell>
                      <TableCell data-th={`${'Type'}`}>
                        <span className={`${creditCardIconsMap[detailsType]}-icon`} />
                      </TableCell>
                      <TableCell className='action' data-th={`${'Action'}`}>
                        <DeleteConfirmationBar public_hash={public_hash} maskedCC={maskedCC} />
                      </TableCell>
                    </TableRow>
                  )
                }
                return null
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        paymentMethods && !paymentMethods.length && <NoOrdersFound />
      )}
    </div>
  )
}
