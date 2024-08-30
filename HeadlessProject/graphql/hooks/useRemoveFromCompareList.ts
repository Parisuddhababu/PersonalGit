import { useMutation } from '@graphcommerce/graphql'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { UIContext } from '../../components/common/contexts/UIContext'
import { removeProductsFromCompareListDocument } from '../compare-product/RemoveCompareProducts.gql'

const useRemoveFromCompareList = () => {
  const router = useRouter()
  const [removeFromCompareProduct, { data, loading, error }] = useMutation(
    removeProductsFromCompareListDocument,
  )
  const [, setState] = useContext(UIContext)

  const removeCompareProduct = async (type, name, compareId, arr) => {
    await removeFromCompareProduct({ variables: { uid: compareId, products: arr } })
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          type: 'success',
          message:
            type === 'all'
              ? `<span>You cleared the comparison list.</span>`
              : `<span>You removed product ${name} from the <a href='/compare'>comparison list.</a></span>`,
          timeout: 5000,
          targetLink: router?.pathname,
        },
      ],
    }))
  }

  return { removeCompareProduct, loading, data, error }
}

export default useRemoveFromCompareList
