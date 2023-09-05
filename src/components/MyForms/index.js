import { Table } from "antd";
import { useEffect, useState } from "react";

const MyForms = () => {
  const [tableForms, setTableForms] = useState("");

  useEffect(() => {
    let forms = localStorage.getItem("formstr:forms");
    if (forms) {
      forms = JSON.parse(forms);
    }
    forms = forms || [];
    let tableForms = forms.map((form, index) => {
      return {
        key: index,
        name: form.name,
        url: form.publicKey,
        privateKey: form.privateKey,
      };
    });
    console.log("Table Forms", tableForms);
    setTableForms(tableForms);
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Form Url",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Private Key",
      dataIndex: "privateKey",
      key: "privateKey",
    },
  ];

  return (
    <div>
      <Table dataSource={tableForms} columns={columns} />;
    </div>
  );
};

export default MyForms;
