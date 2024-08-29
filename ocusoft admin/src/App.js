import React from "react";
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import './scss/style.scss'
import ToastProvider from "./shared/toaster/Toaster";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgot-password/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./views/pages/reset-password'));
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={props =>
                !localStorage.getItem("token") ? <Login {...props} /> : <Redirect to="/" />
              }
            />

            <Route exact path="/forgot-password" name="Forgot Password Page" render={(props) =>
              !localStorage.getItem("token") ? (
                <ForgotPassword {...props} />
              ) : (
                <Redirect to="/" />
              )}
            />

            <Route
              exact
              path="/reset-password"
              name="Reset Password Page"
              render={props =>
                !localStorage.getItem("token") ? <ResetPassword {...props} /> : <Redirect to="/" />
              }
            />

            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />

            <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />

            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />

            <Route
              path="/"
              name="Home"
              render={props =>
                !localStorage.getItem("token") ? <Redirect to="/login" /> : <DefaultLayout {...props} />
              }
            />
          </Switch>
        </React.Suspense>
      </HashRouter>
    </ToastProvider>
  )
}

export default App
