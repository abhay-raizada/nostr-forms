import { Dashboard } from "../containers/Dashboard";

export const ROUTES = {
  CREATE_FORMS_NEW: "/c",
  MY_FORMS: "/myforms",
  DASHBOARD: "/dashboard",
  PUBLIC_FORMS: "/public",
  FORM_FILLER: "/fill/:formId",
  FORM_FILLER_NEW: "/f/:naddr",
  PREVIEW: "/preview",
  RESPONSES: "/response/:formSecret",
  RESPONSES_NEW: "/r/:pubKey/:formId",
  RESPONSES_SECRET: "/s/:secretKey/:formId",
  DRAFT: "/drafts/:encodedForm",
  EMBEDDED: "/embedded/:formId",
};
