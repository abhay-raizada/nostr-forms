import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { IChoice } from "../types";
import { makeTag } from "../../../../../../utils/utility";
import { addOption } from "./utils";

const { Text } = Typography;

interface AddOptionProps {
  choices: Array<IChoice>;
  displayOther: boolean;
  disable: boolean;
  callback: (choices: Array<IChoice>) => void;
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
            { label: "Add option", tempId: makeTag(6) },
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
                { label: "Other", isOther: true, tempId: makeTag(6) },
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
