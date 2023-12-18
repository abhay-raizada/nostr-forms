import QuestionCard from "../QuestionCard";
import { Button, Dropdown, MenuProps } from "antd";
import { Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
    updateFormSetting,
    updateFormTitleImage,
  } = useFormBuilderContext();

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const selectedItem = INPUTS_MENU.find((item) => item.key === e.key);
    addQuestion(selectedItem?.type);
  };

  return (
    <StyleWrapper onClick={() => setQuestionIdInFocus()}>
      <div>
        <div className="form-title">
          {!!formSettings.titleImageUrl && (
            <img
              className="title-image"
              src={formSettings.titleImageUrl}
              alt="title background"
            />
          )}
          <div className="image-utils">
            <label htmlFor="form-title-image">
              <div className="icon-util">
                <EditOutlined />
                <input
                  id="form-title-image"
                  className="file-input"
                  type="file"
                  accept="image/*"
                  onChange={updateFormTitleImage}
                />
              </div>
            </label>
            <div
              className="icon-util"
              onClick={() => updateFormSetting({ titleImageUrl: "" })}
            >
              <DeleteOutlined />
            </div>
          </div>
          <Text className="title-text">blah and blah</Text>
        </div>
        {!!formSettings.description && (
          <div className="form-description">
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi
              commodi vero praesentium non quaerat modi in at ut assumenda
              atque, iure, eos temporibus deserunt quidem eius voluptatum
              mollitia! Temporibus, esse. Lorem ipsum dolor sit, amet
              consectetur adipisicing elit. Tempora suscipit porro, maxime minus
              quo rem debitis provident ipsam expedita ipsa?
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
