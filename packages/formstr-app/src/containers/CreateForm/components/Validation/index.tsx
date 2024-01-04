import { Typography } from "antd";
import Number from "./Number";
import TextRule from "./Text";
import { IProps } from "./typeDefs";
import { AnswerTypes } from "@formstr/sdk/dist/interfaces";

const { Text } = Typography;

function Validation(props: IProps) {
  const { answerTypes } = props;

  const getComponent = () => {
    switch (answerTypes) {
      case AnswerTypes.number:
        return <Number {...props} />;
      case AnswerTypes.shortText:
      case AnswerTypes.paragraph:
        return <TextRule {...props} />
      default:
        break;
    }
  };

  if (
    ![
      AnswerTypes.number,
      AnswerTypes.shortText,
      AnswerTypes.paragraph,
    ].includes(answerTypes)
  ) {
    return null;
  }

  return (
    <div className="input-property">
      <Text className="property-title">Validation</Text>
      {getComponent()}
    </div>
  );
}

export default Validation;
