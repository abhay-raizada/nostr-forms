import { Typography, Card } from "antd";
import "./index.css";

const Analytics = (props) => {
  const { responses } = props;
  const { Title } = Typography;
  let responsesJSON = responses.map((response) => {
    return JSON.parse(response.plaintextq);
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
      {aggregations.map((ag) => {
        let { question, aggregations, total } = ag;
        return (
          <Card title={question}>
            <ul style={{ textAlign: "left" }}>
              {" "}
              {Object.keys(aggregations).map((a) => {
                return (
                  <li>
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
