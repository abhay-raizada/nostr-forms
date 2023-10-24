import { Button, Input, Form, Typography, Card, Select } from "antd";
import { useEffect, useState } from "react";
import {
  getFormResponses,
  getUserKind0s,
  getFormTemplatByNsec,
} from "../../utils/nostr";
import Analytics from "./Analytics";
import { useParams } from "react-router";
import Response from "./Responses";
import { ResponseFilters } from "../../constants";
import {Export} from "./Export";

const { Text } = Typography;

function ViewResponses() {
  const [nsecState, setNsecState] = useState("");
  const [responses, setResponses] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [selfSignedResponses, setSelfSignedResponses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [defaultFilter, setDefaultFilter] = useState(
    ResponseFilters.allResponses
  );

  const { nsec } = useParams();

  useEffect(() => {
    if (nsec && !responses) {
      getResponses(nsec);
    }
  });

  async function getResponses(nsecInput) {
    let resp = await getFormResponses(nsecInput);
    setResponses(resp);
    let pubkeysList = resp.map((r) => {
      return r.pubkey;
    });
    let userKind0 = await getUserKind0s(pubkeysList);
    let userInf = {};
    userKind0.forEach((kind0) => {
      userInf[kind0.pubkey] = JSON.parse(kind0.content);
    });
    if (Object.keys(userInfo).length === 0) {
      setUserInfo(userInf);
    }
    const nonAnonymousResponses = (resp || []).filter((response) => {
      return userInf[response.pubkey] !== undefined;
    });
    setSelfSignedResponses(nonAnonymousResponses);
    const formKind0 = await getFormTemplatByNsec(nsec);
    if (!selectedFilter && formKind0.settings?.selfSignForms) {
      setDefaultFilter(ResponseFilters.selfSignedResponses);
    } else if (!selectedFilter) {
      setDefaultFilter(ResponseFilters.allResponses);
    }
  }

  function getDisplayedResponses() {
    if (selectedFilter === ResponseFilters.selfSignedResponses) {
      return selfSignedResponses;
    }
    return responses;
  }

  function handleInputchange(event) {
    setNsecState(event.target.value);
  }

  function handleResponseFilterChange(value) {
    setSelectedFilter(value);
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
      {!nsec && (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          labelWrap
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            alignContent: "center",
            flexDirection: "column",
          }}
        >
          <Form.Item label="enter form private key">
            <Input
              type="text"
              placeholder="Enter form nsec"
              onChange={handleInputchange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={async () => {
                await getResponses(nsecState);
                return;
              }}
              style={{ margine: "10px" }}
            >
              View Responses
            </Button>
          </Form.Item>
        </Form>
      )}
      {responses?.length ? (
        <div style={{ display: "flex", flexDirection: "row", margin: "10px" }}>
          <Text style={{ margin: "5px" }}>Filter Responses</Text>
          <Select
            key={defaultFilter}
            defaultValue={defaultFilter}
            onChange={handleResponseFilterChange}
            options={[
              { value: ResponseFilters.allResponses, label: "All Responses" },
              {
                value: ResponseFilters.selfSignedResponses,
                label: "Self-Signed Responses",
              },
            ]}
          />
        </div>
      ) : null}
      {responses?.length && <Export responses={responses} userInfo={userInfo} />}
      {responses?.length ? (
        <Card>
          <Analytics responses={getDisplayedResponses()} />
        </Card>
      ) : null}
      {responses?.length ? (
        <Card>
          <Response responses={getDisplayedResponses()} userInfo={userInfo} />
        </Card>
      ) : null}
      {nsec && !responses?.length && (
        <Text>
          {" "}
          Searching for responses... If it takes a while there are probably no
          responses yet.
        </Text>
      )}
    </div>
  );
}

export default ViewResponses;
