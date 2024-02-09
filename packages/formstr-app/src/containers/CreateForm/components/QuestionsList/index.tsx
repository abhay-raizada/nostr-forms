import QuestionCard from "../QuestionCard";
import { Button, Input } from "antd";
import FormTitle from "../FormTitle";
import StyleWrapper from "./style";
import DescriptionStyle from "./description.style";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import { ChangeEvent } from "react";
import { IQuestion } from "../../typeDefs";
import { Reorder } from "framer-motion";

export const QuestionsList = () => {
  const {
    formSettings,
    questionsList,
    editQuestion,
    setQuestionIdInFocus,
    updateFormSetting,
    updateQuestionsList,
    setIsLeftMenuOpen,
    bottomElementRef,
  } = useFormBuilderContext();

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

  const onPlusButtonClick = () => {
    setIsLeftMenuOpen(true);
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
              value={formSettings.description}
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
                dragListener={false}
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
          <div ref={bottomElementRef}></div>
        </div>
      </Reorder.Group>
      <div>
        <Button
          type="primary"
          size="large"
          onClick={onPlusButtonClick}
          className="mobile-add-btn"
        >
          +
        </Button>
      </div>
    </StyleWrapper>
  );
};
