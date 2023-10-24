import { Typography, Card } from "antd";
import "./index.css";

const { Title, Text } = Typography;

const Analytics = (props) => {
  const { responses } = props;
  let responsesJSON = responses.map((response) => {
    return JSON.parse(response.plaintext);
  });
  let questionHash = {};
  responsesJSON.forEach((questions) => {
    questions.forEach((question) => {
      if (question.answerType === "singleChoice") {
        if (questionHash[question.tag]) {
          questionHash[question.tag].answers.push(question.inputValue);
        } else {
          questionHash[question.tag] = {
            question: question.question,
            answers: [question.inputValue],
          };
        }
      }
    });
  });
  let aggregations = Object.keys(questionHash).map((tag) => {
    let frequencyHash = {};
    let total = 0;
    questionHash[tag].answers.forEach((choice) => {
      total += 1;
      if (frequencyHash[choice]) {
        frequencyHash[choice] += 1;
      } else {
        frequencyHash[choice] = 1;
      }
    });
    return {
      tag: tag,
      aggregations: frequencyHash,
      total,
      question: questionHash[tag].question,
    };
  });
  return (
    <div>
      <Title level={2}> Analytics</Title>
      {/* {console.log("aggregates", aggregates)} */}
      {aggregations.length === 0 && (
        <Text> No suitable data to show analytics </Text>
      )}
      {aggregations.map((ag) => {
        let { question, aggregations, total } = ag;
        return (
          <Card key={question} title={question}>
            <ul style={{ textAlign: "left" }}>
              {" "}
              {Object.keys(aggregations).map((a) => {
                return (
                  <li key={a}>
                    {" "}
                    <h3>{a}:</h3> {((aggregations[a] / total) * 100).toFixed(2)}{" "}
                    %{"("}
                    {aggregations[a]} Responses{")"}{" "}
                  </li>
                );
              })}{" "}
            </ul>
          </Card>
        );
      })}
    </div>
  );
};

export default Analytics;
