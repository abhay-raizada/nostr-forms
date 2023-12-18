import React, { useState } from "react";
import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { IFormBuilderContext, IFormSettings } from "./typeDefs";
import { IQuestion } from "../../typeDefs";
import { generateQuestion } from "../../utils";

export const FormBuilderContext = React.createContext<IFormBuilderContext>({
  questionsList: [],
  saveForm: () => null,
  editQuestion: (question: IQuestion, tempId: string) => null,
  addQuestion: (answerType?: AnswerTypes) => null,
  deleteQuestion: (tempId: string) => null,
  questionIdInFocus: undefined,
  setQuestionIdInFocus: (tempId?: string) => null,
  formSettings: {},
  updateFormSetting: (settings: IFormSettings) => null,
});

const InitialFormSettings: IFormSettings = {
  titleImage: true,
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

  const saveForm = () => {
    let formToSave = {
      name: "Form Name",
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
    //createForm(formToSave);
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
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}
