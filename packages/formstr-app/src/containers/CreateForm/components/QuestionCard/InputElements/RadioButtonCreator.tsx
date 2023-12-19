import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Radio, Typography } from "antd";
import { useState } from "react";
import { IChoice } from "./types";
import { makeTag } from "../../../../../utils/utility";
import RadioButtonStyles from "./RadioButtonCreator.style";

const { Text } = Typography;

interface RadioButtonCreatorProps {
  initialValues?: Array<IChoice>;
  onValuesChange: (key: string, property: unknown) => void;
}

interface AddOptionProps {
  onClick: (option: IChoice) => void;
  isDisplayOther: boolean;
  disable: boolean;
}
const AddOption: React.FC<AddOptionProps> = ({
  onClick,
  isDisplayOther,
  disable,
}) => {
  return (
    <div className="addOptionButtons">
      <Button
        disabled={disable}
        type="dashed"
        onClick={(e) => {
          onClick({ label: "Add option", tempId: makeTag(6) });
        }}
        icon={<PlusOutlined />}
      >
        Add Option
      </Button>
      {isDisplayOther && (
        <>
          <div className="orText">
            <Text disabled={disable}>{" or "}</Text>
          </div>
          <Button
            type="dashed"
            disabled={disable}
            onClick={(e) => {
              onClick({ label: "Other", isOther: true, tempId: makeTag(6) });
            }}
          >
            add other
          </Button>
        </>
      )}
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

  const hasOtherOption = () => {
    return choices.some((choice) => {
      return choice.isOther;
    });
  };

  return (
    <RadioButtonStyles>
      {choices?.map((choice) => {
        return (
          <div className="radioButtonItem">
            <Radio disabled />
            <Input
              defaultValue={choice.label}
              onChange={(e) => {
                handleLabelChange(e.target.value, choice.tempId);
              }}
              placeholder="Enter an option"
              className=""
              disabled={choice.isOther}
            />
            {choices.length >= 2 && (
              <CloseOutlined
                onClick={(e) => {
                  handleDelete(choice.tempId);
                }}
              />
            )}
          </div>
        );
      })}
      <AddOption
        disable={choices.some((choice) => {
          return choice.label === "";
        })}
        onClick={addOption}
        isDisplayOther={!hasOtherOption()}
      />
    </RadioButtonStyles>
  );
};
