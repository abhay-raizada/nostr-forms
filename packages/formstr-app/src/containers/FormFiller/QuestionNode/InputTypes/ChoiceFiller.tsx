import { V1AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import {
  Checkbox,
  CheckboxProps,
  CheckboxRef,
  Radio,
  RadioChangeEvent,
  RadioGroupProps,
  RadioProps,
  Space,
} from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  MemoExoticComponent,
} from "react";

interface ChoiceFillerProps {
  answerType: AnswerTypes;
  answerSettings: V1AnswerSettings;
  onChange: (value: string) => void;
}

export const ChoiceFiller: React.FC<ChoiceFillerProps> = ({
  answerType,
  answerSettings,
  onChange,
}) => {
  function handleChoiceChange(e: RadioChangeEvent): void;

  function handleChoiceChange(checkedValues: CheckboxValueType[]): void;

  function handleChoiceChange(e: RadioChangeEvent | CheckboxValueType[]) {
    if (Array.isArray(e)) {
      onChange(e.join(";"));
      return;
    }
    onChange(e.target.value);
  }

  let ChoiceElement:
    | (ForwardRefExoticComponent<RadioProps & RefAttributes<CheckboxRef>> & {
        Group: MemoExoticComponent<ForwardRefExoticComponent<RadioGroupProps>>;
      })
    | (ForwardRefExoticComponent<CheckboxProps & RefAttributes<CheckboxRef>> & {
        Group: MemoExoticComponent<
          ForwardRefExoticComponent<CheckboxGroupProps>
        >;
      });
  if (answerType === AnswerTypes.radioButton) {
    ChoiceElement = Radio;
  } else if (answerType === AnswerTypes.checkboxes) {
    ChoiceElement = Checkbox;
  } else {
    return <></>;
  }

  return (
    <ChoiceElement.Group onChange={handleChoiceChange}>
      <Space direction="vertical">
        {answerSettings.choices?.map((choice) => {
          return (
            <ChoiceElement value={choice.choiceId}>
              {choice.label}{" "}
            </ChoiceElement>
          );
        })}
      </Space>
    </ChoiceElement.Group>
  );
};
