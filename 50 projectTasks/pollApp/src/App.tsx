import CreatePoll from "./components/createPollPage";
import LoginPage from "./components/loginPage";
import React from "react";
import VotePage from "./components/vote";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "./components/404Page";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<CreatePoll />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/vote" element={<VotePage />} />
      </Routes>
    </div>
  );
};
export default App;
