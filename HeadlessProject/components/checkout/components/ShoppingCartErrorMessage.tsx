import {Trans} from "@lingui/react";
import {Typography, Box, Container, Link} from "@mui/material";
import {useFormGqlMutation} from "@graphcommerce/react-hook-form";
import {SignOutFormDocument} from "@graphcommerce/magento-customer/components/SignOutForm/SignOutForm.gql";
import {useRouter} from "next/router";
import {useApolloClient} from "@graphcommerce/graphql";

export function ShoppingCartErrorMessage() {
    const router = useRouter()
    const client = useApolloClient()
    const { handleSubmit } = useFormGqlMutation(
        SignOutFormDocument,
        {
            onComplete: async () => {
                await client.clearStore()
                await router.push('/')
            },
        },
        { errorPolicy: 'all' },
    )
    const submitHandler = handleSubmit(() => {})
    const handleSignOut = async () => {
        await submitHandler()
    }
    return (

        <Container maxWidth='lg'
            sx={{
                minHeight: {xs:'calc( 100vh - 116px )', md:'initial'},
                mt: '0.5rem'
            }}
        >
            <Box
                sx={{
                    padding: {xs: '1.25rem 0 2rem 0', md:'0'}
                }}
            >
                <Typography variant='h2'
                    sx={{
                        fontWeight: '300',
                        fontVariationSettings: "'wght' 300",
                        marginBottom: {xs: '1rem', md:'2rem'}
                    }}
                >
                    <Trans id="Shopping Cart"/>

                </Typography>
                <Typography variant="body1"
                    sx={{
                        marginBottom: '0.5rem',
                        display: 'inline-block',
                    }}
                >
                    <Trans id="You have no items in your shopping cart."/>
                </Typography>
                <Typography variant="body1">
                    <Trans id="Click "/>
                    <Link color="secondary" onClick={() => handleSignOut()} underline='hover' sx={{cursor: 'pointer'}}>
                        <Trans id="here "/>
                    </Link>
                    <Trans id="to continue shopping."/>
                </Typography>
            </Box>
        </Container>

    )
}
