import React, { useState } from "react";
import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { IFormBuilderContext } from "./typeDefs";
import { IQuestion } from "../../typeDefs";
import { generateQuestion } from "../../utils";

export const FormBuilderContext = React.createContext<IFormBuilderContext>({
  questionsList: [],
  saveForm: () => null,
  editQuestion: (question: IQuestion, tempId: string) => null,
  addQuestion: (answerType?: AnswerTypes) => null,
});

export default function FormBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [questionsList, setQuestionsList] = useState<IQuestion[]>([
    generateQuestion(),
  ]);

  const saveForm = () => {
    let formToSave = {
      name: "Form Name",
      schemaVersion: "v1",
      fields: questionsList.map((question) => {
        return {
          question: question.question,
          answerType: question.answerType,
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

  return (
    <FormBuilderContext.Provider
      value={{ questionsList, saveForm, editQuestion, addQuestion }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}
