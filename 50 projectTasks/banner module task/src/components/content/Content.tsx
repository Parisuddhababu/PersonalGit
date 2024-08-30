import React from "react";
import { Outlet } from "react-router-dom";

const Content = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default React.memo(Content);
