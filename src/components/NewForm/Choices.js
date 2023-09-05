import { Button, Input, Radio, Typography } from "antd";
import { useState } from "react";
import { makeTag } from "../../utils/utility";

const Choices = (props) => {
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState(true);
  const [currentInput, setCurrentInput] = useState(true);

  const { Title } = Typography;

  function handleCurrentInput(event) {
    setCurrentInput(event.target.value);
  }

  function addChoice() {
    const newChoices = [...choices, { message: currentInput, tag: makeTag(6) }];
    setChoices(newChoices);
    setNewChoice(false);
    setCurrentInput("");
    console.log("Chooooices", newChoices);
    props.onChoice(newChoices);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title level={3}>Options</Title>
      {choices.map((choice) => {
        return (
          <div style={{ margin: "10px" }}>
            {" "}
            <Radio disabled>{choice.message}</Radio>
          </div>
        );
      })}
      {newChoice && (
        <div style={{ display: "flex", flexDirection: "row", margin: "10px" }}>
          <Radio disabled />{" "}
          <Input onChange={handleCurrentInput} style={{ maxWidth: "80%" }} />{" "}
          <Button size="small" onClick={addChoice}>
            {" "}
            Add{" "}
          </Button>
        </div>
      )}
      {
        <Button
          type="dashed"
          shape="round"
          disabled={newChoice}
          onClick={() => {
            setNewChoice(true);
          }}
          style={{ maxWidth: "20%" }}
        >
          {" "}
          +{" "}
        </Button>
      }
    </div>
  );
};

export default Choices;
