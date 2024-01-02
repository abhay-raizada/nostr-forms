import { DatePicker, DatePickerProps } from "antd";

interface DateFillerProps {
  onChange: (value: string) => void;
}

export const DateFiller: React.FC<DateFillerProps> = ({ onChange }) => {
  const handleChange: DatePickerProps["onChange"] = (date, dateString) => {
    onChange(dateString);
  };
  return (
    <>
      <DatePicker onChange={handleChange} />
    </>
  );
};
