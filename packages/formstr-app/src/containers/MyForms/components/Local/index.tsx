import { Table } from "antd";
import EmptyScreen from "../../../../components/EmptyScreen";
import ResponsiveLink from "../../../../components/ResponsiveLink";
import { ILocalForm } from "./typeDefs";
import { LOCAL_STORAGE_KEYS, getItem } from "../../../../utils/localStorage";
import {
  makeTag,
  constructFormUrl,
  constructResponseUrl,
  isMobile,
} from "../../../../utils/utility";

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
      let link = constructFormUrl(publicKey);
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
      let link = constructResponseUrl(privateKey);
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

  return (
    <div>
      {!!localForms.length && (
        <Table
          columns={columns}
          dataSource={localForms}
          pagination={false}
          scroll={{ y: "calc(100vh - 208px)" }}
        />
      )}
      {!localForms.length && <EmptyScreen />}
    </div>
  );
}

export default Local;
