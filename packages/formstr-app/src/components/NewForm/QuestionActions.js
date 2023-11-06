import { CopyFilled, DeleteFilled, EditFilled } from "@ant-design/icons";

const QuestionActions = ({
  index,
  handleQuestionEdit,
  handleQuestionClone,
  handleQuestionDelete,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div title="edit">
        <EditFilled onClick={() => handleQuestionEdit(index)} />
      </div>
      <div title="clone" style={{ marginLeft: "10px" }}>
        <CopyFilled onClick={() => handleQuestionClone(index)} />
      </div>
      <div title="delete" style={{ marginLeft: "10px" }}>
        <DeleteFilled onClick={() => handleQuestionDelete(index)} />
      </div>
    </div>
  );
};

export default QuestionActions;
