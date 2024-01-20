import { HashRouter } from "react-router-dom";
import "./App.css";
import Routing from "./components/Routing";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routing />
      </div>
    </HashRouter>
  );
}

export default App;
