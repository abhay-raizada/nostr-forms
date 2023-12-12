import { useMemo, useState } from "react";
import QuestionCard from "./QuestionCard";
import { Button, Dropdown, Menu, MenuProps } from "antd";
import { AnswerTypes, Field } from "@formstr/sdk/dist/interfaces";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AnswerTypeLabels } from "./constants";
import { makeTag } from "../../utils/utility";

export interface IQuestion extends Field {
  tempId: string;
}

const initialQuestion: IQuestion = {
  tempId: makeTag(6),
  question: "Click here to edit",
  answerType: AnswerTypes.shortText,
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
        return <QuestionCard question={question} key={question.tempId} />;
      })}
      <Dropdown.Button
        menu={{
          items: answerTypeItems,
          onClick: handleMenuClick,
        }}
        onClick={onAddQuestion}
      >
        Dropdown
      </Dropdown.Button>
    </>
  );
};
