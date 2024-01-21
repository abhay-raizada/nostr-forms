import { Modal, Typography } from "antd";
import { constructFormUrl } from "@formstr/sdk";
import { ReactComponent as Success } from "../../../../Images/success.svg";
import { constructResponseUrl } from "@formstr/sdk/dist/utils/utils";

const { Text } = Typography;
interface FormDetailsProps {
  isOpen: boolean;
  formCredentials: string[];
  onClose: () => void;
}

export const FormDetails: React.FC<FormDetailsProps> = ({
  isOpen,
  formCredentials,
  onClose,
}) => {
  if (formCredentials.length === 0) {
    return <></>;
  }
  const formUrl = constructFormUrl(formCredentials[0], window.location.origin);
  const responsesUrl = constructResponseUrl(
    formCredentials[1],
    window.location.origin
  );
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={false}
      width="auto"
    >
      <div className="form-details">
        <div>
          <Success />
        </div>
        <div>
          <Text> Your form is now live at the below url! </Text>
        </div>
        <a href={formUrl}>{formUrl}</a>
        <div>
          <Text> You can see responses for this form at the below url </Text>
        </div>
        <a href={responsesUrl}>{responsesUrl}</a>
        <div>
          <Text>
            {" "}
            Your form is backed up on this device, you can sync local forms with
            your nostr profile on the next screen.
          </Text>
        </div>
      </div>
    </Modal>
  );
};
