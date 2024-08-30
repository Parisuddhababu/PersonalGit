import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { CBadge } from "@coreui/react";
import permissionHandler from "src/shared/handler/permission-handler";

export const AppSidebarNav = ({ items }) => {
  const location = useLocation();

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon ?? ''}
        {name ?? ''}
        {badge && <CBadge color={badge.color} className="ms-auto">{badge.text}</CBadge>}
      </>
    );
  };

  const navItem = (item, index) => {
    const { component, name, badge, icon, permisson_slug, countKey, ...rest } = item;
    const Component = component;

    return (
      permissionHandler(permisson_slug) && (
        <Component
          {...(rest.to &&
            !rest.items && {
              component: NavLink,
              activeClassName: "active",
            })}
          key={index}
          {...rest}
        >
          {navLink(name, icon, badge)}
        </Component>
      )
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, to, permisson_slugs, ...rest } = item;
    const Component = component;
    return (
      permissionHandler(permisson_slugs) && (
        <Component
          idx={String(index + 1)}
          key={index}
          toggler={navLink(name, icon, permisson_slugs)}
          visible={location.pathname.startsWith(to)}
          {...rest}
        >
          {item.items?.map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index)
          )}
        </Component>
      )
    );
  };

  return items?.map((item, index) => item.items ? navGroup(item, index) : navItem(item, index))
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
