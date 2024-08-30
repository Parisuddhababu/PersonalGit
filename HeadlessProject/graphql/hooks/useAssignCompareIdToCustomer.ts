import { useMutation } from '@graphcommerce/graphql'
import { assignCompareListToCustomerDocument } from '../compare-product/AssignCompareListToCustomer.gql'

const useAssignCompareIdToCustomer = () => {
  const [assignCompareIdToCustomer, { data, loading, error }] = useMutation(
    assignCompareListToCustomerDocument,
  )

  const assignCompareList = async (compareId: string) => {
    await assignCompareIdToCustomer({
      variables: { uid: compareId },
      onCompleted: () => {
        localStorage.removeItem('CompareListId')
      },
    })
  }

  return { assignCompareList, data, loading, error }
}

export default useAssignCompareIdToCustomer
