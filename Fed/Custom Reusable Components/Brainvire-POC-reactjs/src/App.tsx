import "./App.css";
import Router from "./Router";
import Header from "./header/Header";
import "./assets/scss/themes/services/s7.scss";
import "./assets/scss/main.scss";
import "./assets/scss/home.scss";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Router />
      </div>
    </div>
  );
}

export default App;
