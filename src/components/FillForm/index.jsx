import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import {
  getFormTemplate,
  getUserNpubByNip07,
  getResponsesByNpub,
} from "../../utils/nostr";
import { Button, Typography, Card } from "antd";
import { useParams } from "react-router-dom";
import NostrForm from "./NostrForm";
import { ShowPastResponses } from "./ShowPastResponses";

const FillForm = (props) => {
  const [formTemplate, setFormTemplate] = useState("");
  const [finished, setFinished] = useState(false);
  const [userNpub, setUserNpub] = useState(null);
  const [pastResponses, setPastResponses] = useState(null);
  const [showPastResponses, setShowPastResponses] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const { npub } = useParams();
  const { Text } = Typography;

  useEffect(() => {
    const fetchFormTemplate = async (npubInput) => {
      const template = await getFormTemplate(npubInput);
      setFormTemplate(template[0]?.content);
    };
    const initializeForm = async (npub) => {
      if (!formTemplate) fetchFormTemplate(npub);
      if (isEdit === null) fetchPastResponses(npub);
    };
    const fetchPastResponses = async (formNpub) => {
      let userPub = await initializeNpub();
      console.log("userpub", userPub);
      let responses = await initializeResponses(userPub, formNpub);
      let hasResponses = responses.length > 0;
      console.log("hash responses", hasResponses);
      setIsEdit(hasResponses);
    };

    const initializeResponses = async (userPub, formNpub) => {
      console.log("user form", userPub, formNpub);
      if (!userPub || !formNpub) {
        return;
      }
      let resp = await getResponsesByNpub(userPub, formNpub);
      setPastResponses(resp);
      return resp;
    };

    const initializeNpub = async () => {
      let pub = await getUserNpubByNip07();
      setUserNpub(pub);
      return pub;
    };
    if (npub) {
      initializeForm(npub);
    }
  }, [npub, userNpub, pastResponses, formTemplate, isEdit]);

  function handleShowPastResponses(event) {
    console.log("currently", showPastResponses);
    setShowPastResponses(!showPastResponses);
  }
  return (
    <>
      {formTemplate && !finished && (
        <Card
          extra={
            <Button
              type="primary"
              onClick={handleShowPastResponses}
              icon={<EditOutlined />}
            ></Button>
          }
        >
          <NostrForm
            content={JSON.parse(formTemplate)}
            npub={npub}
            onSubmit={() => {
              setFinished(true);
            }}
            existingResponses={isEdit}
          />
        </Card>
      )}

      <ShowPastResponses
        showPastResponses={showPastResponses}
        userResponses={pastResponses}
        onCancel={handleShowPastResponses}
      />
      {!formTemplate && npub && (
        <Text> Please wait while form is being fetched..</Text>
      )}
      {finished && <Text> Form has been submitted! </Text>}
    </>
  );
};
export default FillForm;
