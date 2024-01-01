import { HashRouter } from "react-router-dom";
import "./App.css";
import Routing from "./components/Routing";
import { Layout } from "antd";
import { GithubOutlined } from "@ant-design/icons";

function App() {
  const { Footer } = Layout;
  return (
    <HashRouter>
      <div className="App">
        <Routing />
        <Footer
          style={{
            position: "fixed",
            bottom: "0",
            width: "100%",
            textAlign: "center",
            padding: "12px",
          }}
        >
          <a
            href="https://github.com/abhay-raizada/nostr-forms"
            style={{ textDecoration: "none", color: "black" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formstr is Free and Open Source <GithubOutlined />
          </a>
        </Footer>
      </div>
    </HashRouter>
  );
}

export default App;
