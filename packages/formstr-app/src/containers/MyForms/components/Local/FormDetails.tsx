import { Card, Checkbox, Modal, Typography } from "antd";
import { constructFormUrl } from "@formstr/sdk";
import { ReactComponent as Success } from "../../../../Images/success.svg";
import { constructResponseUrl } from "@formstr/sdk/dist/utils/utils";
import FormDetailsStyle from "./FormDetails.style";
import { useState } from "react";
import { CopyButton } from "../../../../components/CopyButton";

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
  type TabKeyType = "share" | "embed";
  type OptionType = "hideTitleImage" | "hideDescription";
  const [activeTab, setActiveTab] = useState<TabKeyType>("share");
  const [embedOptions, setEmbedOptions] = useState<{
    hideTitleImage?: boolean;
    hideDescription?: boolean;
  }>({});

  const handleCheckboxChange = (option: OptionType) => {
    setEmbedOptions({
      ...embedOptions,
      [option]: !embedOptions[option],
    });
  };

  if (formCredentials.length === 0) {
    return <></>;
  }
  const formUrl = constructFormUrl(formCredentials[0], window.location.origin);
  const responsesUrl = constructResponseUrl(
    formCredentials[1],
    window.location.origin,
    formCredentials[0]
  );

  function constructEmbeddedUrl(
    formId: string,
    options: { [key: string]: boolean } = {}
  ) {
    let embeddedUrl = constructFormUrl(formId, window.location.origin, true);

    if (options.hideTitleImage) {
      embeddedUrl += "?hideTitleImage=true";
    }

    if (options.hideDescription) {
      embeddedUrl += options.hideTitleImage
        ? "&hideDescription=true"
        : "?hideDescription=true";
    }

    return embeddedUrl;
  }

  function getIframeContent() {
    return `<iframe src="${constructEmbeddedUrl(
      formCredentials[0],
      embedOptions
    )}" height="700px" width="480px" frameborder="0" style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" cellspacing="0" ></iframe>`;
  }
  const tabList = [
    {
      key: "share",
      label: "Share",
    },
    {
      key: "embed",
      tab: "Embed",
    },
  ];

  const TabContent = {
    share: (
      <div className="share-links">
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
    ),
    embed: (
      <div className="embedded-share">
        <div className="settings-container">
          <label className="settings-item">Embed Settings:</label>
          <Checkbox
            checked={embedOptions.hideTitleImage}
            onChange={() => handleCheckboxChange("hideTitleImage")}
            className="settings-item"
          >
            Hide Title Image
          </Checkbox>
          <Checkbox
            checked={embedOptions.hideDescription}
            onChange={() => handleCheckboxChange("hideDescription")}
            className="settings-item"
          >
            Hide Description
          </Checkbox>
        </div>
        <div className="embed-container">
          <code className="embedded-code">{getIframeContent()}</code>
        </div>
        <div>
          <CopyButton getText={getIframeContent} />
        </div>
      </div>
    ),
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={false}
      width="auto"
    >
      <FormDetailsStyle className="form-details">
        <Card
          bordered={false}
          tabList={tabList}
          className="form-details-card"
          onTabChange={(key: string) => setActiveTab(key as TabKeyType)}
        >
          {TabContent[activeTab]}
        </Card>
      </FormDetailsStyle>
    </Modal>
  );
};
