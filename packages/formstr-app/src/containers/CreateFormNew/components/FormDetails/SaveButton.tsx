import { DownOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import { useProfileContext } from "../../../../hooks/useProfileContext";
import {
  getItem,
  LOCAL_STORAGE_KEYS,
  setItem,
} from "../../../../utils/localStorage";
import { ILocalForm } from "../../providers/FormBuilder/typeDefs";

interface ISaveButtonProps {
  formAuthorPub: string;
  formAuthorSecret: string;
  name: string;
  formId: string;
}

export const SaveButton: React.FC<ISaveButtonProps> = ({
  formAuthorPub,
  formAuthorSecret,
  name,
  formId,
}) => {
  const { pubkey: userPubkey } = useProfileContext();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "nostr") {
    } else {
    }
  };

  const saveToDevice = () => {
    let saveObject: ILocalForm = {
      key: `${formAuthorPub}:${formId}`,
      publicKey: `${formAuthorPub}`,
      privateKey: `${formAuthorSecret}`,
      name: name,
      formId: formId,
      createdAt: new Date().toString(),
    };
    let forms =
      getItem<Array<ILocalForm>>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) || [];
    const existingKeys = forms.map((form) => form.key);
    if (existingKeys.includes(saveObject.key)) {
      return;
    }
    forms.push(saveObject);
    setItem(LOCAL_STORAGE_KEYS.LOCAL_FORMS, forms);
  };

  const handleButtonClick = (event: any) => {
    if (event.target.innerText === "Save to this device") {
      saveToDevice();
    }
  };
  const items = [
    {
      label: "Save to this device",
      key: "local",
    },
    {
      label: "Save to nostr profile",
      key: "nostr",
      disabled: !userPubkey && true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown.Button
      menu={menuProps}
      type="primary"
      onClick={handleButtonClick}
      icon={<DownOutlined />}
      className="submit-button"
    >
      Save to {!userPubkey ? "nostr profile" : "this device only"}
    </Dropdown.Button>
  );
};
