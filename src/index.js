import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Routes, Route } from "react-router-dom";
import NewForm from "./components/NewForm";
import FillForm from "./components/FillForm";
import ViewResponses from "./components/ViewResponses";
import MyForms from "./components/MyForms";
import { GlobalForms } from "./components/GlobalForms";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="global" element={<GlobalForms />} />
          <Route path="myForms" element={<MyForms />} />
          <Route path="forms/new" element={<NewForm />} />
          <Route path="forms/fill" element={<FillForm />} />
          <Route path="forms/:npub" element={<FillForm />} />
          <Route path="forms/:nsec/responses" element={<ViewResponses />} />
          <Route path="forms/responses" element={<ViewResponses />} />
          <Route path="*" element={<NewForm />} />
          <Route index element={<MyForms />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
