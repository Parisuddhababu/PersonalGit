/* eslint-disable no-unsafe-optional-chaining */
import { useQuery, cloneDeep } from '@graphcommerce/graphql'
import {
  ProductListSortFragment,
  useProductListParamsContext,
  useProductListLinkReplace,
} from '@graphcommerce/magento-product'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { ChipMenuProps, extendableComponent } from '@graphcommerce/next-ui'
import { FormControl, MenuItem, Select, SxProps, Theme } from '@mui/material'

export type ProductListSortProps = ProductListSortFragment &
  Omit<ChipMenuProps, 'selected' | 'selectedLabel' | 'children' | 'label' | 'onDelete'> & {
    sx?: SxProps<Theme>
  } & { currentSort: string }

const name = 'ProductListSort' as const
const parts = ['menu', 'item', 'link'] as const
const { classes } = extendableComponent(name, parts)

const Sort = (props: ProductListSortProps) => {
  const { sort_fields, currentSort: sort, total_count, sx = [] } = props
  const { params } = useProductListParamsContext()
  const { data: storeConfigQuery } = useQuery(StoreConfigDocument)
  const replaceRoute = useProductListLinkReplace()
  const defaultSort = 'position'
  const [currentSort = defaultSort] = Object.keys(params.sort)

  const handleSort = (item) => {
    const linkParams = cloneDeep(params)
    linkParams.sort = {}
    linkParams.sort[item] = sort
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replaceRoute(linkParams)
  }

  if (!total_count) return null

  return (
    <FormControl
      variant='standard'
      sx={{
        minWidth: '8.125rem',
        margin: '0 0.2rem 0 0.65rem',
      }}
    >
      {/* <InputLabel id='sortBy'>Sort by</InputLabel> */}
      <Select
        labelId='sortBy'
        id='sortSelect'
        value={currentSort}
        label='Sort by'
        onChange={(e) => {
          handleSort(e.target.value)
        }}
        sx={{
          backgroundColor: '#f0f0f0',
          color: '#00000',
          minWidth: '8.125rem',
          // padding: '0.028rem 0.375rem',
          padding: '0',
          border: '1px solid #cccccc',
          borderRadius: '0.188rem',
          boxShadow: 'inset 0 1px 0 0 #ffffff, inset 0 -1px 0 0 rgba(204,204,204,0.3)',
          '& .MuiSelect-select': {
            padding: '4px 25px 5px 10px'
          },
          '&:before, &:after': {
            content: `none`,
          },
          '& svg': {
            color: '#000000',
          },
        }}
      >
        {sort_fields?.options?.map((option) => (
          <MenuItem value={option?.value ?? ''} className={classes.item} key={option?.value ?? ''}>
            {option?.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

// eslint-disable-next-line import/no-default-export
export default Sort
