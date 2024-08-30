/* eslint-disable no-nested-ternary */
import { cloneDeep } from '@graphcommerce/graphql'
import {
  FilterTypes,
  useProductListLinkReplace,
  useProductListParamsContext,
} from '@graphcommerce/magento-product'
import { ProductListFiltersFragment } from '@graphcommerce/magento-product/components/ProductListFilters/ProductListFilters.gql'
import { ChipMenuProps, iconCancelAlt, IconSvg } from '@graphcommerce/next-ui'
import { Box, Button, Container, Typography, IconButton } from '@mui/material'
import { useState } from 'react'
import { SelectType } from './FilterTypes'
import { Closemenu } from '../../components/Icons'

export type ProductFiltersProps = ProductListFiltersFragment & {
  filterTypes: FilterTypes
} & Omit<ChipMenuProps, 'selected' | 'selectedLabel' | 'children' | 'label' | 'onDelete'>

interface AggregationOption {
  __typename?: string | null
  label?: string | null
  value?: string | null
  count?: number | null
  parentLabel?: string | null
  parentAttributeCode?: string | null
}

const Filter = (props: ProductFiltersProps) => {
  const { aggregations, filterTypes, ...chipMenuProps } = props
  const { params } = useProductListParamsContext()
  // delete params.filters.category_uid
  // delete params.filters.category_id
  const replaceRoute = useProductListLinkReplace({ scroll: false })
  const selectedFiltersEntries = Object.entries(params.filters)
  const [currAccordion, setCurrAccordion] = useState<string | null | undefined>('')
  const inValues: ({ key: string; value: string } | { key: string; value: string[] })[] =
    selectedFiltersEntries
      .map(([key, value]) => {
        const filterValue = value as { in: string[]; from: string[]; to: string[] }
        return filterValue.from
          ? { key, value: `${filterValue.from}-${filterValue.to}` }
          : { key, value: filterValue.in }
      })
      .flat()

  const selectedFiltersKeys = Object.keys(params.filters)

  const selectedAggregations = aggregations?.filter((item) =>
    selectedFiltersKeys.includes(item?.attribute_code ?? ''),
  )

  const selectedFilters = selectedAggregations?.map((item) => ({
    label: item?.label,
    attribute_code: item?.attribute_code,
    attribute: item?.options?.filter((options) => {
      if (item?.attribute_code === 'price') {
        return inValues.some(
          (value) => value?.key === item?.attribute_code && value?.value === options?.label,
        )
      }
      return inValues.some(
        (value) =>
          value?.key === item?.attribute_code && value?.value?.includes(options?.value ?? ''),
      )
    }),
  }))

  const filterList = selectedFilters?.reduce<AggregationOption[]>((acc, curr) => {
    const options =
      curr.attribute?.map((attr) => ({
        parentAttributeCode: curr.attribute_code,
        parentLabel: curr.label,
        ...attr,
      })) ?? []
    return [...acc, ...options]
  }, [])

  const removeFilter = (item) => {
    const linkParams = cloneDeep(params)
    if (item?.parentAttributeCode === 'price') {
      delete linkParams.filters[item?.parentAttributeCode]
    } else {
      linkParams.filters[item?.parentAttributeCode] = {
        in: linkParams.filters[item?.parentAttributeCode]?.in?.filter((v) => v !== item?.value),
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replaceRoute(linkParams)
  }

  const renderLabel = (item: string | null | undefined, attribute: string | null | undefined) => {
    if (attribute === 'price') {
      const split = item?.split('-')
      const withCurrency = `$${split?.[0]} - $${split?.[1]}`
      return withCurrency
    }
    if (item === '0') {
      return 'No'
    } else {
      return item
    }
  }

  const handleClearAll = () => {
    const linkParams = cloneDeep(params)
    linkParams.filters = {}
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replaceRoute(linkParams)
  }

  return (
    <Box
      sx={{
        paddingRight: { xs: '0', md: '1.55rem' },
      }}
    >
      {/* <Container
        sx={{
          paddingTop: 'max(10px, min((3.33px + 2.08vw), 30px))',
          paddingLeft: '0px !important',
          paddingRight: '0px !important',
        }}
      > */}

      {filterList && filterList?.length > 0 && (
        <Box
          sx={{
            padding: '0 10px 10px',
          }}
        >
          <Typography sx={{ marginBottom: '8px', fontSize: '14px !important' }}>
            Now Shopping by
          </Typography>
          {filterList &&
            filterList?.length > 0 &&
            filterList?.map((item) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}
                key={item?.label}
              >
                
                <IconButton
                  size='small'
                  aria-label="close"
                  onClick={() => removeFilter(item)}
                  sx={{
                    marginLeft: '-0.375rem',
                  }}
                >
                    <Closemenu fontSize='inherit'/>
                </IconButton>
                <Typography component='span' sx={{ fontWeight: '600' }}>
                  {item?.parentLabel} :{' '}
                  <Typography component='span' sx={{ color: '#757575' }}>
                    {item?.label === '1'
                      ? 'Yes'
                      : renderLabel(item?.label, item?.parentAttributeCode)}
                  </Typography>
                </Typography>
              </Box>
            ))}
          <Button
            sx={{
              color: '#006bb4',
              padding: '5px 0px',
              minWidth: 'initial',
              fontWeight: '400',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: 'white',
              },
            }}
            onClick={() => handleClearAll()}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* {!(filterList && filterList?.length > 0) && ( */}
      <Typography
        sx={{
          padding: '10px 10px',
          fontSize: '14px',
          color: '#333333',
          fontWeight: '600',
          borderBottom: '1px solid #cccccc',
        }}
      >
        Shopping Options
      </Typography>
      {/* )} */}

      {aggregations?.map((aggregation) => {
        if (
          !aggregation?.attribute_code
          // aggregation?.attribute_code === 'category_id' ||
          // aggregation?.attribute_code === 'category_uid'
        )
          return null

        switch (filterTypes[aggregation.attribute_code]) {
          case 'FilterEqualTypeInput':
            if (
              aggregation.options?.[0]?.label === '0' ||
              aggregation.options?.[1]?.label === '0' ||
              aggregation.options?.[0]?.label === '1' ||
              aggregation.options?.[1]?.label === '1' ||
              aggregation?.label === 'Category'
            ) {
              if (
                filterList &&
                aggregation?.label === 'Category' &&
                filterList?.filter((el) => el?.parentLabel === 'Category')?.length > 0
              ) {
                return null
              }
              return (
                <SelectType
                  currAccordion={[currAccordion, setCurrAccordion]}
                  key={aggregation.attribute_code}
                  filterType='YesNoType'
                  {...aggregation}
                  {...chipMenuProps}
                />
              )
            }

            return (
              <SelectType
                currAccordion={[currAccordion, setCurrAccordion]}
                key={aggregation.attribute_code}
                filterType='SelectType'
                {...aggregation}
                {...chipMenuProps}
              />
            )

          case 'FilterRangeTypeInput':
            return (
              <SelectType
                currAccordion={[currAccordion, setCurrAccordion]}
                key={aggregation.attribute_code}
                filterType='RangeType'
                {...aggregation}
                {...chipMenuProps}
              />
            )
        }
        return null
      })}
      {/* </Container> */}
    </Box>
  )
}

// eslint-disable-next-line import/no-default-export
export default Filter
