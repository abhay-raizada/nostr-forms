import { Routes, Route, Navigate } from "react-router-dom";
import App from "../V0/App";
import NewForm from "../NewForm";
import FillForm from "../FillForm";
import ViewResponses from "../ViewResponses";
import { GlobalForms } from "../GlobalForms";
import { DraftsController } from "../MyForms/DraftsController";
import CreateForm from "../../containers/CreateForm";
import MyForms from "../../containers/MyForms";
import PublicForms from "../../containers/PublicForms";
import { ROUTES } from "../../constants/routes";
import { FormFiller } from "../../containers/FormFiller";
import { NostrHeader } from "../Header";
import { CreateFormHeader } from "../../containers/CreateForm/components/Header/Header";
import FormBuilderProvider from "../../containers/CreateForm/providers/FormBuilder";
import { Responses } from "../../containers/Responses/Responses";

const withNostrHeaderWrapper = (Component, props) => {
  return (
    <>
      <NostrHeader selected="Create Form" />
      <Component {...props} />
    </>
  );
};
const withCreateFormHeaderWrapper = (Component, props) => {
  return (
    <>
      <FormBuilderProvider>
        <CreateFormHeader />
        <Component {...props} />
      </FormBuilderProvider>
    </>
  );
};

function Routing() {
  return (
    <Routes>
      <Route path="/" element={withNostrHeaderWrapper(App)}>
        <Route path="global" element={<GlobalForms />} />
        <Route path="forms/new" element={<NewForm />} />
        <Route path="forms/fill" element={<FillForm />} />
        <Route path="forms/:npub" element={<FillForm />} />
        <Route path="forms/:nsec/responses" element={<ViewResponses />} />
        <Route path="drafts/:encodedForm" element={<DraftsController />} />
        <Route path="forms/responses" element={<ViewResponses />} />
        <Route path="*" element={<NewForm />} />
        <Route index element={<Navigate replace to={ROUTES.MY_FORMS} />} />
      </Route>
      <Route
        path={`${ROUTES.CREATE_FORMS}/*`}
        element={withCreateFormHeaderWrapper(CreateForm)}
      />
      <Route
        path={`${ROUTES.MY_FORMS}/*`}
        element={withNostrHeaderWrapper(MyForms)}
      />
      <Route
        path={`${ROUTES.PUBLIC_FORMS}/*`}
        element={withNostrHeaderWrapper(PublicForms)}
      />
      <Route path={`${ROUTES.FORM_FILLER}/*`} element={<FormFiller />} />
      <Route
        path={`${ROUTES.RESPONSES}/*`}
        element={withNostrHeaderWrapper(Responses)}
      />
    </Routes>
  );
}

export default Routing;
