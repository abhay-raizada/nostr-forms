import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter, Routes, Route } from "react-router-dom";
import NewForm from "./components/NewForm";
import FillForm from "./components/FillForm";
import ViewResponses from "./components/ViewResponses";
import MyForms from "./components/MyForms";
import { GlobalForms } from "./components/GlobalForms";
import { DraftsController } from "./components/MyForms/DraftsController";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Anek Devanagari, ui-serif, Inter, ui-sans-serif",
          colorPrimary: "#FF5733",
          colorLink: "#FF5733",
        },
        components: {
          Menu: {
            colorItemTextSelected: "#FF2A00",
          },
          Button: {
            primaryColor: "white",
          },
        },
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="global" element={<GlobalForms />} />
            <Route path="myForms" element={<MyForms />} />
            <Route path="forms/new" element={<NewForm />} />
            <Route path="forms/fill" element={<FillForm />} />
            <Route path="forms/:npub" element={<FillForm />} />
            <Route path="forms/:nsec/responses" element={<ViewResponses />} />
            <Route path="drafts/:encodedForm" element={<DraftsController />} />
            <Route path="forms/responses" element={<ViewResponses />} />
            <Route path="*" element={<NewForm />} />
            <Route index element={<MyForms />} />
          </Route>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  </React.StrictMode>
);
