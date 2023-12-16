interface QuestionContextProps {
  inputType: string;
  propertiesHandler: (properties: unknown) => void;
}

const QuestionContext: React.FC<QuestionContextProps> = ({
  inputType,
  propertiesHandler,
}) => {
  return <></>;
};

export default QuestionContext;
