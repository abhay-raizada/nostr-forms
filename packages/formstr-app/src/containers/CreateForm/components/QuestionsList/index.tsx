import QuestionCard from "../QuestionCard";
import { Button, Dropdown, MenuProps } from "antd";
import { Typography } from "antd";
import FormTitle from "../FormTitle";
import StyleWrapper from "./style";
import { INPUTS_MENU } from "../../configs/menuConfig";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import { useRef, useState } from "react";
import { FormDetails } from "./FormDetails";
import { useEditable } from "use-editable";
import { IQuestion } from "../../typeDefs";
import { Reorder } from "framer-motion";

const { Text } = Typography;

export const QuestionsList = ({ onAddClick }: { onAddClick: () => void }) => {
  const {
    formSettings,
    questionsList,
    saveForm,
    editQuestion,
    addQuestion,
    setQuestionIdInFocus,
    updateFormSetting,
    updateQuestionsList,
  } = useFormBuilderContext();

  const [formCredentials, setFormCredentials] = useState<string[]>([]);
  const [openSubmittedWindow, setOpenSubmittedWindow] =
    useState<boolean>(false);
  const formDescriptionRef = useRef(null);

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const selectedItem = INPUTS_MENU.find((item) => item.key === e.key);
    addQuestion(selectedItem?.type);
  };

  const handleDescriptionChange = (text: string) => {
    updateFormSetting({ description: text });
  };

  useEditable(formDescriptionRef, handleDescriptionChange);

  const onReorderKey = (keyType: "UP" | "DOWN", tempId: string) => {
    const questions = [...questionsList];
    const selectedQuestionIndex = questions.findIndex(
      (question: IQuestion) => question.tempId === tempId
    );
    if (
      (selectedQuestionIndex === 0 && keyType === "UP") ||
      (selectedQuestionIndex === questions.length - 1 && keyType === "DOWN")
    ) {
      return;
    }
    const order = keyType === "UP" ? -1 : +1;
    if (selectedQuestionIndex !== -1) {
      const replaceQuestion = questions[selectedQuestionIndex + order];
      questions[selectedQuestionIndex + order] =
        questions[selectedQuestionIndex];
      questions[selectedQuestionIndex] = replaceQuestion;
    }
    updateQuestionsList(questions);
  };

  const handleSaveForm = async () => {
    if (formCredentials.length === 0) {
      const formCreds = await saveForm();
      setFormCredentials(formCreds);
    }
    console.log("formCredentials aaare", formCredentials);
    setOpenSubmittedWindow(true);
  };

  return (
    <StyleWrapper
      className="main-content"
      onClick={() => setQuestionIdInFocus()}
    >
      <div>
        <FormTitle className="form-title" />
        {!!formSettings.description && (
          <div className="form-description">
            <Text ref={formDescriptionRef}>{formSettings.description}</Text>
          </div>
        )}
      </div>
      <Reorder.Group
        values={questionsList}
        onReorder={updateQuestionsList}
        className="reorder-group"
      >
        <div>
          {questionsList.map((question) => {
            return (
              <Reorder.Item value={question} key={question.tempId}>
                <QuestionCard
                  question={question}
                  key={question.tempId}
                  onEdit={editQuestion}
                  onReorderKey={onReorderKey}
                />
              </Reorder.Item>
            );
          })}
        </div>
      </Reorder.Group>
      <div>
        <Dropdown.Button
          className="desktop-add-btn"
          menu={{
            items: INPUTS_MENU,
            onClick: onMenuClick,
          }}
          onClick={() => addQuestion()}
        >
          Add +
        </Dropdown.Button>
        <Button type="primary" onClick={onAddClick} className="mobile-add-btn">
          +
        </Button>
      </div>
      <Button type="primary" onClick={handleSaveForm}>
        Save Form
      </Button>

      <FormDetails
        isOpen={openSubmittedWindow}
        formCredentials={formCredentials}
        onClose={() => {
          setOpenSubmittedWindow(false);
        }}
      />
    </StyleWrapper>
  );
};
