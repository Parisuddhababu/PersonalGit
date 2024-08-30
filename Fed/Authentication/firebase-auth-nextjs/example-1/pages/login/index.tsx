import Head from "next/head";
import type { NextPage } from "next";
import { Box, Card, Container, Divider, Typography } from "@mui/material";
import FirebaseLogin from "../../components/authentication/firebase-login";

const Login: NextPage = () => (
  <>
    <Head>
      <title>Login</title>
    </Head>
    <Box
      component="main"
      sx={{
        backgroundColor: "Blue",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          py: {
            xs: 6,
            md: 12,
          },
        }}
      >
        <Card elevation={16} sx={{ p: 4 }}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              mt: 2,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Divider orientation="horizontal" />
            </Box>
            <Typography color="textSecondary" sx={{ m: 2 }} variant="body1">
              Log in to Next Firebase Admin
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Divider orientation="horizontal" />
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              mt: 1,
            }}
          >
            <FirebaseLogin />
          </Box>
          <Divider sx={{ mt: 3 }} />
        </Card>
      </Container>
    </Box>
  </>
);

export default Login;
