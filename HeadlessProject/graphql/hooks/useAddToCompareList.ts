import { useMutation } from '@graphcommerce/graphql'
import { useContext } from 'react'
import { UIContext } from '../../components/common/contexts/UIContext'
import { addProductsToCompareListDocument } from '../compare-product/AddToCompareList.gql'
import { compareListDocument } from '../compare-product/CompareList.gql'
import useCreateCompareListId from './useCreateCompareListId'

const useAddToCompareList = () => {
  const [addToCompareListMutation, { loading, data, error }] = useMutation(
    addProductsToCompareListDocument,
  )
  const compareId = useCreateCompareListId()
  const [, setState] = useContext(UIContext)

  const addToCompareList = async (ids: string[], name: string, path: string) => {
    await addToCompareListMutation({
      variables: { uid: await compareId(), products: ids },
      onCompleted: (res) => {
        setState((prev) => ({
          ...prev,
          compareId: res?.addProductsToCompareList?.uid,
          compareLoading: false,
          alerts: [
            {
              type: 'success',
              message: `<span>You added product ${name} to the <a href='/compare'>comparison list.</span>`,
              timeout: 5000,
              targetLink: path,
            },
          ],
        }))
      },
      refetchQueries: (result) => [
        {
          query: compareListDocument,
          variables: {
            uid: result.data?.addProductsToCompareList?.uid,
          },
        },
      ],
    })
  }

  return { addToCompareList, loading, data, error }
}

export default useAddToCompareList
