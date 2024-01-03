import React, { useState } from "react";
import { AnswerTypes, IFormSettings } from "@formstr/sdk/dist/interfaces";
import { IFormBuilderContext } from "./typeDefs";
import { IQuestion } from "../../typeDefs";
import { generateQuestion } from "../../utils";
import { createForm } from "@formstr/sdk";
import { LOCAL_STORAGE_KEYS } from "../../../../utils/localStorage";
import { makeTag } from "../../../../utils/utility";
import { useNavigate } from "react-router-dom";

export const FormBuilderContext = React.createContext<IFormBuilderContext>({
  questionsList: [],
  saveForm: () => null,
  editQuestion: (question: IQuestion, tempId: string) => null,
  addQuestion: (answerType?: AnswerTypes) => null,
  deleteQuestion: (tempId: string) => null,
  questionIdInFocus: undefined,
  setQuestionIdInFocus: (tempId?: string) => null,
  formSettings: { titleImageUrl: "" },
  updateFormSetting: (settings: IFormSettings) => null,
  updateFormTitleImage: (e: React.FormEvent<HTMLInputElement>) => null,
  closeOnOutsideClick: () => null,
  isRightSettingsOpen: false,
  toggleSettingsWindow: () => null,
  formName: "",
  updateFormName: (name: string) => null,
  updateQuestionsList: (list: IQuestion[]) => null,
  openSubmittedWindow: false,
  formCredentials: [],
  setOpenSubmittedWindow: (open: boolean) => null,
  getFormSpec: () => {
    return { name: "", schemaVersion: "v1" };
  },
  saveDraft: () => null,
  setFormTempId: (formTempId: string) => "",
  formTempId: "",
});

const InitialFormSettings: IFormSettings = {
  titleImageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/9/9c/Siberian_Husky_pho.jpg",
  description:
    "This is where the description of your form will appear! You can" +
    " tap anywhere on the form to edit it, including this description.",
  thankYouPage: true,
};

export default function FormBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [questionsList, setQuestionsList] = useState<IQuestion[]>([
    generateQuestion(),
  ]);
  const [questionIdInFocus, setQuestionIdInFocus] = useState<
    string | undefined
  >();
  const [formSettings, setFormSettings] =
    useState<IFormSettings>(InitialFormSettings);

  const [isRightSettingsOpen, setIsRightSettingsOpen] = useState(false);
  const [formName, setFormName] = useState<string>(
    "This is the title of your form! Tap to edit."
  );
  const [formCredentials, setFormCredentials] = useState<string[]>([]);
  const [openSubmittedWindow, setOpenSubmittedWindow] =
    useState<boolean>(false);

  const [formTempId, setFormTempId] = useState<string>(makeTag(6));

  const toggleSettingsWindow = () => {
    setIsRightSettingsOpen((open) => {
      return !open;
    });
  };

  const closeOnOutsideClick = () => {
    isRightSettingsOpen && toggleSettingsWindow();
  };

  const getFormSpec = () => {
    return {
      name: formName,
      schemaVersion: "v1",
      settings: formSettings,
      fields: questionsList.map((question) => {
        return {
          question: question.question,
          answerType: question.answerType,
          answerSettings: question.answerSettings,
        };
      }),
    };
  };

  const deleteDraft = (formTempId: string) => {
    type Draft = { formSpec: unknown; tempId: string };
    let draftArr = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS) || "[]"
    );
    draftArr = draftArr.filter((draft: Draft) => draft.tempId !== formTempId);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.DRAFT_FORMS,
      JSON.stringify(draftArr)
    );
  };

  const saveForm = async () => {
    let formToSave = getFormSpec();
    //const formCreds = await createForm(formToSave);
    const formCreds = ["1", "1"];
    deleteDraft(formTempId);
    setFormTempId(""); // to avoid creating a draft
    navigate("/myForms/local", { state: formCreds });
    //setFormCredentials(formCreds);
    //setOpenSubmittedWindow(true);
  };

  const saveDraft = () => {
    if (formTempId === "") return;
    type Draft = { formSpec: unknown; tempId: string };
    const formSpec = getFormSpec();
    const draftObject = { formSpec, tempId: formTempId };
    let draftArr = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS) || "[]"
    );
    const draftIds = draftArr.map((draft: Draft) => draft.tempId);
    if (!draftIds.includes(draftObject.tempId)) {
      draftArr.push(draftObject);
    } else {
      draftArr = draftArr.map((draft: Draft) => {
        if (draftObject.tempId === draft.tempId) {
          return draftObject;
        }
        return draft;
      });
    }
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.DRAFT_FORMS,
      JSON.stringify(draftArr)
    );
  };

  const editQuestion = (question: IQuestion, tempId: string) => {
    let editedList = questionsList.map((existingQuestion: IQuestion) => {
      if (existingQuestion.tempId === tempId) {
        return question;
      }
      return existingQuestion;
    });
    setQuestionsList(editedList);
  };

  const addQuestion = (answerType?: AnswerTypes) => {
    setQuestionsList([...questionsList, generateQuestion(answerType)]);
  };

  const deleteQuestion = (tempId: string) => {
    if (questionIdInFocus === tempId) {
      setQuestionIdInFocus(undefined);
    }
    setQuestionsList((preQuestions) => {
      return preQuestions.filter((question) => question.tempId !== tempId);
    });
  };

  const updateQuestionsList = (newQuestionsList: IQuestion[]) => {
    setQuestionsList(newQuestionsList);
  };

  const updateFormSetting = (settings: IFormSettings) => {
    setFormSettings((preSettings) => ({ ...preSettings, ...settings }));
  };

  const updateFormTitleImage = (e: React.FormEvent<HTMLInputElement>) => {
    let imageUrl = e.currentTarget.value;
    if (imageUrl) {
      updateFormSetting({
        titleImageUrl: imageUrl,
      });
    }
  };

  return (
    <FormBuilderContext.Provider
      value={{
        questionsList,
        saveForm,
        editQuestion,
        addQuestion,
        deleteQuestion,
        questionIdInFocus,
        setQuestionIdInFocus,
        formSettings,
        updateFormSetting,
        updateFormTitleImage,
        closeOnOutsideClick,
        toggleSettingsWindow,
        isRightSettingsOpen,
        formName,
        updateFormName: setFormName,
        updateQuestionsList,
        formCredentials,
        openSubmittedWindow,
        setOpenSubmittedWindow,
        getFormSpec,
        saveDraft,
        setFormTempId,
        formTempId,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}
