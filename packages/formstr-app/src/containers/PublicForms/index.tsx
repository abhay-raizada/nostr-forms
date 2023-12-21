import { useState, useEffect } from "react";
import { Table } from "antd";
import EmptyScreen from "../../components/EmptyScreen";
import { V1Field } from "@formstr/sdk/dist/interfaces";
import { fetchGlobalFeed } from "../../utils/nostr";
import { constructFormUrl } from "../../utils/utility";
import { IPublicForm, IV1FormSpec } from "./typeDefs";
import StyleWrapper from "./style";

const columns = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    width: 20,
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "description",
    width: 35,
    ellipsis: true,
    render: (description: string) => description ?? "-",
  },
  {
    key: "fields",
    title: "Questions",
    dataIndex: "fields",
    width: 15,
    ellipsis: true,
    render: (fields: V1Field[]) => fields.length,
  },
  {
    key: "formUrl",
    title: "Form Url",
    dataIndex: "pubkey",
    width: 30,
    ellipsis: true,
    render: (pubkey: string) => {
      let link = constructFormUrl(pubkey);
      return <a href={link}>{link}</a>;
    },
  },
];

function PublicForms() {
  const [isLoading, setIsLoading] = useState(false);
  const [forms, setForms] = useState<IV1FormSpec[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let formFeed: IPublicForm[] = (await fetchGlobalFeed()) ?? [];
      let parsedFormFeed = formFeed.map<IV1FormSpec>((form) => ({
        ...JSON.parse(form.content),
        key: form.pubkey,
        pubkey: form.pubkey,
      }));
      setForms(parsedFormFeed);
      setIsLoading(false);
    })();
  }, []);

  return (
    <StyleWrapper>
      {(!!forms.length || isLoading) && (
        <Table
          loading={{
            spinning: isLoading,
            tip: "Traveling through the world to look for forms...",
          }}
          columns={columns}
          dataSource={forms}
          pagination={false}
          scroll={{ y: "calc(100vh - 208px)" }}
        />
      )}
      {!forms.length && !isLoading && <EmptyScreen />}
    </StyleWrapper>
  );
}

export default PublicForms;
