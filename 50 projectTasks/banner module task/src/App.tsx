import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "@components/loadingIndicator/Loader";
import "react-toastify/dist/ReactToastify.css";
import { ROUTES } from "@config/constant";
import "./styles/main.scss";
import Banner from "@views/banner";

// Containers
const DefaultLayout = React.lazy(() => import("@layout/DefaultLayout"));
const PublicLayout = React.lazy(() => import("@layout/PublicLayout"));
const NotFound = React.lazy(() => import("@views/404"));
const Dashboard = React.lazy(() => import("@views/dashboard"));
const Login = React.lazy(() => import("@views/login"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path="" element={<Navigate to={`/${ROUTES.login}`} />} />
        </Route>
        {/* Private routes */}
        <Route path={ROUTES.app} element={<DefaultLayout />}>
          {/*for main  page*/}
          <Route index element={<Dashboard />} />
          {/*for dashboard  page*/}
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          {/*for login  page*/}
          <Route
            path={ROUTES.app}
            element={<Navigate to={`/${ROUTES.app}/${ROUTES.login}`} />}
          />
          {/* role */}
          <Route path={ROUTES.banner} element={<Banner />} />
        </Route>

        {/*for 404 page*/}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
