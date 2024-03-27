import { useState } from "react";
import { Button, Table } from "antd";
import { getDecoratedPastForms } from "@formstr/sdk";
import ResponsiveLink from "../../../../components/ResponsiveLink";
import { constructFormUrl, constructResponseUrl } from "@formstr/sdk";
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
  const [forms, setForms] = useState<IForm[] | null>(null);
  const loadNostrForms = async () => {
    setIsLoading(true);
    const forms = await getDecoratedPastForms();
    const parsedForms = forms.map((form, idx) => ({
      key: idx + 1,
      name: form.formName,
      formUrl: constructFormUrl(form.formId, form.formPassword),
      responseUrl: constructResponseUrl(
        form.formSecret,
        window.location.origin,
        form.formId,
        form.formPassword,
      ),
      formPassword: form.formPassword,
    }));
    setForms(parsedForms);
    setIsLoading(false);
  };

  return (
    <div>
      {forms === null && !isLoading ? (
        <SyncButtonStyle>
          <Button type="primary" onClick={loadNostrForms}>
            Fetch forms from nostr
          </Button>
        </SyncButtonStyle>
      ) : null}
      {forms !== null || isLoading ? (
        <Table
          loading={{
            spinning: isLoading,
            tip: "Please accept the nip-07 request to fetch your forms from Nostr",
          }}
          columns={COLUMNS}
          dataSource={forms || []}
          pagination={false}
          scroll={{ y: "calc(100vh - 208px)" }}
        />
      ) : null}
    </div>
  );
}

export default Nostr;
