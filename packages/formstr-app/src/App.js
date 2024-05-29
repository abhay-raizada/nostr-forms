import { HashRouter } from "react-router-dom";
import "./App.css";
import Routing from "./components/Routing";
import { ProfileProvider } from "./provider/ProfileProvider";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <ProfileProvider>
          <Routing />
        </ProfileProvider>
      </div>
    </HashRouter>
  );
}

export default App;
