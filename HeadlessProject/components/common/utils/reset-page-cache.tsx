import {useApolloClient} from "@graphcommerce/graphql";
import {useCartQuery} from "@graphcommerce/magento-cart";
import {CartPageDocument} from "@graphcommerce/magento-cart-checkout";
import {useEffect} from "react";

export const useResetPageCache = () => {
    const client = useApolloClient()
    const {error} = useCartQuery(CartPageDocument, { errorPolicy: 'all' })

    useEffect(() => {
        const fun = async () => {
            await client.clearStore()
        }

        if ((error && error.graphQLErrors)) {
            fun()
        }
    }, [error]);
}
