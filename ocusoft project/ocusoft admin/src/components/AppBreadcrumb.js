import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { uuid } from 'src/shared/handler/common-handler'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : ''
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
        breadcrumbs.push({
          pathname: currentPathname,
          name: getRouteName(currentPathname, routes),
          active: index + 1 === array.length ? true : false,
        })
     
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/">Dashboard</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          breadcrumb.name && <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: '#'+breadcrumb.pathname })}
            key={uuid()}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
          
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
