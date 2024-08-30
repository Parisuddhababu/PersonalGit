/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react-hooks/rules-of-hooks */
import { TextFieldElement } from '@graphcommerce/ecommerce-ui'
import {useLazyQuery} from '@graphcommerce/graphql'
import { ProductListDocument } from '@graphcommerce/magento-product'
import { CategorySearchDocument, CategorySearchResult } from '@graphcommerce/magento-search'

import { FormRow, iconSearch, IconSvg, extendableComponent } from '@graphcommerce/next-ui'

import { FieldValues, SubmitHandler, useForm } from '@graphcommerce/react-hook-form'
import { i18n } from '@lingui/core'

import { Box, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import debounce from "@mui/utils/debounce";

const name = 'SearchForm' as const
const parts = ['root', 'totalProducts'] as const
const { classes } = extendableComponent(name, parts)

export function SearchFormComp(props: { showSearch?: boolean }) {
  const { showSearch } = props

  const form = useForm()
  const { handleSubmit, watch, control } = form

  const handleDebouncedSearch = debounce(async (searchValue) => {
      await getProducts({
          variables: { search: searchValue, pageSize: 12 },
      })
      await getCategory({
          variables: { search:  searchValue},
      })
  }, 1000)

  const [getProducts, {data: products}] = useLazyQuery(ProductListDocument)

  const [getCategory, { data: categories }] = useLazyQuery(CategorySearchDocument)

  const totalSearchResults = products?.products?.total_count ?? 0

  const searchInputElement = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchInputElement.current?.focus()
  }, [])
  const urlHandle = 'search'
  const router = useRouter()

  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    data.search && data.search.length >= 3 && router.replace(`/${urlHandle}/${data.search}`)
  }

  const endAdornment = !watch('search') ? (
    <IconButton
      size='small'
      aria-label={i18n._(/* i18n */ 'Search')}
      sx={{
        fontSize: '1rem',
        marginRight: '0.13rem',
      }}
    >
      <IconSvg src={iconSearch} />
    </IconButton>
  ) : (
    <>
      {totalSearchResults > 0 && (
        <Box
          className={classes.totalProducts}
          sx={(theme) => ({
            minWidth: 'max-content',
            color: theme.palette.text.disabled,
            paddingRight: '7px',
          })}
        >
          {totalSearchResults === 1 && <Typography>{totalSearchResults} result</Typography>}
          {totalSearchResults > 1 && <Typography>{totalSearchResults} results</Typography>}
        </Box>
      )}
    </>
  )

  return (
    <Box
      className={`${classes.root} ${showSearch ? 'show' : ''}`}
      component='form'
      noValidate
      sx={{
        position: { xs: 'absolute', md: 'relative' },
        top: { xs: '102%', md: '0' },
        left: '0',
        right: '0',
        backgroundColor: '#ffffff',
        padding: { xs: '10px 15px', md: '0' },
        borderBottom: { xs: '1px solid #cccccc', md: '0' },
        transition: '.3s all',
        opacity: { xs: '0', md: '1' },
        display: { xs: 'none', md: 'block' },
        '&.show': {
          opacity: '1',
          display: 'block',
        },
      }}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <FormRow sx={{ padding: '0', marginRight: '0px' }}>
        <TextFieldElement
          placeholder='Search entire store here...'
          variant='outlined'
          type='text'
          name='search'
          control={control}
          InputProps={{ endAdornment }}
          onChange={(e) => {
            handleDebouncedSearch(e.target.value)
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0',
              padding: '0',
            },
            '& .MuiInputBase-root': {
              color: '#000000',
            },
            '& input': {
              padding: '5px 10px',
              height: '32px',
              fontSize: '16px',
              lineHeight: 'normal',
              boxSizing: 'border-box',
              width: { xs: '100%', md: '215px' },
              color: '#000000',
              '&::-webkit-input-placeholder': {
                color: '#000000',
                opacity: 1,
              },
              '&:-ms-input-placeholder': {
                color: '#000000',
                opacity: 1,
              },
              '&::placeholder': {
                color: '#000000',
                opacity: 1,
              },
            },
          }}
        />
      </FormRow>
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '2.584rem', md: '2.5rem' },
          width: { xs: 'calc( 100% - 30px )', md: '100%' },
          '& .MuiButton-pill': {
            padding: '0.625rem 0.75rem',
          },
        }}
      >
        {categories?.categories?.items?.map((category) => (
          <CategorySearchResult key={category?.url_path} {...category} />
        ))}
      </Box>
    </Box>
  )
}
