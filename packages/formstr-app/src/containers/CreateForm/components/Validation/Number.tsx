import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import NumberInput from "./NumberInput";
import { IProps } from "./typeDefs";

function Number({ answerSettings, handleAnswerSettings }: IProps) {
  const numberConstraints =
    answerSettings.validationRules?.[AnswerTypes.number]?.[0] as { min: number; max: number };

  return (
    <div>
      <NumberInput
        label="Min:"
        value={numberConstraints?.min}
        onChange={(val) =>
          handleAnswerSettings({
            validationRules: {
              [AnswerTypes.number]: [
                {
                  min: val,
                  max: numberConstraints?.max,
                },
              ],
            },
          })
        }
      />
      <NumberInput
        label="Min:"
        value={numberConstraints?.max}
        onChange={(val) =>
          handleAnswerSettings({
            validationRules: {
              [AnswerTypes.number]: [
                {
                  min: numberConstraints?.min,
                  max: val,
                },
              ],
            },
          })
        }
      />
    </div>
  );
}

export default Number;
