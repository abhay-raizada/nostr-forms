export const ROUTES = {
  CREATE_FORMS: "/create",
  CREATE_FORMS_NEW: "/c",
  MY_FORMS: "/myforms",
  PUBLIC_FORMS: "/public",
  FORM_FILLER: "/fill/:formId",
  FORM_FILLER_NEW: "/f/:pubKey/:formId",
  PREVIEW: "/preview",
  RESPONSES: "/response/:formSecret",
  RESPONSES_NEW: "/r/:pubKey/:formId",
  DRAFT: "/drafts/:encodedForm",
  EMBEDDED: "/embedded/:formId",
};
