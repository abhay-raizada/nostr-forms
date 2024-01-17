import React from "react";
import { Button, Dropdown, MenuProps, Row } from "antd";
import { nip19 } from "nostr-tools";
import { DownOutlined } from "@ant-design/icons";
import { V1Field } from "@formstr/sdk/dist/interfaces";

export const Export: React.FC<{
  questionMap: { [key: string]: V1Field };
  answers: Array<{ [key: string]: string }>;
  formName: string;
}> = (props) => {
  const onDownloadClick = async (type: "csv" | "excel") => {
    const XLSX = await import("xlsx");
    const SheetName = `Responses for ${props.formName}`.substring(0, 20);
    console.log("Sheet name", SheetName, SheetName.length);
    let parsedResponse = props.answers.reduce(
      (
        allResp: Array<{ [key: string]: string }>,
        answer: { [key: string]: string }
      ) => {
        let newAnswer: { [key: string]: string } = {};
        Object.keys(answer).forEach((questionId) => {
          console.log("questionId", questionId, props.questionMap[questionId]);
          newAnswer[props.questionMap[questionId]?.question || questionId] =
            answer[questionId];
        });
        allResp.push(newAnswer);
        return allResp;
      },
      []
    );

    const workSheet = XLSX.utils.json_to_sheet(parsedResponse);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `${SheetName}`);
    if (type === "excel") {
      XLSX.writeFile(workBook, `${SheetName}.xlsx`);
    } else {
      XLSX.writeFile(workBook, `${SheetName}.csv`);
    }
  };

  const items = [
    {
      label: "Export as Excel",
      key: "excel",
    },
    {
      label: "Export as CSV",
      key: "csv",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onDownloadClick(e.key as "csv" | "excel");
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleButtonClick = () => {
    onDownloadClick("excel");
  };

  return (
    <Dropdown.Button
      menu={menuProps}
      type="text"
      onClick={handleButtonClick}
      icon={<DownOutlined />}
    >
      Export as excel
    </Dropdown.Button>
  );
};
