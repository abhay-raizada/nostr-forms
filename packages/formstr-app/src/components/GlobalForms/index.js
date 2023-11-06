import { useEffect, useState } from "react";
import { fetchGlobalFeed } from "../../utils/nostr";
import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

export const GlobalForms = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const { Title, Text } = Typography;

  useEffect(() => {
    (async () => {
      if (forms.length === 0) {
        const formFeed = await fetchGlobalFeed();
        setForms(formFeed);
      }
    })();
  }, [forms]);

  return (
    <>
      {forms.length !== 0 && (
        <div>
          <Title level={3}> Recent {forms.length} forms from global </Title>
          {forms.map((formString) => {
            let form = JSON.parse(formString.content);
            return (
              <Card
                key={form.name}
                title={form.name}
                hoverable={true}
                style={{
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                  textAlign: "left",
                  margin: "10px",
                }}
                onClick={() => {
                  navigate(`/forms/${formString.pubkey}`);
                }}
              >
                {" "}
                <ul>
                  {form.fields.map((field) => {
                    return <li> {field.question}</li>;
                  })}{" "}
                </ul>
              </Card>
            );
          })}
        </div>
      )}
      {forms.length === 0 && (
        <Text>Traveling through the world to look for forms...</Text>
      )}
    </>
  );
};
