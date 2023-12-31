import QuestionCard from "../QuestionCard";
import { Button, Dropdown, Input, MenuProps } from "antd";
import FormTitle from "../FormTitle";
import StyleWrapper from "./style";
import DescriptionStyle from "./description.style";
import { INPUTS_MENU } from "../../configs/menuConfig";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import { ChangeEvent, useEffect } from "react";
import { IQuestion } from "../../typeDefs";
import { Reorder } from "framer-motion";
import { isMobile, isTablet } from "../../../../utils/utility";

export const QuestionsList = ({ onAddClick }: { onAddClick: () => void }) => {
  const {
    formSettings,
    questionsList,
    editQuestion,
    addQuestion,
    setQuestionIdInFocus,
    updateFormSetting,
    updateQuestionsList,
    saveDraft,
  } = useFormBuilderContext();

  useEffect(() => {
    return () => {
      saveDraft();
    };
  }, [saveDraft]);

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const selectedItem = INPUTS_MENU.find((item) => item.key === e.key);
    addQuestion(selectedItem?.type);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateFormSetting({ description: e.target.value });
  };

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

  return (
    <StyleWrapper
      className="main-content"
      onClick={() => setQuestionIdInFocus()}
    >
      <div>
        <FormTitle className="form-title" />
        <DescriptionStyle>
          <div className="form-description">
            <Input.TextArea
              key="description"
              defaultValue={formSettings.description}
              onChange={handleDescriptionChange}
              autoSize
            />
          </div>
        </DescriptionStyle>
      </div>
      <Reorder.Group
        values={questionsList}
        onReorder={updateQuestionsList}
        className="reorder-group"
      >
        <div>
          {questionsList.map((question, idx) => {
            return (
              <Reorder.Item
                value={question}
                key={question.tempId}
                dragListener={!(isMobile() || isTablet())}
              >
                <QuestionCard
                  question={question}
                  onEdit={editQuestion}
                  onReorderKey={onReorderKey}
                  firstQuestion={idx === 0}
                  lastQuestion={idx === questionsList.length - 1}
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
    </StyleWrapper>
  );
};
