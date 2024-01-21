import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { makeTag } from "../../../../../../utils/utility";
import { addOption } from "./utils";
import { Choice } from "@formstr/sdk/dist/interfaces";

const { Text } = Typography;

interface AddOptionProps {
  choices: Array<Choice>;
  displayOther: boolean;
  disable: boolean;
  callback: (choices: Array<Choice>) => void;
}
export const AddOption: React.FC<AddOptionProps> = ({
  displayOther,
  disable,
  choices,
  callback,
}) => {
  return (
    <div className="addOptionButtons">
      <Button
        disabled={disable}
        type="dashed"
        onClick={(e) => {
          addOption(
            { label: "Add option", choiceId: makeTag(6) },
            choices,
            callback
          );
        }}
        icon={<PlusOutlined />}
      >
        Add Option
      </Button>
      {displayOther && (
        <>
          <div className="orText">
            <Text disabled={disable}>{" or "}</Text>
          </div>
          <Button
            type="dashed"
            disabled={disable}
            onClick={(e) => {
              addOption(
                { label: "Other", isOther: true, choiceId: makeTag(6) },
                choices,
                callback
              );
            }}
          >
            add other
          </Button>
        </>
      )}
    </div>
  );
};
