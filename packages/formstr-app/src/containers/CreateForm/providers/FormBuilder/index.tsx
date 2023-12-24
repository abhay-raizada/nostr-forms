import React, { useState } from "react";
import { AnswerTypes, IFormSettings } from "@formstr/sdk/dist/interfaces";
import { IFormBuilderContext } from "./typeDefs";
import { IQuestion } from "../../typeDefs";
import { generateQuestion } from "../../utils";
import { createForm } from "@formstr/sdk";

export const FormBuilderContext = React.createContext<IFormBuilderContext>({
  questionsList: [],
  saveForm: () => Promise.resolve([]),
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
  formDescription: "",
  updateFormDescription: (description: string) => null,
});

const InitialFormSettings: IFormSettings = {
  titleImageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/9/9c/Siberian_Husky_pho.jpg",
  description: true,
  thankYouPage: true,
};

export default function FormBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const [formDescription, setFormDescription] = useState<string>(
    "This is where the description of your form will appear! You can" +
      " tap anywhere on the form to edit it, including this description."
  );

  const toggleSettingsWindow = () => {
    setIsRightSettingsOpen((open) => {
      return !open;
    });
  };

  const closeOnOutsideClick = () => {
    isRightSettingsOpen && toggleSettingsWindow();
  };

  const saveForm = async () => {
    let formToSave = {
      name: formName,
      description: formDescription,
      schemaVersion: "v1",
      fields: questionsList.map((question) => {
        return {
          question: question.question,
          answerType: question.answerType,
          answerSettings: question.answerSettings,
        };
      }),
    };
    console.log(formToSave);
    return await createForm(formToSave);
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
        formDescription,
        updateFormDescription: setFormDescription,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}
