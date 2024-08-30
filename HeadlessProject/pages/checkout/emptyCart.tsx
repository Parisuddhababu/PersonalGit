import { PageOptions } from '@graphcommerce/framer-next-pages'
import {graphqlSsrClient} from "@lib/graphql/graphqlSsrClient";
import {LayoutDocument} from "@components/Layout/Layout.gql";
import {LayoutNavigation} from "@components/Layout";
import {ShoppingCartErrorMessage} from "@components/checkout/components/ShoppingCartErrorMessage";
import {useResetPageCache} from "@components/common/utils/reset-page-cache";

function EmptyCart() {
    useResetPageCache()
    return (
        <ShoppingCartErrorMessage />
    )
}

EmptyCart.pageOptions = {
    Layout: LayoutNavigation,
} as PageOptions

export default EmptyCart

export const getStaticProps = async ({ locale }) => {
    const staticClient = graphqlSsrClient(locale)

    const layout = staticClient.query({ query: LayoutDocument })

    return {
        props: {
            ...(await layout).data,
        },
        revalidate: 200,
    }
}
