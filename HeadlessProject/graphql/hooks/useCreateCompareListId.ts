/* eslint-disable react-hooks/exhaustive-deps */
import { useApolloClient } from '@graphcommerce/graphql'
import { CustomerDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import { createCompareListDocument } from '../compare-product/CreateCompareList.gql'
import useAssignCompareIdToCustomer from './useAssignCompareIdToCustomer'

const useCreateCompareListId = () => {
  const client = useApolloClient()
  const customer = useCustomerQuery(CustomerDocument)
  const { assignCompareList } = useAssignCompareIdToCustomer()

  return async (): Promise<string> => {
    if (customer?.data?.customer?.compare_list?.uid)
      return customer?.data?.customer?.compare_list?.uid

    const currentCompareId = localStorage.getItem('CompareListId')
    if (currentCompareId) return currentCompareId

    const { data } = await client.mutate({ mutation: createCompareListDocument })
    if (customer.data) {
      await assignCompareList(data?.createCompareList?.uid ?? '')
    }
    localStorage.setItem('CompareListId', data?.createCompareList?.uid ?? '')
    return data?.createCompareList?.uid ?? ''
  }
}

export default useCreateCompareListId
