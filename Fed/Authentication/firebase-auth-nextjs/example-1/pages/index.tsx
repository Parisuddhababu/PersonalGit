import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useCallback } from 'react';
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const AuthUser = useAuthUser();

  const signout = useCallback(() => {
    AuthUser.signOut();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Firebase Auth</title>
      </Head>

      <Box>
        <Container maxWidth={false}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant='h3' color='Blue' gutterBottom>
                Welcome to Next Firebase Authentication Example
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    Email
                  </Typography>
                  <Typography variant='body1'>{AuthUser.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    Email Is Verified
                  </Typography>
                  <Typography variant='body1'>
                    {AuthUser.emailVerified ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    Phone Number
                  </Typography>
                  <Typography variant='body1'>
                    {AuthUser.phoneNumber ?? 'Not Added'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    Display Name
                  </Typography>
                  <Typography variant='body1'>
                    {AuthUser.displayName ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    Image URL
                  </Typography>
                  <Typography variant='body1'>
                    {AuthUser.photoURL ?? 'Not Added'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={signout}>
                Signout
              </Button>
            </CardActions>
          </Card>
          <h5></h5>
        </Container>
      </Box>
    </div>
  );
};

export default withAuthUser<NextPage>({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
