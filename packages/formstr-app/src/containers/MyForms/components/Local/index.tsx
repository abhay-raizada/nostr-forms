import { Button, Modal, Spin, Table } from "antd";
import EmptyScreen from "../../../../components/EmptyScreen";
import ResponsiveLink from "../../../../components/ResponsiveLink";
import { ILocalForm } from "./typeDefs";
import {
  LOCAL_STORAGE_KEYS,
  getItem,
  useLocalStorageItems,
} from "../../../../utils/localStorage";
import { makeTag, isMobile } from "../../../../utils/utility";
import { useLocation } from "react-router-dom";
import { FormDetails } from "./FormDetails";
import { useEffect, useState } from "react";
import {
  constructFormUrl,
  constructResponseUrl,
  syncFormsOnNostr,
} from "@formstr/sdk";
import { SyncOutlined } from "@ant-design/icons";
import DeleteForm from "../DeleteForm";
import { FormPassword } from "@formstr/sdk/dist/interfaces";

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
    title: isMobile() ? "Form" : "Form Url",
    dataIndex: "publicKey",
    width: isMobile() ? 20 : 30,
    ellipsis: true,
    render: (publicKey: string, record: ILocalForm) => {
      const link = constructFormUrl(
        publicKey,
        record.formPassword,
        window.location.origin,
      );
      return <ResponsiveLink link={link} />;
    },
  },
  {
    key: "privateKey",
    title: "Response Url",
    dataIndex: "formCredentials",
    width: isMobile() ? 20 : 30,
    ellipsis: true,
    render: (formCredentials: string, record: ILocalForm) => {
      const link = constructResponseUrl(
        formCredentials[1],
        window.location.origin,
        formCredentials[0],
        record.formPassword,
      );
      return <ResponsiveLink link={link} />;
    },
  },
  {
    key: "actions",
    title: "Actions",
    ellipsis: true,
    dataIndex: "storageId",
    width: isMobile() ? 20 : 30,
    render: (storageId: string) => {
      return (
        <div
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DeleteForm type={"local"} formId={storageId} />
        </div>
      );
    },
  },
];

function Local() {
  let localForms =
    useLocalStorageItems<ILocalForm[]>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) ?? [];
  localForms = localForms.map((form) => ({
    ...form,
    storageId: form.key,
    key: makeTag(6),
    formCredentials: [form.publicKey, form.privateKey],
  }));

  const columns = COLUMNS.filter(({ isDisabled }) => {
    if (isDisabled && isDisabled()) {
      return false;
    }
    return true;
  });

  const { state } = useLocation();
  const [showFormDetails, setShowFormDetails] = useState<boolean>(!!state);
  const [showSyncModal, setShowsyncModal] = useState<boolean>(false);
  const [formCredentials, setFormCredentials] = useState<{
    formCreds: string[];
    formPassword: FormPassword;
  }>({ formPassword: "", formCreds: [] });

  useEffect(() => {
    if (state) {
      setShowFormDetails(true);
      setFormCredentials(state);
    }
  }, [state]);

  const syncFormsWithNostr = async () => {
    const localForms =
      getItem<ILocalForm[]>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) ?? [];
    setShowsyncModal(true);
    await syncFormsOnNostr(
      localForms.map((form) => [
        form.publicKey,
        form.privateKey,
        form.formPassword,
      ]),
    );
    setShowsyncModal(false);
  };

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
          onRow={(record) => {
            return {
              onClick: () => {
                setShowFormDetails(true);
                setFormCredentials({
                  formCreds: [record.publicKey, record.privateKey],
                  formPassword: record.formPassword,
                });
              },
            };
          }}
        />
      )}
      {!localForms.length && <EmptyScreen />}
      <FormDetails
        isOpen={showFormDetails}
        formCredentials={formCredentials.formCreds}
        formPassword={formCredentials.formPassword}
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
