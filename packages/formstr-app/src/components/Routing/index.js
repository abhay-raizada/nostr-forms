import { Routes, Route, Navigate } from "react-router-dom";
import App from "../V0/App";
import NewForm from "../NewForm";
import FillForm from "../FillForm";
import ViewResponses from "../ViewResponses";
import { GlobalForms } from "../GlobalForms";
import { DraftsController } from "../MyForms/DraftsController";
import MyFormsV0 from "../MyForms";
import CreateForm from "../../containers/CreateForm";
import MyForms from "../../containers/MyForms";
import PublicForms from "../../containers/PublicForms";
import { ROUTES } from "../../constants/routes";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="global" element={<GlobalForms />} />
        <Route path="forms/new" element={<NewForm />} />
        <Route path="forms/fill" element={<FillForm />} />
        <Route path="forms/:npub" element={<FillForm />} />
        <Route path="forms/:nsec/responses" element={<ViewResponses />} />
        <Route path="drafts/:encodedForm" element={<DraftsController />} />
        <Route path="forms/responses" element={<ViewResponses />} />
        <Route path="*" element={<NewForm />} />
        <Route path="v0/myforms" element={<MyFormsV0 />} />
        <Route index element={<Navigate replace to={ROUTES.MY_FORMS} />} />
      </Route>
      <Route path={`${ROUTES.CREATE_FORMS}/*`} element={<CreateForm />} />
      <Route path={`${ROUTES.MY_FORMS}/*`} element={<MyForms />} />
      <Route path={`${ROUTES.PUBLIC_FORMS}/*`} element={<PublicForms />} />
    </Routes>
  );
}

export default Routing;
