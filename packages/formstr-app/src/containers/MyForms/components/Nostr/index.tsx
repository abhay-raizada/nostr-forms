import { useState, useEffect } from "react";
import { Table } from "antd";
import { getPastUserForms } from "@formstr/sdk";
import EmptyScreen from "../../../../components/EmptyScreen";
import {
  constructFormUrl,
  constructResponseUrl,
} from "../../../../utils/utility";
import { IForm } from "./typeDefs";

const columns = [
  {
    key: "number",
    title: "Number",
    dataIndex: "key",
    width: 25,
  },
  {
    key: "formUrl",
    title: "Form Url",
    dataIndex: "formUrl",
    width: 30,
    ellipsis: true,
    render: (formUrl: string) => {
      return <a href={formUrl}>{formUrl}</a>;
    },
  },
  {
    key: "responseUrl",
    title: "Response Url",
    dataIndex: "responseUrl",
    width: 30,
    ellipsis: true,
    render: (responseUrl: string) => {
      return <a href={responseUrl}>{responseUrl}</a>;
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
        key: idx+1,
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
          columns={columns}
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
