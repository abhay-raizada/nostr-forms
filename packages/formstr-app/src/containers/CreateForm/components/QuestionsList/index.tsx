import QuestionCard from "../QuestionCard";
import { Button, Dropdown, MenuProps } from "antd";
import { Typography } from "antd";
import FormTitle from "../FormTitle";
import StyleWrapper from "./style";
import { INPUTS_MENU } from "../../configs/menuConfig";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";

const { Text } = Typography;

export const QuestionsList = () => {
  const {
    formSettings,
    questionsList,
    saveForm,
    editQuestion,
    addQuestion,
    setQuestionIdInFocus,
  } = useFormBuilderContext();

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const selectedItem = INPUTS_MENU.find((item) => item.key === e.key);
    addQuestion(selectedItem?.type);
  };

  return (
    <StyleWrapper onClick={() => setQuestionIdInFocus()}>
      <div>
        <FormTitle className="form-title" />
        {!!formSettings.description && (
          <div className="form-description">
            <Text>
              This is where the description of your form will appear! You can
              tap anywhere on the form to edit it, including this description.
            </Text>
          </div>
        )}
      </div>
      <div>
        {questionsList.map((question) => {
          return (
            <QuestionCard
              question={question}
              key={question.tempId}
              onEdit={editQuestion}
            />
          );
        })}
      </div>
      <div>
        <Dropdown.Button
          menu={{
            items: INPUTS_MENU,
            onClick: onMenuClick,
          }}
          onClick={() => addQuestion()}
        >
          Add +
        </Dropdown.Button>
      </div>
      <Button type="primary" onClick={saveForm}>
        Save Form
      </Button>
    </StyleWrapper>
  );
};
