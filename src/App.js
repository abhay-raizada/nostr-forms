import "./App.css";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header selected="Create Form" />
      <div style={{ padding: "10%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
