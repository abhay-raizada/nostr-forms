import { ValidationRuleTypes, RangeRule } from "@formstr/sdk/dist/interfaces";
import { Typography } from "antd";
import { InputStyle } from "./validation.style";

const { Text } = Typography;

function Min({ rule, onChange }: { rule?: RangeRule; onChange: Function }) {
  return (
    <>
      <InputStyle>
        <Text className="property-name">Range Min:</Text>
        <input
          className="number-input"
          type="number"
          value={rule?.min}
          onChange={(e) =>
            onChange(ValidationRuleTypes.range, {
              min: e.target.value,
              max: rule?.max,
            })
          }
        />
      </InputStyle>
      <InputStyle>
        <Text className="property-name">Range Max:</Text>
        <input
          className="number-input"
          type="number"
          value={rule?.max}
          onChange={(e) =>
            onChange(ValidationRuleTypes.range, {
              min: rule?.min,
              max: e.target.value,
            })
          }
        />
      </InputStyle>
    </>
  );
}

export default Min;
