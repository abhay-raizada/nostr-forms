import { Button, Divider, Dropdown, Switch, Typography, MenuProps } from "antd";
import { DeleteOutlined, DownOutlined } from "@ant-design/icons";
import Validation from "../Validation";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import { INPUTS_MENU } from "../../configs/menuConfig";
import StyleWrapper from "./style";
import { RightAnswer } from "./RightAnswer";
import { Field } from "../../providers/FormBuilder";
import { IAnswerSettings } from "./types";
import UploadImage from "./UploadImage";
import { useState, useEffect } from "react";

const { Text } = Typography;

function AnswerSettings() {
  const { questionsList, questionIdInFocus, editQuestion, deleteQuestion } =
    useFormBuilderContext();
    
    if (!questionIdInFocus) {
      return null;
    }
    const questionIndex = questionsList.findIndex(
      (field: Field) => field[1] === questionIdInFocus
    );
    if (questionIndex === -1) {
      return null;
    }
  const question = questionsList[questionIndex];
  const answerSettings = JSON.parse(
    question[5] || '{ "renderElement": "shortText"}'
  );
  const answerType = INPUTS_MENU.find(
    (option) =>
      option.answerSettings.renderElement === answerSettings.renderElement
  );

  const [uploadedImages, setUploadedImages] = useState<Array<{name: string, url: string}>>(() => {
    const saved = localStorage.getItem(`uploadedImages_${questionIdInFocus}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (answerSettings.uploadedImages) {
      setUploadedImages(answerSettings.uploadedImages);
    }
  }, [questionIdInFocus]);

  const handleRightAnswer = (rightAnswer: string) => {
    const field = question;
    let newAnswerSettings = {
      ...answerSettings,
      validationRules: {
        ...answerSettings.validationRules,
        match: { answer: rightAnswer },
      },
    };
    field[5] = JSON.stringify(newAnswerSettings);
    editQuestion(field, field[1]);
  };
  const updateAnswerType: MenuProps["onClick"] = ({ key }) => {
    const selectedItem = INPUTS_MENU.find((item) => item.key === key);
    if (!selectedItem) return;
    let field = question;
    field[2] = selectedItem.primitive;
    let newAnswerSettings = selectedItem.answerSettings;
    field[5] = JSON.stringify(newAnswerSettings);
    editQuestion(field, field[1]);
  };

  const updateIsRequired = (checked: boolean) => {
    let field = question;
    let newAnswerSettings = { ...answerSettings, required: checked };
    field[5] = JSON.stringify(newAnswerSettings);
    editQuestion(field, question[1]);
  };

  const handleAnswerSettings = (newAnswerSettings: IAnswerSettings) => {
    let changedSettings = { ...answerSettings, ...newAnswerSettings };
    let field = question;
    field[5] = JSON.stringify(changedSettings);
    editQuestion(field, field[1]);
  };

  const handleImageUpload = (markdownUrl: string) => {
    const name = markdownUrl.match(/\[(.*?)\]/)?.[1] || '';
    const url = markdownUrl.match(/\((.*?)\)/)?.[1] || '';
    const imageMarkdown = `![${name}](${url})`;
  
    const newImages = [...uploadedImages, { name, url }];
    setUploadedImages(newImages);
    localStorage.setItem(`uploadedImages_${questionIdInFocus}`, JSON.stringify(newImages));
  
    const existingConfig = JSON.parse(question[5] || '{}');
    const existingText = question[3] || '';

    let newDisplay = existingText;
    if (existingText && !existingText.endsWith('\n\n')) {
        newDisplay += '\n\n';
    }
    newDisplay += imageMarkdown;
  
    const field: Field = [
      question[0],
      question[1],       
      question[2],
      newDisplay.trim(),
      question[4],
      JSON.stringify({
          ...existingConfig,
          imageUrl: imageMarkdown,
          uploadedImages: newImages,
          displayImages: true,
          text: existingText
      })
  ];

  editQuestion(field, field[1]);
  };
  
  return (
    <StyleWrapper>
      <Text className="question">
        Question {questionIndex + 1} of {questionsList.length}
      </Text>
      <Divider className="divider" />
      <UploadImage onImageUpload={handleImageUpload} />
      <div className="input-property">
        <Text className="property-title">Properties</Text>
        <div className="property-setting">
          <Text className="property-name">Type</Text>
          <Dropdown menu={{ items: INPUTS_MENU, onClick: updateAnswerType }}>
            <Text>
              {answerType?.label} <DownOutlined />
            </Text>
          </Dropdown>
        </div>
        <div className="property-setting">
          <Text className="property-name">Required</Text>
          <Switch
            checked={answerSettings.required}
            onChange={updateIsRequired}
          />
        </div>
      </div>
      <Divider className="divider" />
      <Validation
        key={question[1] + "validation"}
        answerType={answerSettings.renderElement}
        answerSettings={answerSettings}
        handleAnswerSettings={handleAnswerSettings}
      />
      <Divider className="divider" />
      <RightAnswer
        key={question[1] + "rightAnswer"}
        answerType={answerSettings.renderElement}
        answerSettings={answerSettings}
        onChange={handleRightAnswer}
      />
      <Divider className="divider" />
      <Button
        danger
        type="text"
        className="delete-button"
        onClick={() => deleteQuestion(question[1])}
      >
        <DeleteOutlined /> Delete
      </Button>
      <Divider className="divider" />
    </StyleWrapper>
  );
}

export default AnswerSettings;
