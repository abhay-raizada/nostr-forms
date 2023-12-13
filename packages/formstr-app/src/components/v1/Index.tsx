import { useMemo, useState } from "react";
import QuestionCard from "./QuestionCard/QuestionCard";
import { Button, Dropdown, Menu, MenuProps } from "antd";
import { AnswerTypes, Field } from "@formstr/sdk/dist/interfaces";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AnswerTypeLabels } from "./constants";
import { makeTag } from "../../utils/utility";
import { createForm } from "@formstr/sdk";

export interface IQuestion extends Field {
  tempId: string;
  inputSettings: {};
}

const initialQuestion: IQuestion = {
  tempId: makeTag(6),
  question: "Click here to edit",
  answerType: AnswerTypes.shortText,
  inputSettings: {},
};

const getItems = () => {
  return Object.keys(AnswerTypes).map((answerType: string) => {
    return {
      key: answerType,
      label: AnswerTypes[answerType as AnswerTypes],
    };
  });
};

export const QuestionsList = () => {
  const [questionsList, setQuestionsList] = useState<IQuestion[]>([
    initialQuestion,
  ]);
  const answerTypeItems = useMemo(() => getItems(), []);

  function handleSaveForm() {
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
    console.log("SAAAAVEEEE", formToSave);
    //createForm(formToSave);
  }

  const onEditQuestion = (question: IQuestion, tempId: string) => {
    let editedList = questionsList.map((existingQuestion: IQuestion) => {
      if (existingQuestion.tempId === tempId) {
        return question;
      }
      return existingQuestion;
    });
    setQuestionsList(editedList);
  };

  const onAddQuestion = () => {
    setQuestionsList([
      ...questionsList,
      { ...initialQuestion, tempId: makeTag(6) },
    ]);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // message.info('Click on menu item.');
    console.log("click", e);
    const selectedItem = answerTypeItems.find((item) => item.key === e.key);
    setQuestionsList([
      ...questionsList,
      {
        ...initialQuestion,
        tempId: makeTag(6),
        answerType: selectedItem?.label || AnswerTypes.shortText,
      },
    ]);
  };

  return (
    <>
      {questionsList.map((question) => {
        return (
          <QuestionCard
            question={question}
            key={question.tempId}
            onEdit={onEditQuestion}
          />
        );
      })}
      <Dropdown.Button
        menu={{
          items: answerTypeItems,
          onClick: handleMenuClick,
        }}
        onClick={onAddQuestion}
      >
        Add +
      </Dropdown.Button>
      <Button type="primary" onClick={handleSaveForm}>
        Save Form
      </Button>
    </>
  );
};
