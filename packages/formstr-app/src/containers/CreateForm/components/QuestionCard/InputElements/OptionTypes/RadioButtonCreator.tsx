import { CloseOutlined } from "@ant-design/icons";
import { Input, Radio } from "antd";
import { useState } from "react";
import { IChoice } from "../types";
import OptionsStyle from "./Options.style";
import { AddOption } from "./AddOption";
import { handleDelete, handleLabelChange, hasOtherOption } from "./utils";

interface RadioButtonCreatorProps {
  initialValues?: Array<IChoice>;
  onValuesChange: (key: string, property: unknown) => void;
}

export const RadioButtonCreator: React.FC<RadioButtonCreatorProps> = ({
  initialValues,
  onValuesChange,
}) => {
  const [choices, setChoices] = useState<Array<IChoice>>(initialValues || []);

  const handleNewChoices = (choices: Array<IChoice>) => {
    setChoices(choices);
    onValuesChange("choices", choices);
  };

  return (
    <OptionsStyle>
      {choices?.map((choice) => {
        return (
          <div className="radioButtonItem" key={choice.tempId}>
            <Radio disabled />
            <Input
              key={choice.tempId}
              defaultValue={choice.label}
              onChange={(e) => {
                handleLabelChange(
                  e.target.value,
                  choice.tempId,
                  choices,
                  handleNewChoices
                );
              }}
              placeholder="Enter an option"
              className="choice-input"
              disabled={choice.isOther}
            />
            {choices.length >= 2 && (
              <CloseOutlined
                onClick={(e) => {
                  handleDelete(choice.tempId, choices, handleNewChoices);
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
        choices={choices}
        callback={handleNewChoices}
        displayOther={!hasOtherOption(choices)}
      />
    </OptionsStyle>
  );
};
