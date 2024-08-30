import { Link, Typography, SxProps } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { Theme } from '@mui/material/styles'

type BreadcrumbsPropType =
  | ({
      category_uid: string
      category_name?: string | null
      category_url_path?: string | null
    } | null)[]
  | null
  | undefined

const Breadcrumb = ({
  breadcrumb,
  name,
  sx,
}: {
  breadcrumb: BreadcrumbsPropType
  name: string
  sx?: SxProps<Theme>
}): JSX.Element => (
  <Breadcrumbs sx={sx} separator='›' aria-label='breadcrumb'>
    <Link underline='hover' color='text.primary' href='/'>
      Home
    </Link>
    {breadcrumb &&
      breadcrumb?.length > 0 &&
      breadcrumb?.map((item) => (
        <Link
          key={item?.category_uid}
          href={`/${item?.category_url_path}`}
          underline='hover'
          color='text.primary'
        >
          {item?.category_name}
        </Link>
      ))}

    <Typography color='inherit' dangerouslySetInnerHTML={{ __html: name }} />
  </Breadcrumbs>
)

// eslint-disable-next-line import/no-default-export
export default Breadcrumb
