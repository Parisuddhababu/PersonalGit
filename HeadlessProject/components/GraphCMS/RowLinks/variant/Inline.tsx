import { VariantInline } from '@graphcommerce/next-ui'
import { Link } from '@mui/material'

import { RowLinksFragment } from '../RowLinks.gql'

export function Inline(props: RowLinksFragment) {
  const { title, pageLinks } = props
  const customStyles = (theme) => ({ my: theme.spacings.md })
  return (
    <VariantInline title={title} maxWidth={false} sx={customStyles}>
      {pageLinks.map((pageLink) => (
        <Link href={pageLink.url} key={pageLink.id} color='inherit' underline='hover'>
          {pageLink.title}
        </Link>
      ))}
    </VariantInline>
  )
}
