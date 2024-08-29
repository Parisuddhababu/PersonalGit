import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import { Helmet } from 'react-helmet'

// routes config
import routes from '../routes'
import { uuid } from 'src/shared/handler/common-handler'

const AppContent = () => {
  const getTitle = (name) => {
    const str = name.replace('/', ' ').replace(/-/g, ' ');
    const arr = str.split(" ");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return <title>{str2 + ' | Admin'}</title>

  }

  return (
    <CContainer fluid style={{position: "relative"}}>
      <Suspense fallback={<div className="diamond-loader-overlay">
        <div className="diamondCon">
          <ul className="diamond">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>}>
        <Switch>
          {routes.map((route) => {
            return (
              route.component && (
                <Route
                  key={uuid()}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => (
                    <>
                      <Helmet>
                        {getTitle(props.location.pathname)}
                      </Helmet>
                      <route.component {...props} />
                    </>
                  )}
                />
              )
            )
          })}
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
