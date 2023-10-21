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

module.exports = { CreateFormTab, ResponseFilters, AnswerTypes, tabList };
