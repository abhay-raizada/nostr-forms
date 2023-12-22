import { CloseOutlined } from "@ant-design/icons";
import { Checkbox, Input } from "antd";
import { useState } from "react";
import { IChoice } from "../types";
import OptionsStyle from "./Options.style";
import { AddOption } from "./AddOption";
import { handleDelete, handleLabelChange, hasOtherOption } from "./utils";

interface CheckboxCreatorProps {
  initialValues?: Array<IChoice>;
  onValuesChange: (key: string, property: unknown) => void;
}

export const CheckboxCreator: React.FC<CheckboxCreatorProps> = ({
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
          <div className="radioButtonItem">
            <Checkbox disabled />
            <Input
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
