import NumberInput from "./NumberInput";
import { IProps } from "./typeDefs";

function Text({ answerTypes, answerSettings, handleAnswerSettings }: IProps) {
  const rule = answerSettings.validationRules?.[answerTypes]?.[0] as {
    maxChar: number;
  };

  return (
    <NumberInput
      label="Max Char:"
      value={rule?.maxChar}
      onChange={(val) =>
        handleAnswerSettings({
          validationRules: {
            [answerTypes]: [
              {
                maxChar: val,
              },
            ],
          },
        })
      }
    />
  );
}

export default Text;
