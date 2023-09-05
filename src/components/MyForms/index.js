import { Button, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { constructFormUrl } from "../../utils/utility";

const MyForms = () => {
  const [tableForms, setTableForms] = useState("");
  const { Text } = Typography;

  useEffect(() => {
    let forms = localStorage.getItem("formstr:forms");
    if (forms) {
      forms = JSON.parse(forms);
    }
    forms = forms || [];
    let tableForms = forms.map((form, index) => {
      let formUrl = constructFormUrl(form.publicKey);
      return {
        key: index,
        name: form.name,
        url: <a href={formUrl}> {formUrl}</a>,
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
      {tableForms.length !== 0 && (
        <Table dataSource={tableForms} columns={columns} />
      )}
      {tableForms.length === 0 && (
        <div>
          {" "}
          <Text>
            Hi there! You don't have any forms yet, click{" "}
            <Button href={<Link to="forms/new" />}>Here</Button> to create one!
          </Text>
        </div>
      )}
    </div>
  );
};

export default MyForms;
