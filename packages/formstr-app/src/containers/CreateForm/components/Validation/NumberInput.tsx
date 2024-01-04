import { Typography } from "antd";
import { INumberProps } from "./typeDefs";
import { NumberInputStyle } from "./style";

const { Text } = Typography;

function NumberInput({ label, value, onChange }: INumberProps) {
  return (
    <NumberInputStyle>
      <Text className="property-name">{label}</Text>
      <input
        className="number-input"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </NumberInputStyle>
  );
}

export default NumberInput;
