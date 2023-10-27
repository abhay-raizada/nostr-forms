// TODO: this should be an enum
const CreateFormTab = {
  addQuestion: "addQuestion",
  settings: "Settings",
};

const ResponseFilters = {
  allResponses: "allResponses",
  selfSignedResponses: "selfSignedResponses",
};

const AnswerTypes = {
  string: "string",
  text: "text",
  singleChoice: "singleChoice",
  multipleChoice: "multipleChoice",
  number: "number",
  date: "date",
  label: "label",
};

const tabList = [
  {
    key: CreateFormTab.addQuestion,
    label: "Add Questions",
  },
  {
    key: CreateFormTab.settings,
    label: "Settings",
  },
];

const MyFormTab = {
  drafts: "drafts",
  savedForms: "savedForms",
};

const MyFormTabsList = [
  {
    key: MyFormTab.drafts,
    label: "Drafts",
  },
  {
    key: MyFormTab.savedForms,
    label: "Saved Forms",
  },
];

module.exports = {
  CreateFormTab,
  ResponseFilters,
  AnswerTypes,
  tabList,
  MyFormTabsList,
  MyFormTab,
};
