import { Card, Checkbox, Modal, Typography } from "antd";
import { constructFormUrl } from "../../../../utils/formUtils";
import { ReactComponent as Success } from "../../../../Images/success.svg";
import { constructResponseUrl } from "../../../../utils/formUtils";
import FormDetailsStyle from "./FormDetails.style";
import { useState } from "react";
import { CopyButton } from "../../../../components/CopyButton";

const { Text } = Typography;
interface FormDetailsProps {
  isOpen: boolean;
  pubKey: string;
  secretKey: string;
  viewKey?: string;
  formId: string
  onClose: () => void;
}

export const FormDetails: React.FC<FormDetailsProps> = ({
  isOpen,
  pubKey,
  formId,
  onClose,
  secretKey,
  viewKey
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

  const formUrl = constructFormUrl(pubKey, formId, viewKey);
  const responsesUrl = constructResponseUrl(
      secretKey,
      formId
    );

  function constructEmbeddedUrl(
    pubKey: string,
    formId: string,
    options: { [key: string]: boolean } = {}
  ) {
    let embeddedUrl = constructFormUrl(pubKey, formId);

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
      pubKey,
      formId,
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
        <>
          <div>
            <Success />
          </div>
          <div>
            <Text> Your form is now live at the below url! </Text>
          </div>
          <a href={formUrl}>{formUrl}</a>
          <CopyButton
            getText={() => {
              return formUrl;
            }}
          />
        </>

        {responsesUrl && (
          <>
            <div>
              <Text>
                {" "}
                You can see responses for this form at the below url{" "}
              </Text>
            </div>
            <a href={responsesUrl}>{responsesUrl}</a>
            <CopyButton
              getText={() => {
                return responsesUrl!;
              }}
            />
          </>
        )}
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
