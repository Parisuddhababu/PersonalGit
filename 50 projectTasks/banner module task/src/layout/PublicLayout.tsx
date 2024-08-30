import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/config/constant";
import { verifyAuth } from "src/utils/helpers";
import { Content } from "../components/index";

const PublicLayout = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (verifyAuth()) {
      navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
    }
  }, [navigate]);

  return (
    <div>
      <Content />
    </div>
  );
};

export default PublicLayout;
