import { useState } from "react";
import { Button, Table } from "antd";
import { getDecoratedPastForms } from "@formstr/sdk";
import ResponsiveLink from "../../../../components/ResponsiveLink";
import {
  constructFormUrl,
  constructResponseUrl,
} from "../../../../utils/utility";
import { IForm } from "./typeDefs";
import SyncButtonStyle from "./syncButton.style";

const COLUMNS = [
  {
    key: "name",
    title: "Name",
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
  const loadNostrForms = async () => {
    setIsLoading(true);
    let forms = await getDecoratedPastForms();
    let parsedForms = forms.map((form, idx) => ({
      key: idx + 1,
      name: form.formName,
      formUrl: constructFormUrl(form.formId),
      responseUrl: constructResponseUrl(form.formName),
    }));
    setForms(parsedForms);
    setIsLoading(false);
  };

  return (
    <div>
      {!!!forms.length ? (
        <SyncButtonStyle>
          <Button type="primary" onClick={loadNostrForms}>
            Fetch forms from nostr
          </Button>
        </SyncButtonStyle>
      ) : null}
      {(!!forms.length || isLoading) && (
        <Table
          loading={{
            spinning: isLoading,
            tip: "Please accept the nip-07 request to fetch your forms from Nostr",
          }}
          columns={COLUMNS}
          dataSource={forms}
          pagination={false}
          scroll={{ y: "calc(100vh - 208px)" }}
        />
      )}
    </div>
  );
}

export default Nostr;
