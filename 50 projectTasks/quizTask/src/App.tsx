import React from "react";
import "./App.css";
import QuizApplication from "./components/quizApp";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { purple } from "@mui/material/colors";

const App = () => {
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: purple[500],
      },
      secondary: {
        main: "#11cb5f",
      },
    },
  });

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <QuizApplication />
      </ThemeProvider>
    </div>
  );
};

export default App;
