import { Routes, Route, Navigate } from "react-router-dom";
import MyForms from "../../containers/MyForms";
import PublicForms from "../../containers/PublicForms";
import { ROUTES } from "../../constants/routes";
import { FormFillerOld } from "../../containers/FormFiller";
import { FormFiller } from "../../containers/FormFillerNew";
import { NostrHeader } from "../Header";
import { CreateFormHeader } from "../../containers/CreateForm/components/Header/Header";
import { CreateFormHeader as CreateFormHeaderNew } from "../../containers/CreateFormNew/components/Header/Header";
import FormBuilderProvider from "../../containers/CreateForm/providers/FormBuilder";
import NewFormBuilderProvider from "../../containers/CreateFormNew/providers/FormBuilder";
import { Responses } from "../../containers/Responses/Responses";
import { V1DraftsController } from "../../containers/Drafts";
import CreateFormOld from "../../containers/CreateForm";
import CreateForm from "../../containers/CreateFormNew";

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

const withNewCreateFormHeaderWrapper = (Component, props) => {
  return (
    <>
      <NewFormBuilderProvider>
        <CreateFormHeaderNew />
        <Component {...props} />
      </NewFormBuilderProvider>
    </>
  );
};

function Routing() {
  return (
    <Routes>
      <Route path="forms/:formId" element={<FormFiller />} />
      <Route
        path="forms/:formSecret/responses"
        element={withNostrHeaderWrapper(Responses)}
      />
      <Route index element={<Navigate replace to={ROUTES.MY_FORMS} />} />
      <Route
        path={`${ROUTES.CREATE_FORMS}/*`}
        element={withCreateFormHeaderWrapper(CreateFormOld)}
      />
      <Route
        path={`${ROUTES.CREATE_FORMS_NEW}/*`}
        element={withNewCreateFormHeaderWrapper(CreateForm)}
      />
      <Route
        path={`${ROUTES.MY_FORMS}/*`}
        element={withNostrHeaderWrapper(MyForms)}
      />
      <Route
        path={`${ROUTES.PUBLIC_FORMS}/*`}
        element={withNostrHeaderWrapper(PublicForms)}
      />
      <Route path={`${ROUTES.FORM_FILLER}/*`} element={<FormFillerOld />} />
      <Route
        path={`${ROUTES.EMBEDDED}/*`}
        element={<FormFiller embedded={true} />}
      />
      <Route
        path={`${ROUTES.RESPONSES}/*`}
        element={withNostrHeaderWrapper(Responses)}
      />
      <Route
        path={`${ROUTES.DRAFT}/*`}
        element={withNostrHeaderWrapper(V1DraftsController)}
      />
      <Route path={`${ROUTES.FORM_FILLER_NEW}/*`} element={<FormFiller />} />
    </Routes>
  );
}

export default Routing;
