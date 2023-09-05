import { Button, Card } from "antd";
import { useEffect, useState } from "react";
import { getFormResponses } from "../../utils/nostr";
import Analytics from "./Analytics";

function ViewResponses(props) {
  const [nsec, setNsec] = useState("");
  const [responses, setResponses] = useState([]);

  async function getResponses() {
    let resp = await getFormResponses(nsec);
    console.log("fetching", resp);
    setResponses(resp);
  }
  function handleInputchange(event) {
    setNsec(event.target.value);
  }
  return (
    <>
      <input
        type="text"
        placeholder="Enter form nsec"
        onChange={handleInputchange}
      />
      <Button
        type="primary"
        onClick={async () => {
          await getResponses();
          return;
        }}
      >
        View Responses
      </Button>

      {responses.length !== 0 && <Analytics responses={responses} />}

      {responses.map((response, index) => {
        let questions = JSON.parse(response);
        console.log("r", response);
        return (
          <>
            <Card title={"Response " + (index + 1)}>
              {questions.map((question) => {
                console.log(question);
                return (
                  <Card type="inner" title={question.question}>
                    {question.inputValue}
                  </Card>
                );
              })}
            </Card>
          </>
        );
      })}
    </>
  );
}

export default ViewResponses;
