import { useMemo, useState } from "react";
import QuestionCard from "./QuestionCard/QuestionCard";
import { Button, Dropdown, Menu, MenuProps } from "antd";
import { AnswerTypes, Field } from "@formstr/sdk/dist/interfaces";
import "./FormBuilder";
import { Typography } from "antd";
import { makeTag } from "../../../../utils/utility";
export interface IQuestion extends Field {
  tempId: string;
}

const { Text } = Typography;

const initialQuestion: IQuestion = {
  tempId: makeTag(6),
  question: "Click here to edit",
  answerType: AnswerTypes.shortText,
  answerSettings: {},
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
    console.log(formToSave);
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
    <div>
      <div style={{ width: "100%" }}>
        <div
          style={{
            backgroundImage: `linear-gradient(180deg, rgb(243 239 239 / 0%), rgb(4 3 3) 150%), url('https://upload.wikimedia.org/wikipedia/commons/9/9c/Siberian_Husky_pho.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "250px",
            marginTop: 30,
            borderRadius: 10,
            position: "relative",
          }}
        >
          <Text
            style={{
              color: "white",
              position: "absolute",
              bottom: "10px",
              left: "10px",
              fontSize: "24px",
            }}
          >
            blah and blah
          </Text>
        </div>
        <div
        // style={{
        //   width: "100%",
        //   // maxHeight: 250,
        //   overflow: "hidden",
        //   paddingTop: 30,
        //   paddingBlock: 30,
        // }}
        >
          {/* <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Siberian_Husky_pho.jpg"
            alt="form"
            style={{
              maxWidth: "100%",
              maxHeight: 250,

              objectFit: "contain",
              overflow: "hidden",
              aspectRatio: 4 / 3,
            }}
          ></img> */}
        </div>
        <div style={{ textAlign: "left", padding: "2rem" }}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi
            commodi vero praesentium non quaerat modi in at ut assumenda atque,
            iure, eos temporibus deserunt quidem eius voluptatum mollitia!
            Temporibus, esse. Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Tempora suscipit porro, maxime minus quo rem
            debitis provident ipsam expedita ipsa?
          </Text>
        </div>
      </div>
      <div>
        {questionsList.map((question) => {
          return (
            <QuestionCard
              question={question}
              key={question.tempId}
              onEdit={onEditQuestion}
            />
          );
        })}
      </div>
      <div>
        <Dropdown.Button
          menu={{
            items: answerTypeItems,
            onClick: handleMenuClick,
          }}
          onClick={onAddQuestion}
        >
          Add +
        </Dropdown.Button>
      </div>
      <Button type="primary" onClick={handleSaveForm}>
        Save Form
      </Button>
    </div>
  );
};
