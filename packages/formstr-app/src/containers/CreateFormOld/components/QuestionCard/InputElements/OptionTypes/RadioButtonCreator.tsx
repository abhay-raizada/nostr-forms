import { CloseOutlined } from "@ant-design/icons";
import { Input, Radio } from "antd";
import { useState } from "react";
import OptionsStyle from "./Options.style";
import { AddOption } from "./AddOption";
import { handleDelete, handleLabelChange, hasOtherOption } from "./utils";
import { Choice } from "@formstr/sdk/dist/interfaces";

interface RadioButtonCreatorProps {
  initialValues?: Array<Choice>;
  onValuesChange: (key: string, property: unknown) => void;
}

export const RadioButtonCreator: React.FC<RadioButtonCreatorProps> = ({
  initialValues,
  onValuesChange,
}) => {
  const [choices, setChoices] = useState<Array<Choice>>(initialValues || []);

  const handleNewChoices = (choices: Array<Choice>) => {
    setChoices(choices);
    onValuesChange("choices", choices);
  };

  return (
    <OptionsStyle>
      {choices?.map((choice) => {
        return (
          <div className="radioButtonItem" key={choice.choiceId}>
            <Radio disabled key={choice.choiceId + "choice"} />
            <Input
              key={choice.choiceId + "input"}
              defaultValue={choice.label}
              onChange={(e) => {
                handleLabelChange(
                  e.target.value,
                  choice.choiceId!,
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
                  handleDelete(choice.choiceId!, choices, handleNewChoices);
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
