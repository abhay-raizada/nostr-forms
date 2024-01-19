import { TimePicker, TimePickerProps } from "antd";

interface TimeFillerProps {
  onChange: (value: string) => void;
}

export const TimeFiller: React.FC<TimeFillerProps> = ({ onChange }) => {
  const handleChange: TimePickerProps["onChange"] = (_, timeString) => {
    onChange(timeString);
  };
  return (
    <>
      <TimePicker onChange={handleChange} />
    </>
  );
};
