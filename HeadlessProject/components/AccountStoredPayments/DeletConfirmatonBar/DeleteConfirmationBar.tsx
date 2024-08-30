/* eslint-disable import/no-default-export */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation } from '@graphcommerce/graphql'
import { Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { deletePaymentTokenDocument } from '../../../graphql/StoreCardMethods/DeleteCustomerToken.gql'
import { CUSTOMER_PAYMENT_TOKENS } from '../../../graphql/my-account'
import { ConfirmDialog } from '../../common/ConfirmDialog'
import { UIContext } from '../../common/contexts/UIContext'

const DeleteConfirmationBar = ({ public_hash, maskedCC }) => {
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [formState, setFormState] = useState({ isSubmitting: false })
  const [, setState] = useContext(UIContext)

  const [deletePaymentToken] = useMutation(deletePaymentTokenDocument, {
    onCompleted: async () => {
      setFormState({ isSubmitting: false })
      await router.push({
        pathname: '/account/store-payment-methods',
      })
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'success',
            message: `Stored Payment Method was successfully removed.`,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
    },
    onError: () => {
      setFormState({ isSubmitting: false })
    },
    errorPolicy: 'all',
    refetchQueries: [{ query: CUSTOMER_PAYMENT_TOKENS }],
  })

  const submitHandler = useCallback(async () => {
    setFormState({ isSubmitting: true })

    await deletePaymentToken({ variables: { publicHash: public_hash } })
  }, [deletePaymentToken, public_hash])
  return (
    <>
      {formState.isSubmitting ? (
        <CircularProgress />
      ) : (
        <Button 
          color='error' 
          onClick={() => setOpenDialog(true)}
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
          }}>
          Delete
        </Button>
      )}
      <ConfirmDialog
        openDialog={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
        title={`Are you sure you want to delete this Card:${maskedCC} ?`}
        handleSubmit={async () => {
          setOpenDialog(false)
          await submitHandler()
        }}
      />
    </>
  )
}

export default DeleteConfirmationBar
