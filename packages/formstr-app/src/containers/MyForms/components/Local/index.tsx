import { Table } from "antd";
import EmptyScreen from "../../../../components/EmptyScreen";
import { ILocalForm } from "./typeDefs";
import { LOCAL_STORAGE_KEYS, getItem } from "../../../../utils/localStorage";
import {
  makeTag,
  constructFormUrl,
  constructResponseUrl,
} from "../../../../utils/utility";

const columns = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    width: 25,
  },
  {
    key: "createdAt",
    title: "Saved on",
    dataIndex: "createdAt",
    width: 15,
    render: (createdAt: string) => new Date(createdAt).toDateString(),
  },
  {
    key: "publicKey",
    title: "Form Url",
    dataIndex: "publicKey",
    width: 30,
    ellipsis: true,
    render: (publicKey: string) => {
      let link = constructFormUrl(publicKey);
      return <a href={link}>{link}</a>;
    },
  },
  {
    key: "privateKey",
    title: "Response Url",
    dataIndex: "privateKey",
    width: 30,
    ellipsis: true,
    render: (privateKey: string) => {
      let link = constructResponseUrl(privateKey);
      return <a href={link}>{link}</a>;
    },
  },
];

function Local() {
  let localForms = getItem<ILocalForm[]>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) ?? [];
  localForms = localForms.map((form) => ({ ...form, key: makeTag(6) }));

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
