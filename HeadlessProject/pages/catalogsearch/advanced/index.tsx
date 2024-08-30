import { LayoutNavigation } from '@components/Layout'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutTitle } from '@graphcommerce/next-ui'
import { Box, Container } from '@mui/material'
import { LayoutNavigationProps, LayoutOverlayProps } from '../../../components'
import { LayoutDocument } from '@components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'
import { useContext, useState } from 'react'
import Breadcrumb from '@components/Breadcrumb/Breadcrumb'
import { useRouter } from 'next/router'
import { AdvanceSearchForm } from '../../../components/AdvanceSearchForm'
import { UIContext } from '@components/common/contexts/UIContext'
import { AlertToast } from '@components/AlertToast'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function AdvanceSearch() {
  const router = useRouter()
  const [state, setState] = useContext(UIContext)
  const queryString = router.query?.data?.toString()
  const filterData = queryString && JSON.parse(queryString)
  const [formData, setFormData] = useState({
    name: filterData?.name?.match?.replaceAll('+', ' ') || '',
    sku: filterData?.sku?.in?.join(',') || '',
    description: filterData?.description?.match?.replaceAll('+', ' ') || '',
    short_description: filterData?.short_description?.match?.replaceAll('+', ' ') || '',
    pricefrom: filterData?.price?.from?.replaceAll('+', ' ') || '',
    priceto: filterData?.price?.to?.replaceAll('+', ' ') || '',
  })

  const handleSearch = async () => {
    if (Object.values(formData).every((value) => value === '')) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: 'Enter a search term and try again.',
            targetLink: router.pathname,
            timeout: 5000,
          },
        ],
      }))
      return
    }
    const nonEmptyWithoutPrice = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => key !== 'pricefrom' && key !== 'priceto' && value !== '',
      ),
    )
    const filterString = Object.entries(nonEmptyWithoutPrice).map(
      (el) => `/${el[0]}/${el[1].replaceAll(' ', '+')}`,
    )
    const priceString = (): string => {
      if (!formData.pricefrom && !formData.priceto) {
        return ''
      }
      if (!formData.pricefrom || !formData.priceto) {
        return `/price/${formData.pricefrom || '*'}-${formData.priceto || '*'}`
      }
      return `/price/${formData.pricefrom}-${formData.priceto}`
    }
    const filterUrl = filterString.join('') + priceString()
    await router.push({ pathname: `/search/q${filterUrl}` })
  }
  return (
    <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          paddingTop: '1.3rem',
        }}
      >
        <Breadcrumb
          breadcrumb={[]}
          name='Catalog Advanced Search'
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        />

        <LayoutTitle
          variant='h1'
          gutterTop={false}
          sx={{
            margin: { xs: '0 0 2.25rem 0', md: '1rem 0 2.25rem 0' },
            textAlign: 'left',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            '& > h1': {
              fontSize: { xs: '26px', md: '40px' },
              lineHeight: { xs: '28px', md: '44px' },
              fontWeight: '300',
              fontVariationSettings: `'wght' 300`,
            },
          }}
          gutterBottom={false}
        >
          Advanced Search
        </LayoutTitle>
      </Box>
      {state?.alerts?.length > 0 && (
        <AlertToast
          sx={{ 
            marginLeft: '0 !important',
            marginBottom: '0.75rem'
          }}
          alerts={state?.alerts}
          link={router?.pathname}
        />
      )}
      <Box>
        <AdvanceSearchForm handleSearch={handleSearch} formDataState={[formData, setFormData]} />
      </Box>
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}
AdvanceSearch.pageOptions = pageOptions

export default AdvanceSearch

export const getStaticProps: GetPageStaticProps = async ({ locale, params }) => {
  const staticClient = graphqlSsrClient(locale)
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
      up: { href: '/account', title: 'Account' },
    },
  }
}
