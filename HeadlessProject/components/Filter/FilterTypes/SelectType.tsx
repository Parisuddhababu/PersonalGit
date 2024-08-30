/* eslint-disable no-nested-ternary */
import { cloneDeep } from '@graphcommerce/graphql'
import type { FilterEqualTypeInput } from '@graphcommerce/graphql-mesh'
import { useProductListParamsContext, ProductListLink } from '@graphcommerce/magento-product'

import { ProductListFiltersFragment } from '@graphcommerce/magento-product/components/ProductListFilters/ProductListFilters.gql'
import {
  responsiveVal,
  extendableComponent,
  ChipMenuProps,
  IconSvg,
  iconChevronDown,
} from '@graphcommerce/next-ui'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  listItemTextClasses,
  Theme,
  Typography,
} from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import type { SetRequired } from 'type-fest'

type OwnerState = {
  isColor: boolean
  isActive: boolean
}
const componentName = 'FilterEqual' as const
const parts = [
  'listItem',
  'listItemInnerContainer',
  'checkbox',
  'linkContainer',
  'button',
  'resetButton',
  'filterAmount',
  'filterLabel',
  'isColor',
  'isActive',
] as const

const { selectors, withState } = extendableComponent<
  OwnerState,
  typeof componentName,
  typeof parts
>(componentName, parts)

export type FilterIn = SetRequired<Omit<FilterEqualTypeInput, 'eq'>, 'in'>

type CustomCurrentFilterType = {
  from?: string
  to?: string
}

type Filter = NonNullable<NonNullable<ProductListFiltersFragment['aggregations']>[number]>

type customTypes = {
  filterType: string
}
type FilterEqualTypeProps = Filter &
  Omit<ChipMenuProps, 'selected'> &
  customTypes & {
    currAccordion: [string | null | undefined, Dispatch<SetStateAction<string | null | undefined>>]
  }

