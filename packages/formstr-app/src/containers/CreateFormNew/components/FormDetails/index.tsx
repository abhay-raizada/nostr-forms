import { Button, Card, Checkbox, Divider, Modal, Typography } from "antd";
import { constructFormUrl } from "../../../../utils/formUtils";
import { ReactComponent as Success } from "../../../../Images/success.svg";
import { constructResponseUrl } from "../../../../utils/formUtils";
import FormDetailsStyle from "./FormDetails.style";
import { useEffect, useState } from "react";
import { CopyButton } from "../../../../components/CopyButton";
import { ILocalForm } from "../../providers/FormBuilder/typeDefs";
import {
  getItem,
  LOCAL_STORAGE_KEYS,
  setItem,
} from "../../../../utils/localStorage";
import { useProfileContext } from "../../../../hooks/useProfileContext";
import { SimplePool, UnsignedEvent } from "nostr-tools";
import { getDefaultRelays } from "@formstr/sdk";
import { KINDS, Tag } from "../../../../nostr/types";

const { Text } = Typography;
interface FormDetailsProps {
  isOpen: boolean;
  pubKey: string;
  secretKey: string;
  viewKey?: string;
  formId: string;
  name: string;
  relay: string;
  onClose: () => void;
}

export const FormDetails: React.FC<FormDetailsProps> = ({
  isOpen,
  pubKey,
  formId,
  onClose,
  secretKey,
  viewKey,
  name,
  relay,
}) => {
  const [savedLocally, setSavedLocally] = useState(false);
  const [savedOnNostr, setSavedOnNostr] = useState<null | "saving" | "saved">(
    null
  );

  console.log("Inside form details", isOpen);
  const { pubkey: userPub, requestPubkey } = useProfileContext();
  const saveToDevice = (
    formAuthorPub: string,
    formAuthorSecret: string,
    formId: string,
    name: string,
    relay: string,
    viewKey?: string
  ) => {
    console.log("inside save to device");
    let saveObject: ILocalForm = {
      key: `${formAuthorPub}:${formId}`,
      publicKey: `${formAuthorPub}`,
      privateKey: `${formAuthorSecret}`,
      name: name,
      formId: formId,
      relay: relay,
      createdAt: new Date().toString(),
    };
    if (viewKey) saveObject.viewKey = viewKey;
    let forms =
      getItem<Array<ILocalForm>>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) || [];
    const existingKeys = forms.map((form) => form.key);
    if (existingKeys.includes(saveObject.key)) {
      setSavedLocally(true);
      return;
    }
    forms.push(saveObject);
    setItem(LOCAL_STORAGE_KEYS.LOCAL_FORMS, forms);
    setSavedLocally(true);
  };

  const saveToMyForms = async (
    formAuthorPub: string,
    formAuthorSecret: string,
    formId: string,
    relay: string,
    viewKey?: string
  ) => {
    if (!userPub) return;
    setSavedOnNostr("saving");
    let existingListFilter = {
      kinds: [KINDS.myFormsList],
      authors: [userPub],
    };
    let pool = new SimplePool();
    let existingList = await pool.querySync(
      getDefaultRelays(),
      existingListFilter
    );
    let forms: Tag[] = [];
    if (existingList[0]) {
      let formsString = await window.nostr.nip44.decrypt(
        userPub,
        existingList[0].content
      );
      try {
        forms = JSON.parse(formsString);
      } catch (e) {
        console.error("My Forms List is not parseable");
        return;
      }
    }
    let key = `${formAuthorPub}:${formId}`;
    if (forms.map((f) => f[1]).includes(key)) {
      setSavedOnNostr("saved");
      return;
    }
    let secrets = `${formAuthorSecret}`;
    if (viewKey) secrets = `${secrets}:${viewKey}`;
    forms.push(["f", `${key}`, `${relay}`, `${secrets}`]);
    let encryptedString = await window.nostr.nip44.encrypt(
      userPub,
      JSON.stringify(forms)
    );
    let myFormEvent: UnsignedEvent = {
      kind: KINDS.myFormsList,
      content: encryptedString,
      pubkey: userPub,
      tags: [],
      created_at: Math.round(Date.now() / 1000),
    };
    let signedEvent = await window.nostr.signEvent(myFormEvent);
    await Promise.allSettled(pool.publish(getDefaultRelays(), signedEvent));
    setSavedOnNostr("saved");
  };

  useEffect(() => {
    saveToDevice(pubKey, secretKey, formId, name, relay, viewKey);
    if (userPub) saveToMyForms(pubKey, secretKey, formId, relay, viewKey);
  }, [userPub]);

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

  const formUrl = constructFormUrl(pubKey, formId, relay, viewKey);
  const responsesUrl = constructResponseUrl(secretKey, formId);

  function constructEmbeddedUrl(
    pubKey: string,
    formId: string,
    options: { [key: string]: boolean } = {}
  ) {
    let embeddedUrl = constructFormUrl(pubKey, formId, relay);

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
        <div>
          <Success />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <Text> Your form is now live at the below url! </Text>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <a href={formUrl}>{formUrl}</a>
            <CopyButton
              getText={() => {
                return formUrl;
              }}
              textBefore=""
              textAfter=""
            />
          </div>
        </div>

        {responsesUrl && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <Text>
                {" "}
                You can see responses for this form at the below url{" "}
              </Text>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <a href={responsesUrl}>{responsesUrl}</a>
              <CopyButton
                getText={() => {
                  return responsesUrl!;
                }}
                textBefore=""
                textAfter=""
              />
            </div>
          </div>
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
          <CopyButton getText={getIframeContent} textBefore="" textAfter="" />
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
          <Divider />
          <div>Saved Locally? {savedLocally ? "✅" : "❌"}</div>
          {userPub ? (
            savedOnNostr === "saving" ? (
              <div>Saving to nostr profile..</div>
            ) : (
              <div> Saved To Profile? {savedOnNostr ? "✅" : "❌"}</div>
            )
          ) : (
            <div>
              <Typography.Text>Login to save to your profile</Typography.Text>
              <Button onClick={requestPubkey}>Login</Button>
            </div>
          )}
        </Card>
      </FormDetailsStyle>
    </Modal>
  );
};
