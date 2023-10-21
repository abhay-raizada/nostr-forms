import { Button, Input, Radio, Typography } from "antd";
import { useEffect, useState } from "react";
import { makeTag } from "../../utils/utility";

const Choices = ({ onChoice, choiceList }) => {
  const [choices, setChoices] = useState([]);
  const [other, setOther] = useState(false);
  const [newChoice, setNewChoice] = useState(true);
  const [currentInput, setCurrentInput] = useState("");
  const [inputStatus, setInputStatus] = useState("");

  const { Title, Text } = Typography;

  useEffect(() => {
    setChoices(choiceList || []);
  }, [choiceList]);

  function handleCurrentInput(event) {
    setInputStatus("");
    setCurrentInput(event.target.value);
  }

  function addOther() {
    const newChoices = [
      ...choices,
      { message: "other", tag: makeTag(6), other: true },
    ];
    setChoices(newChoices);
    setNewChoice(false);
    setCurrentInput("");
    onChoice(newChoices);
    setOther(true);
  }

  function addChoice() {
    if (currentInput.length === 0) {
      setInputStatus("error");
      return;
    }
    const newChoices = [...choices, { message: currentInput, tag: makeTag(6) }];
    setChoices(newChoices);
    setNewChoice(false);
    setCurrentInput("");
    onChoice(newChoices);
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
        <div
          style={{ display: "flex", flexDirection: "column", margin: "10px" }}
        >
          <div
            style={{ display: "flex", flexDirection: "row", margin: "10px" }}
          >
            <Radio disabled />{" "}
            <Input
              onChange={handleCurrentInput}
              status={inputStatus}
              style={{ margin: "10px", maxWidth: "80%" }}
              placeholder={
                inputStatus === "error" ? "Cannot be blank" : "Enter Option"
              }
            />{" "}
          </div>
          <Button size="middle" style={{ margin: "10px" }} onClick={addChoice}>
            {" "}
            Add{" "}
          </Button>
          {!other && (
            <>
              <Text style={{ minWidth: "15px", margin: "10px" }}> or </Text>
              <Button
                size="middle"
                style={{ margin: "10px" }}
                onClick={addOther}
              >
                {" "}
                Add Other{" "}
              </Button>
            </>
          )}
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
