import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/config/constant";
import { verifyAuth } from "src/utils/helpers";
import { Content, Sidebar } from "../components/index";

const DefaultLayout = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!verifyAuth) {
      navigate(`/${ROUTES.login}`);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen">
      {/* <Header /> */}
      <div className="flex flex-1 max-h-full overflow-y-auto">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Content />
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
