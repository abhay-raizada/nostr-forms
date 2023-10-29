import { Button, Card, Form, Input, Select } from "antd";
import { AnswerTypes } from "../../constants/index";
import { NumberConstraints } from "./NumberConstraints";
import Choices from "./Choices";

const { TextArea } = Input

const initialQuesObj = {
  question: "",
  answerType: "",
};

const OPTION_TYPES = {
  CHOICE_OPTIONS: 1,
  NUMBER_OPTIONS: 2,
};

const QuestionCard = ({
  showOptions,
  handleSaveQuestion = null,
  handleQuestionNameChange,
  handleInputType,
  handleChoices,
  handleNumberConstraints,
  handleEditQuestion = null,
  form,
  question = initialQuesObj,
  editIndex = -1,
}) => {
  const { Option } = Select;

  const handleSave = () => {
    if (handleSaveQuestion) {
      handleSaveQuestion();
    } else {
      handleEditQuestion(editIndex);
    }
  };

  return (
    <Card type="inner" style={{ maxWidth: "100%", margin: "10px" }}>
      <Form form={form} onFinish={handleSave}>
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true }]}
        >
          <TextArea type="text" onChange={handleQuestionNameChange} autoSize />
        </Form.Item>
        <Form.Item name="inputType" label="Input type">
          <Select defaultValue="string" onSelect={handleInputType}>
            <Option value={AnswerTypes.string}>Short Answer</Option>
            <Option value={AnswerTypes.text}>Paragraph</Option>
            <Option value={AnswerTypes.singleChoice}>
              Choice{"("}Radio Button{")"}
            </Option>
            <Option value={AnswerTypes.multipleChoice} disabled>
              Choice{"("}Checkbox{")"}
            </Option>
            <Option value={AnswerTypes.number}>Number</Option>
            <Option value={AnswerTypes.date} disabled>
              Date
            </Option>
            <Option value={AnswerTypes.label}>Label(No Input)</Option>
          </Select>
        </Form.Item>
        {showOptions === OPTION_TYPES.CHOICE_OPTIONS && (
          <Form.Item name="choices">
            <Choices onChoice={handleChoices} choiceList={question.choices} />
          </Form.Item>
        )}
        {showOptions === OPTION_TYPES.NUMBER_OPTIONS && (
          <Form.Item name="numberConstraints">
            <NumberConstraints
              onConstraintsChange={handleNumberConstraints}
              numberConstraints={question.numberConstraints}
            />
          </Form.Item>
        )}
        <Button htmlType="submit">
          {editIndex !== -1 ? "Update Question" : "Add Question"}
        </Button>
      </Form>
    </Card>
  );
};

export default QuestionCard;
