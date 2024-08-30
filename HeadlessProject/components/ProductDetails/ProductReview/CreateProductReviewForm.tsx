import { UIContext } from '@components/common/contexts/UIContext'
import { useQuery } from '@graphcommerce/graphql'
import { ProductReviewRatingInput } from '@graphcommerce/graphql-mesh'
import { ApolloCustomerErrorAlert } from '@graphcommerce/magento-customer'
import {
  CreateProductReviewDocument,
  ProductReviewRatingsMetadataDocument,
} from '@graphcommerce/magento-review'
import {
  Form,
  FormActions,
  FormRow,
  StarRatingField,
  extendableComponent,
  Button,
} from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import { Box, TextField, Typography, SxProps, Theme, FormControl, InputLabel } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

type CreateProductReviewFormProps = {
  sku: string
  nickname?: string
  sx?: SxProps<Theme>
  setSelectedIndex?: any
}

const name = 'CreateProductReviewForm' as const
const parts = [
  'root',
  'ratingContainer',
  'rating',
  'ratingLabel',
  'submitButton',
  'cancelButton',
  'formActions',
] as const
const { classes } = extendableComponent(name, parts)

export function CreateProductReviewForm(props: CreateProductReviewFormProps) {
  const { sku, sx = [], setSelectedIndex } = props
  const [ratings, setRatings] = useState<ProductReviewRatingInput[]>([])
  const [, setState] = useContext(UIContext)
  const [submitClicked, setSubmitClicked] = useState(false)
  const router = useRouter()
  const msg = 'Please select one of each of the ratings above.'
  const [errorMessage, setErrorMessage] = useState(msg)
  const { data, loading } = useQuery(ProductReviewRatingsMetadataDocument)

  const form = useFormGqlMutation(
    CreateProductReviewDocument,
    {
      defaultValues: { sku },
      onBeforeSubmit: (formData) => ({
        ...formData,
        ratings: ratings.some((r) => r.value_id === '') ? [] : ratings,
      }),
    },
    { errorPolicy: 'all' },
  )

  const { handleSubmit, muiRegister, formState, required, error, reset } = form
  const submittedReviewSuccess = formState.isSubmitSuccessful && data
  const submitHandler = () => {
    setSubmitClicked(true)
    if (submitClicked && ratings.some((r) => r.value_id === '')) {
      return
    }
    handleSubmit((dataHandle) => {
      reset({
        ...dataHandle,
        nickname: '',
        summary: '',
        text: '',
      })
      setRatings([
        {
          id: '',
          value_id: '',
        },
      ])
    })()
  }

  useEffect(() => {
    if (loading || !data) return

    // set initial state
    if (ratings.length === 0) {
      const reviewMetadataRatings = data.productReviewRatingsMetadata.items.map((metadata) => ({
        id: metadata?.id ?? '',
        value_id: '',
      }))

      setRatings(reviewMetadataRatings)
    }
    if (submittedReviewSuccess) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'success',
            message: `<span>You submitted your review for moderation</span>`,
            timeout: 8000,
            targetLink: router?.pathname,
          },
        ],
      }))
      reset()
      setErrorMessage('')
      setSelectedIndex(0)
    }
    if (error) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'success',
            message: `<span>${error.message}</span>`,
            timeout: 8000,
            targetLink: router?.pathname,
          },
        ],
      }))
      reset()
      setErrorMessage('')
      setSelectedIndex(0)
    }
  }, [loading, data, ratings.length, submittedReviewSuccess, error])

  if (!data) return null

  return (
    <>
      <Form noValidate className={classes.root} sx={{ ...sx, paddingBottom: '0' }}>
        <Box>
          <InputLabel required>Your Rating</InputLabel>
        </Box>

        <Box
          className={classes.ratingContainer}
          sx={(theme) => ({
            marginTop: '0',
            marginBottom: '1rem',
          })}
        >
          {data?.productReviewRatingsMetadata?.items?.map((item) => (
            <FormRow
              key={item?.id}
              className={classes.rating}
              sx={{
                // paddingBottom: 'unset',
                // gridTemplateColumns: `minmax(${responsiveVal(60, 80)}, 0.1fr) max-content`,
                display: 'flex',
                justifyContent: 'flex-start',
                // alignItems: 'center',
                flexDirection: 'column',
                paddingTop: '0',
                gridGap: '0.25rem',
              }}
            >
              <Typography
                variant='body1'
                component='span'
                className={classes.ratingLabel}
                sx={{
                  fontWeight: 'normal',
                  justifySelf: 'left',
                }}
              >
                {item?.name}
              </Typography>
              {item && (
                <FormControl
                  error={submitClicked && ratings.some((r) => r.value_id === '')}
                  sx={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                >
                  <StarRatingField
                    id={item?.id ?? ''}
                    size='large'
                    onChange={(id, value) => {
                      const productReviewRatingInputValue =
                        data.productReviewRatingsMetadata.items.find((meta) => meta?.id === id)
                          ?.values[value - 1]

                      const ratingsArr = [...ratings]

                      const clonedProductReviewRatingInputValue = ratingsArr.find(
                        (meta) => meta.id === id,
                      )

                      if (
                        !clonedProductReviewRatingInputValue ||
                        typeof productReviewRatingInputValue?.value_id === undefined
                      ) {
                        console.error(
                          'Cannot find product review rating input value in local state',
                        )
                        return
                      }

                      clonedProductReviewRatingInputValue.value_id =
                        productReviewRatingInputValue?.value_id ?? ''

                      setRatings(ratingsArr)
                    }}
                    sx={{
                      '& .MuiRating-icon': {
                        '& .IconSvg-root': {
                          fontSize: '2.3rem',
                        },
                        '& .StarRatingField-startEmpty ': {
                          fill: '#ff5501',
                        },
                      },
                    }}
                  />
                  {submitClicked && ratings.some((r) => r.value_id === '') && (
                    <Typography color='red'>{errorMessage}</Typography>
                  )}
                </FormControl>
              )}
            </FormRow>
          ))}
        </Box>

        <Box
          sx={{
            marginTop: '0',
            marginBottom: '1rem',
          }}
        >
          <InputLabel required>Nickname</InputLabel>
          <TextField
            variant='outlined'
            type='text'
            error={!!formState.errors.nickname || !!error}
            required={required.nickname}
            {...muiRegister('nickname', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
            })}
            helperText={formState.errors.nickname?.message}
            disabled={formState.isSubmitting}
          />
        </Box>

        <Box
          sx={{
            marginTop: '0',
            marginBottom: '1rem',
          }}
        >
          <InputLabel required>Summary</InputLabel>
          <TextField
            variant='outlined'
            type='text'
            error={!!formState.errors.summary || !!error}
            required={required.summary}
            {...muiRegister('summary', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
              pattern: { value: /^(?!\s).*$/, message: 'emptySpace at start not allowed' },
            })}
            helperText={formState.errors.summary?.message}
            disabled={formState.isSubmitting}
          />
        </Box>

        <Box
          sx={{
            marginTop: '0',
            marginBottom: '1rem',
          }}
        >
          <InputLabel required>Review</InputLabel>
          <TextField
            variant='outlined'
            type='text'
            error={!!formState.errors.text || !!error}
            required={required.text}
            {...muiRegister('text', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
              pattern: { value: /^(?!\s).*$/, message: 'emptySpace at start not allowed' },
            })}
            helperText={formState.errors.text?.message}
            disabled={formState.isSubmitting}
            multiline
            rows={4}
          />
        </Box>

        <FormActions
          className={classes.formActions}
          sx={{
            gridAutoFlow: 'row',
            marginRight: 'auto',
            paddingTop: { xs: '1rem', md: '1.875rem' },
            paddingBottom: '0',
          }}
        >
          <FormControl>
            <Button
              variant='contained'
              size='medium'
              // color='secondary'
              type='button'
              onClick={submitHandler}
              className={classes.submitButton}
              loading={formState.isSubmitting}
            >
              <Trans id='Submit review' />
            </Button>
          </FormControl>
        </FormActions>
      </Form>
    </>
  )
}
