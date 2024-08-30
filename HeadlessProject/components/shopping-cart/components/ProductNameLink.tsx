import { PenIcon } from '@components/Icons'
import { useLazyQuery } from '@graphcommerce/graphql'
import { CartItemFragment } from '@graphcommerce/magento-cart-items'
import { useProductLink } from '@graphcommerce/magento-product'
import { IconSvg } from '@graphcommerce/next-ui'
import { EditCartDetailsDocument } from '@graphql/cart/edit-cart-details/EditCartDetails.gql'
import { useRouter } from 'next/router'
import { Link, Theme } from '@mui/material'

export type ProductNameLink = CartItemFragment['product'] & {
  iconLink?: boolean
  cartItemId?: string | null
  itemId?: number | null
  uid?: string | null
}

export const ProductNameLink = (props: ProductNameLink): JSX.Element => {
  //NOSONAR
  const { name, cartItemId, itemId, uid } = props
  const router = useRouter()
  const [cartDetails] = useLazyQuery(EditCartDetailsDocument, { fetchPolicy: 'network-only' })
  const productLink = useProductLink(props)

  const productName = (name: string) => {
    if (props.iconLink) {
      return <IconSvg src={PenIcon} />
    }
    if (name) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: name,
          }}
        />
      )
    }
  }

  const handleRedirect = async () => {
    await cartDetails({
      variables: {
        id: cartItemId?.toString() ?? '',
        productId: itemId?.toString() ?? '',
      },
    })
      .then((data) => {
        const cartData = data.data?.GetEditProduct
        const encoded = encodeURIComponent(JSON.stringify({ ...cartData, uid, cartItemId }))
        router.push({ pathname: productLink, query: { data: encoded } })
      })
      .catch(() => {
        router.push(productLink)
      })
  }
  const linkStyle = (theme: Theme) => ({
    typgrapht: 'subtitle1',
    // fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    textDecoration: 'none',
    flexWrap: 'nowrap',
    maxWidth: 'max-content',
    '&:not(.withOptions)': {
      alignSelf: 'flex-end',
    },
    fontSize: '1.125rem',
    lineHeight: '1.5rem',
    display: 'inline-block',
    marginBottom: '1rem',
    marginTop: '0.5rem',
  })

  return (
    <Link
      // href={productLink}
      onClick={handleRedirect}
      underline='hover'
      sx={(theme) => linkStyle(theme)}
    >
      {name ? productName(name) : ''}
    </Link>
  )
}

export default ProductNameLink
