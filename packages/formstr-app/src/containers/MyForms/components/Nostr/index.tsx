import { useState, useEffect } from "react";
import { Table } from "antd";
import { getPastUserForms } from "@formstr/sdk";
import EmptyScreen from "../../../../components/EmptyScreen";
import ResponsiveLink from "../../../../components/ResponsiveLink";
import {
  constructFormUrl,
  constructResponseUrl,
} from "../../../../utils/utility";
import { IForm } from "./typeDefs";

const COLUMNS = [
  {
    key: "number",
    title: "Number",
    dataIndex: "name",
    width: 25,
    ellipsis: true,
  },
  {
    key: "formUrl",
    title: "Form Url",
    dataIndex: "formUrl",
    width: 30,
    ellipsis: true,
    render: (formUrl: string) => {
      return <ResponsiveLink link={formUrl} />;
    },
  },
  {
    key: "responseUrl",
    title: "Response Url",
    dataIndex: "responseUrl",
    width: 30,
    ellipsis: true,
    render: (responseUrl: string) => {
      return <ResponsiveLink link={responseUrl} />;
    },
  },
];

function Nostr() {
  const [isLoading, setIsLoading] = useState(false);
  const [forms, setForms] = useState<IForm[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let pubKey = await window.nostr.getPublicKey();
      let forms = (await getPastUserForms(pubKey)) as string[][];
      let parsedForms = forms.map((form, idx) => ({
        key: idx + 1,
        name: form[1][0].slice(0, 6),
        formUrl: constructFormUrl(form[1][0]),
        responseUrl: constructResponseUrl(form[1][1]),
      }));
      setForms(parsedForms);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div>
      {(!!forms.length || isLoading) && (
        <Table
          loading={{
            spinning: isLoading,
            tip: "Traveling through the world to look for forms...",
          }}
          columns={COLUMNS}
          dataSource={forms}
          pagination={false}
          scroll={{ y: "calc(100vh - 208px)" }}
        />
      )}
      {!forms.length && !isLoading && <EmptyScreen />}
    </div>
  );
}

export default Nostr;
