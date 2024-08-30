import { QueryHookOptions, TypedDocumentNode } from '@graphcommerce/graphql'
import { useCartIdCreate } from '@graphcommerce/magento-cart';
import {
  useFormGqlQuery,
  UseFormGqlQueryReturn,
  UseFormGraphQlOptions,
} from '@graphcommerce/react-hook-form'

export function useFormGqlQueryCart<
  Q extends Record<string, any>,
  V extends { cartId: string; [index: string]: unknown },
>(
  document: TypedDocumentNode<Q, V>,
  options: UseFormGraphQlOptions<Q, V> = {},
  operationOptions?: QueryHookOptions<Q, V>,
): UseFormGqlQueryReturn<Q, V> {
  const cartId = useCartIdCreate()

  const onBeforeSubmit = async (variables: V) => {
    const vars = { ...variables, cartId: await cartId() }
    return options.onBeforeSubmit ? options.onBeforeSubmit(vars) : vars
  }
  const result = useFormGqlQuery<Q, V>(
    document,
    { ...options, onBeforeSubmit },
    { errorPolicy: 'all', ...operationOptions, fetchPolicy: 'network-only', }
  )

  return result
}
