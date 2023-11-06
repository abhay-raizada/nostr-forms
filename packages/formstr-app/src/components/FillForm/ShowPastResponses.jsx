import { Modal } from "antd";
import { Typography } from "antd";

const { Text } = Typography;

export function ShowPastResponses({
  showPastResponses,
  onCancel,
  userResponses,
}) {
  return (
    <Modal open={showPastResponses} onCancel={onCancel} footer={null}>
      {userResponses && (
        <ul>
          Previous Edits at:
          {userResponses.length === 0 && <Text> No Responses yet</Text>}
          {userResponses.map((response) => {
            let d = new Date(Number(response.created_at) * 1000);

            return <li>{d.toString()}</li>;
          })}
        </ul>
      )}
      {!userResponses && (
        <Text>
          {" "}
          Waiting for authorization on npub by a{" "}
          <a
            href="https://github.com/nostr-protocol/nips/blob/master/07.md"
            target="_blank"
            rel="noreferrer"
          >
            NIP07 Extension
          </a>
        </Text>
      )}
    </Modal>
  );
}