const SelectType = (props: FilterEqualTypeProps) => {
  const { attribute_code, label, options, filterType, currAccordion } = props
  const [accordion, setAccordion] = currAccordion
  const { params } = useProductListParamsContext()
  const currentFilter: FilterEqualTypeInput & CustomCurrentFilterType = cloneDeep(
    params.filters[attribute_code],
  ) ?? {
    in: [],
  }

  const getFilterLabel = (option: string | null | undefined) => {
    if (filterType === 'RangeType') {
      const split = option?.split('-')
      const withCurrency = `$${split?.[0]} - $${split?.[1]}`
      return withCurrency
    }
    if (option === '1') {
      return 'yes'
    } else {
      if (option === '0') {
        return 'No'
      } else {
        return option
      }
    }
  }

  const handleSelectTypeFilter = (value, filters) => {
    if (currentFilter.in?.includes(value)) {
      filters[attribute_code] = {
        ...currentFilter,
        in: currentFilter.in?.filter((v) => v !== value),
      }
    } else {
      filters[attribute_code] = {
        ...currentFilter,
        in: [...(currentFilter?.in ?? []), value],
      }
    }
  }

  const handleRangeTypeFilter = (label, filters) => {
    if (currentFilter.from === label?.split('-')[0]) {
      delete filters[attribute_code]
    } else {
      filters[attribute_code] = {
        ...currentFilter,
        from: label?.split('-')[0],
        to: label?.split('-')[1],
      }
    }
  }

  const handleYesNoTypeFilter = (value, filters) => {
    if (currentFilter.in?.includes(value)) {
      delete filters[attribute_code]
    } else {
      filters[attribute_code] = {
        ...currentFilter,
        in: [value],
      }
    }
  }

  const handleVariables = (option) => {
    const filterLabel = getFilterLabel(option.label)
    const labelId = `filter-equal-${attribute_code}-${option?.value}`
    const filters = cloneDeep(params.filters)
    const isColor = !!attribute_code?.toLowerCase().includes('color')
    const isActive = Boolean(isColor && currentFilter.in?.includes(option?.value) && isColor)
    const cls = withState({ isColor, isActive })
    return { filterLabel, labelId, filters, isColor, isActive, cls }
  }

  const listItemStyle = (theme: Theme) => ({
    padding: `0 ${theme.spacings.xxs} 0`,
    display: 'block',
    '&:not(:nth-last-of-type(-n+2)) > div': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  })

  const getBoxStyle = (theme: Theme) => ({
    width: '100%',
    paddingTop: responsiveVal(0, 3),
    paddingBottom: theme.spacings.xxs,
    paddingRight: '1.5rem !important',
    '& > div': {
      display: 'inline-block',
      [theme.breakpoints.down('md')]: {
        maxWidth: '72%',
      },
    },
  })

  const getListItemTextStyle = (theme) => ({
    [`& .${listItemTextClasses.primary}`]: {
      display: 'inline',
      overflow: 'hidden',
      whiteSpace: 'break-spaces',
    },
    [`& .${listItemTextClasses.secondary}`]: {
      color: theme.palette.grey[500],
      marginLeft: `4px`,
      fontSize: theme.typography.pxToRem(11),
      display: 'inline',
    },
  })

  const anyFilterActive = Object.keys(params.filters ?? {}).length >= 1

  const handleAccordion = (code: string | null | undefined) => {
    accordion === code ? setAccordion('') : setAccordion(code)
  }
  return (
    <Accordion
      expanded={accordion === attribute_code}
      onChange={() => handleAccordion(attribute_code)}
    >
      <AccordionSummary expandIcon={<IconSvg src={iconChevronDown} size='medium' />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {options?.map((option) => {
          if (!option?.value) return null
          const { filterLabel, labelId, filters, isColor, isActive, cls } = handleVariables(option)
          switch (filterType) {
            case 'SelectType':
              handleSelectTypeFilter(option.value, filters)
              break
            case 'RangeType':
              handleRangeTypeFilter(option.label, filters)
              break
            case 'YesNoType':
              handleYesNoTypeFilter(option.value, filters)
          }

          return (
            <ProductListLink
              {...params}
              filters={filters}
              currentPage={undefined}
              key={filterType === 'RangeType' ? option?.label : option?.value}
              color='inherit'
              link={{
                replace:
                  filterType === 'RangeType' || filterType === 'YesNoType' ? true : anyFilterActive,
                prefetch: false,
              }}
            >
              <ListItem dense className={cls.listItem} sx={(theme) => listItemStyle(theme)}>
                <Box className={cls.listItemInnerContainer} sx={(theme) => getBoxStyle(theme)}>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{ display: 'inline-block' }}
                        dangerouslySetInnerHTML={{
                          __html: filterLabel ?? '',
                        }}
                      />
                    }
                    secondary={option?.count && `(${option?.count})`}
                    sx={(theme) => getListItemTextStyle(theme)}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge='start'
                      checked={
                        filterType === 'RangeType'
                          ? currentFilter.from === option.label?.split('-')[0]
                          : currentFilter.in?.includes(option?.value ?? '')
                      }
                      tabIndex={-1}
                      size='medium'
                      color='primary'
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      className={cls.checkbox}
                      sx={[
                        {
                          padding: 0,
                          margin: '-10px 0 0 0',
                          float: 'right',
                          borderRadius: '50px',
                        },
                        isColor && {
                          border: 1,
                          borderColor: 'divider',
                          '& > *': {
                            opacity: 0,
                          },
                        },
                        isActive &&
                          ((theme) => ({
                            border: `1px solid ${theme.palette.primary.main}`,
                            boxShadow: `inset 0 0 0 4px ${theme.palette.background.paper}`,
                          })),
                      ]}
                      style={
                        isColor
                          ? { background: `${option?.label}`, color: `${option?.label}` }
                          : undefined
                      }
                    />
                  </ListItemSecondaryAction>
                </Box>
              </ListItem>
            </ProductListLink>
          )
        })}
      </AccordionDetails>
    </Accordion>
  )
}

SelectType.selectors = selectors

// eslint-disable-next-line import/no-default-export
export default SelectType
