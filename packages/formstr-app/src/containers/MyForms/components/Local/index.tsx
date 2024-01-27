import { Button, Modal, Spin, Table } from "antd";
import EmptyScreen from "../../../../components/EmptyScreen";
import ResponsiveLink from "../../../../components/ResponsiveLink";
import { ILocalForm } from "./typeDefs";
import { LOCAL_STORAGE_KEYS, getItem } from "../../../../utils/localStorage";
import { makeTag, isMobile } from "../../../../utils/utility";
import { useLocation } from "react-router-dom";
import { FormDetails } from "./FormDetails";
import { useState } from "react";
import {
  constructFormUrl,
  constructResponseUrl,
  syncFormsOnNostr,
} from "@formstr/sdk";
import { SyncOutlined } from "@ant-design/icons";

const COLUMNS = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    width: 25,
    ellipsis: true,
  },
  {
    key: "createdAt",
    title: "Saved on",
    dataIndex: "createdAt",
    width: 15,
    render: (createdAt: string) => new Date(createdAt).toDateString(),
    isDisabled: isMobile,
  },
  {
    key: "publicKey",
    title: "Form Url",
    dataIndex: "publicKey",
    width: isMobile() ? 25 : 30,
    ellipsis: true,
    render: (publicKey: string) => {
      let link = constructFormUrl(publicKey, window.location.origin);
      return <ResponsiveLink link={link} />;
    },
  },
  {
    key: "privateKey",
    title: "Response Url",
    dataIndex: "privateKey",
    width: isMobile() ? 25 : 30,
    ellipsis: true,
    render: (privateKey: string) => {
      let link = constructResponseUrl(privateKey, window.location.origin);
      return <ResponsiveLink link={link} />;
    },
  },
];

function Local() {
  let localForms = getItem<ILocalForm[]>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) ?? [];
  localForms = localForms.map((form) => ({ ...form, key: makeTag(6) }));

  let columns = COLUMNS.filter(({ isDisabled }) => {
    if (isDisabled && isDisabled()) {
      return false;
    }
    return true;
  });

  const { state } = useLocation();
  const [showFormDetails, setShowFormDetails] = useState<boolean>(true);
  const [showSyncModal, setShowsyncModal] = useState<boolean>(false);

  const syncFormsWithNostr = async () => {
    let localForms =
      getItem<ILocalForm[]>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) ?? [];
    setShowsyncModal(true);
    await syncFormsOnNostr(
      localForms.map((form) => [form.publicKey, form.privateKey])
    );
    setShowsyncModal(false);
  };

  console.log("Form details should ppen? ", showFormDetails);

  return (
    <div>
      {!!localForms.length && (
        <div className="button-container">
          <Button
            type="primary"
            onClick={syncFormsWithNostr}
            className="sync-button"
            icon={<SyncOutlined />}
          >
            Sync to nostr
          </Button>
        </div>
      )}
      {!!localForms.length && (
        <Table
          columns={columns}
          dataSource={localForms}
          pagination={false}
          scroll={{ y: "calc(100vh - 228px)" }}
        />
      )}
      {!localForms.length && <EmptyScreen />}
      <FormDetails
        isOpen={showFormDetails}
        formCredentials={state || []}
        onClose={() => {
          setShowFormDetails(false);
        }}
      />
      <Modal open={showSyncModal} footer={null}>
        <Spin size="small" />
        Waiting for you to finish signing save events. Click{" "}
        <a
          href="https://nostrcheck.me/register/browser-extension.php"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{" "}
        to read more about nip-07 signing
      </Modal>
    </div>
  );
}

export default Local;
