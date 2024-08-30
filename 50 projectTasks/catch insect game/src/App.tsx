import React from "react";
import "./App.css";
import CatchInsect from "./components/catchInsect";
import LoginPage from "./components/loginPage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import GamePage from "./components/gamePage";
import LeaderBoard from "./components/leaderBoard";
import ErrorPage from "./components/404Page";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/selectInsect" element={<CatchInsect />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/leaderBoard" element={<LeaderBoard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
