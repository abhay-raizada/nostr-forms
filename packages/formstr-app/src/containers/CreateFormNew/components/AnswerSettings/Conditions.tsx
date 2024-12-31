import { Select, Button, Space, Typography, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import styled from "styled-components";
import { useState } from "react";
import { AnswerTypes } from "@formstr/sdk/dist/interfaces";

const { Text } = Typography;

const StyleWrapper = styled.div`
  .conditions {
    padding: 16px;
  }
  .property-title {
    margin-bottom: 16px;
    font-weight: 500;
  }
  .condition-rule {
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  .rule-item {
    margin-bottom: 12px;
  }
  .rule-label {
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.65);
  }
`;

interface ConditionsProps {
  answerSettings: {
    conditions?: {
      rules: Array<{
        questionId: string;
        value: "yes" | "no";
      }>;
    };
  };
  handleAnswerSettings: (settings: any) => void;
}

const Conditions: React.FC<ConditionsProps> = ({
    answerSettings,
    handleAnswerSettings,
  }) => {
    const { questionsList, questionIdInFocus } = useFormBuilderContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    // Get all questions that come before this one
    const availableQuestions = questionsList.slice(
      0,
      questionsList.findIndex((q) => q[1] === questionIdInFocus)
    );
  
    const conditions = answerSettings.conditions || {
        rules: []
      };
      
  const handleAddRule = () => {
    const newConditions = {
      ...conditions,
      rules: [...conditions.rules, { questionId: "", value: "yes" }],
    };
    handleAnswerSettings({ conditions: newConditions });
  };

  const handleRemoveRule = (index: number) => {
    const newRules = [...conditions.rules];
    newRules.splice(index, 1);
    handleAnswerSettings({
      conditions: {
        ...conditions,
        rules: newRules,
      },
    });
  };

  const updateRule = (index: number, field: string, value: any) => {
    const newRules = [...conditions.rules];
    newRules[index] = {
      ...newRules[index],
      [field]: value,
    };
    handleAnswerSettings({
      conditions: {
        ...conditions,
        rules: newRules,
      },
    });
  };

  return (
    <StyleWrapper>
      <div className="conditions">
        <Text className="property-title">Conditions</Text>

        <Button
          type="default"
          onClick={() => setIsModalOpen(true)}
          icon={<SettingOutlined />}
          style={{ width: "100%" }}
        >
          Configure Conditions{" "}
          {conditions.rules.length > 0 && `(${conditions.rules.length})`}
        </Button>

        <Modal
          title="Configure Conditions"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {conditions.rules.map((rule, index) => (
            <div key={index} className="condition-rule">
              <div className="rule-item">
                <Text className="rule-label">Show this question if</Text>
                <Select
                  placeholder="Select question"
                  value={rule.questionId}
                  onChange={(value) => updateRule(index, "questionId", value)}
                  style={{ width: "100%" }}
                >
                  {availableQuestions.map((q) => (
                    <Select.Option key={q[1]} value={q[1]}>
                      {q[3]}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div className="rule-item">
                <Text className="rule-label">is answered as</Text>
                <Select
                  value={rule.value}
                  onChange={(value) => updateRule(index, "value", value)}
                  style={{ width: "100%" }}
                >
                  <Select.Option value="yes">Yes</Select.Option>
                  <Select.Option value="no">No</Select.Option>
                </Select>
              </div>

              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveRule(index)}
                style={{ marginTop: 8 }}
              >
                Remove Condition
              </Button>
            </div>
          ))}

          <Button
            type="dashed"
            onClick={handleAddRule}
            icon={<PlusOutlined />}
            style={{ width: "100%" }}
          >
            Add Condition
          </Button>
        </Modal>
      </div>
    </StyleWrapper>
  );
};

export default Conditions;