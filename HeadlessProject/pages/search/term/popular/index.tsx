import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps } from '@graphcommerce/next-ui'
import { Container, Link, Typography, Box } from '@mui/material'
import { LayoutNavigation, LayoutNavigationProps } from '../../../../components'
import { LayoutDocument } from '../../../../components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../../../lib/graphql/graphqlSsrClient'
import { GetSearchTermsDocument, GetSearchTermsQuery } from '@graphql/GetSearchTerms.gql'


type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

function SearchTermPage(props: GetSearchTermsQuery) {
  const { GetSearchTerms } = props

  return (
    <Container
      maxWidth='lg'
      sx={{ padding: { xs: '1.3rem 0.938rem', lg: '1.3rem 1.875rem' }, position: 'relative', minHeight: "calc(100vh - 465px)"}}
    >
      <Box
        sx={{
          // margin: '40px 0px',
          display: 'flex',
          paddingBottom: '2rem',
          // flexDirection: { xs: 'column', md: 'row' },
          '& h2': {
            fontWeight: '300',
            fontVariationSettings: `'wght' 300`,
          },
        }}
      >
        <Typography variant='h2'>Popular Search Terms</Typography>
      </Box>

      <Box
        sx={{
          '& ul': {
            margin: '0',
            padding: '0',
            '& li': {
              display: 'inline-block',
              marginRight: '0.65rem',
              lineHeight: '1.75rem',
            }
          }
        }}
      >
        <ul>
          {GetSearchTerms?.SearchTermData?.map((term) => (
            <li key={term?.searchUrl}>
              <Link href={`/search/${term?.searchTerm}`} underline='hover'
                sx={{
                  fontSize: '0.75rem'
                }}
              >
                {term?.searchTerm}
              </Link>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}

SearchTermPage.pageOptions = pageOptions

export default SearchTermPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const staticClient = graphqlSsrClient(locale)
  const layout = staticClient.query({ query: LayoutDocument })
  const searchTerms = staticClient.query({ query: GetSearchTermsDocument })

  return {
    props: {
      ...(await searchTerms).data,
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
