import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, MenuProps } from "antd";
import { useState } from "react";
import OptionsStyle from "./Options.style";
import { AddOption } from "./AddOption";
import { handleDelete, handleLabelChange } from "./utils";
import { Choice } from "@formstr/sdk/dist/interfaces";
import { MenuItemType } from "antd/es/menu/hooks/useItems";

interface RadioButtonCreatorProps {
  initialValues?: Array<Choice>;
  onValuesChange: (key: string, property: unknown) => void;
}

export const DropdownCreator: React.FC<RadioButtonCreatorProps> = ({
  initialValues,
  onValuesChange,
}) => {
  const [choices, setChoices] = useState<Array<Choice>>(initialValues || []);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleNewChoices = (choices: Array<Choice>) => {
    setChoices(choices);
    onValuesChange("choices", choices);
    setIsOpen(true);
  };

  const getMenuItems = (): MenuProps["items"] => {
    return choices.map((choice) => {
      return {
        label: (
          <div className="radioButtonItem" key={choice.choiceId}>
            <Input
              defaultValue={choice.label}
              key={choice.choiceId}
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
            <div>
              {choices.length >= 2 && (
                <CloseOutlined
                  onClick={(e) => {
                    handleDelete(choice.choiceId!, choices, handleNewChoices);
                  }}
                />
              )}
            </div>
          </div>
        ),
        key: choice.choiceId,
      } as MenuItemType;
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
