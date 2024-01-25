import { useState, useEffect } from "react";
import { Table } from "antd";
import EmptyScreen from "../../components/EmptyScreen";
import ResponsiveLink from "../../components/ResponsiveLink";
import {
  IFormSettings,
  V1Field,
  V1FormSpec,
} from "@formstr/sdk/dist/interfaces";
import { fetchPublicForms } from "@formstr/sdk";
import { constructFormUrl, isMobile } from "../../utils/utility";
import { IV1FormSpec } from "./typeDefs";
import StyleWrapper from "./style";

const COLUMNS = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    width: isMobile() ? 25 : 20,
    ellipsis: true,
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "settings",
    width: 35,
    ellipsis: true,
    render: (settings: IFormSettings) => {
      return settings?.description || "-";
    },
    isDisabled: isMobile,
  },
  {
    key: "fields",
    title: "Questions",
    dataIndex: "fields",
    width: isMobile() ? 20 : 15,
    ellipsis: true,
    render: (fields: V1Field[]) => fields.length,
  },
  {
    key: "formUrl",
    title: "Form Url",
    dataIndex: "pubkey",
    width: isMobile() ? 20 : 30,
    ellipsis: true,
    render: (pubkey: string) => {
      let link = constructFormUrl(pubkey);
      return <ResponsiveLink link={link} />;
    },
  },
];

function PublicForms() {
  const [isLoading, setIsLoading] = useState(false);
  const [forms, setForms] = useState<IV1FormSpec[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let formFeed: { content: V1FormSpec; pubkey: string }[] =
        await fetchPublicForms();
      let parsedFormFeed = formFeed.map<IV1FormSpec>((form) => ({
        ...form.content,
        key: form.pubkey,
        pubkey: form.pubkey,
      }));
      setForms(parsedFormFeed);
      setIsLoading(false);
    })();
  }, []);

  let columns = COLUMNS.filter(({ isDisabled }) => {
    if (isDisabled && isDisabled()) {
      return false;
    }
    return true;
  });

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
