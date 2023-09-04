import "./App.css";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header selected="Create Form" />
      <div style={{ padding: "5%", maxWidth: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
