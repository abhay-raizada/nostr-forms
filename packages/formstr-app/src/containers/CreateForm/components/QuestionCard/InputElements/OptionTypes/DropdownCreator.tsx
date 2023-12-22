import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, MenuProps } from "antd";
import { useState } from "react";
import { IChoice } from "../types";
import OptionsStyle from "./Options.style";
import { AddOption } from "./AddOption";
import { handleDelete, handleLabelChange } from "./utils";

interface RadioButtonCreatorProps {
  initialValues?: Array<IChoice>;
  onValuesChange: (key: string, property: unknown) => void;
}

export const DropdownCreator: React.FC<RadioButtonCreatorProps> = ({
  initialValues,
  onValuesChange,
}) => {
  const [choices, setChoices] = useState<Array<IChoice>>(initialValues || []);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleNewChoices = (choices: Array<IChoice>) => {
    setChoices(choices);
    onValuesChange("choices", choices);
    setIsOpen(true);
  };

  const getMenuItems = (): MenuProps["items"] => {
    return choices.map((choice) => {
      return {
        label: (
          <div className="radioButtonItem">
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
            <div>
              {choices.length >= 2 && (
                <CloseOutlined
                  onClick={(e) => {
                    handleDelete(choice.tempId, choices, handleNewChoices);
                  }}
                />
              )}
            </div>
          </div>
        ),
        key: choice.tempId,
      };
    });
  };
  return (
    <OptionsStyle>
      <Dropdown
        menu={{ items: getMenuItems(), onClick: () => {} }}
        open={isOpen}
        className="dropdown"
        onOpenChange={(nextOpen, info) => {
          if (info.source === "trigger") setIsOpen(nextOpen);
        }}
      >
        <Button onClick={(e) => e.preventDefault()}>
          Options {"( "}
          {choices.length} {" )"} <CaretDownOutlined />
        </Button>
      </Dropdown>
      <AddOption
        disable={choices.some((choice) => {
          return choice.label === "";
        })}
        choices={choices}
        callback={handleNewChoices}
        displayOther={false}
      />
    </OptionsStyle>
  );
};
