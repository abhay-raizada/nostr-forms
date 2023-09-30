import "./App.css";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { GithubOutlined } from "@ant-design/icons";

function App() {
  const { Footer } = Layout;
  return (
    <div className="App">
      <Header selected="Create Form" />
      <div
        style={{
          padding: "5%",
          paddingBottom: "20%",
          maxWidth: "100%",
        }}
      >
        <Outlet />
      </div>
      <Footer
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
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
  );
}

export default App;
