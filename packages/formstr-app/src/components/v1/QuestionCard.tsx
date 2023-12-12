import { Button, Card, Form, FormInstance, Input, Select } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { useEditable } from "use-editable";
import { IQuestion } from "./Index";

type QuestionCardProps = {
  question: IQuestion;
};
const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { Option } = Select;

  const questionRef = useRef(null);
  const [questionText, setQuestionText] = useState("Click to edit");

  const handleChange = (text: string) => {
    setQuestionText(text);
    console.log("handleChange", text);
  };

  useEditable(questionRef, handleChange);

  // const handleSave = () => {
  //   if (handleSaveQuestion) {
  //     handleSaveQuestion();
  //   } else {
  //     handleEditQuestion(editIndex);
  //   }
  // };

  return (
    <Card
      type="inner"
      style={{
        maxWidth: "100%",
        margin: "10px",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", paddingBottom: 10 }}>
        <div style={{ padding: 5, paddingLeft: 0 }}>
          <ArrowUpOutlined style={{ fontSize: 12 }} />
        </div>
        <div style={{ padding: 5 }}>
          <ArrowDownOutlined style={{ fontSize: 12 }} />
        </div>
        <div style={{ padding: 5 }}>
          <StarFilled style={{ fontSize: 12 }} />
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label ref={questionRef}>{question.question}</label>
      </div>

      <Input
        placeholder="Type your answer here"
        bordered={false}
        disabled
        style={{
          paddingLeft: 0,
          // borderBottom: "0.5px solid black",
          borderRadius: 0,
        }}
      />
      {/* <Form form={form} onFinish={handleSave}>
        <Form.Item
          name="question"
          label="Click to edit"
          rules={[{ required: true }]}
        >
          <TextArea onChange={handleQuestionNameChange} autoSize />
        </Form.Item>
        <Form.Item name="inputType" label="Input type">
          <Select defaultValue={"blueeeeeee"} onSelect={handleInputType}>
            <Option value={AnswerTypes.shortText}>Short Answer</Option>
            <Option value={AnswerTypes.paragraph}>Paragraph</Option>
            <Option value={AnswerTypes.radioButton}>
              Choice{"("}Radio Button{")"}
            </Option>
            <Option value={AnswerTypes.checkboxes} disabled>
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
        {showOptions === OPTION_TYPES.NUMBER_OPTIONS &&
          question.numberConstraints && (
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
      </Form> */}
    </Card>
  );
};

export default QuestionCard;
