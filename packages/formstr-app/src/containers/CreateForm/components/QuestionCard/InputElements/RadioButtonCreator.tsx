import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Radio, Typography } from "antd";
import { useState } from "react";
import { IChoice } from "./types";
import { makeTag } from "../../../../../utils/utility";

const { Text } = Typography;

interface RadioButtonCreatorProps {
  initialValues?: Array<IChoice>;
  onValuesChange: (key: string, property: unknown) => void;
}

interface AddOptionProps {
  onClick: (option: IChoice) => void;
}
const AddOption: React.FC<AddOptionProps> = ({ onClick }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        margin: "2px",
      }}
    >
      <div>
        <PlusOutlined
          onClick={(e) => {
            onClick({ label: "Add option", tempId: makeTag(6) });
          }}
        />
        Add Option
      </div>
      <div style={{ marginLeft: "10px", marginRight: "10px" }}>
        <Text>{" or "}</Text>
      </div>
      <div
        onClick={(e) => {
          onClick({ label: "Other", isOther: true, tempId: makeTag(6) });
        }}
      >
        add other
      </div>
    </div>
  );
};

export const RadioButtonCreator: React.FC<RadioButtonCreatorProps> = ({
  initialValues,
  onValuesChange,
}) => {
  const [choices, setChoices] = useState<Array<IChoice>>(initialValues || []);

  const addOption = (option: IChoice) => {
    let newChoices = [...choices, option];
    console.log("new options", newChoices, choices);
    setChoices(newChoices);
    onValuesChange("choices", newChoices);
  };

  const handleDelete = (tempId: string) => {
    let newChoices = choices.filter((choice) => choice.tempId !== tempId);
    setChoices(newChoices);
    onValuesChange("choices", newChoices);
  };

  const handleLabelChange = (label: string, tempId: string) => {
    let newChoices = choices.map((choice) => {
      if (choice.tempId === tempId) return { ...choice, label: label };
      return choice;
    });
    setChoices(newChoices);
    onValuesChange("choices", newChoices);
  };

  return (
    <>
      {choices?.map((choice) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Radio disabled />
            <Input
              defaultValue={choice.label}
              onChange={(e) => {
                handleLabelChange(e.target.value, choice.tempId);
              }}
              disabled={choice.isOther}
            />
            <CloseOutlined
              onClick={(e) => {
                handleDelete(choice.tempId);
              }}
            />
          </div>
        );
      })}
      <AddOption onClick={addOption} />
    </>
  );
};
