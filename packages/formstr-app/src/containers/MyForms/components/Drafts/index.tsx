import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import EmptyScreen from "../../../../components/EmptyScreen";
import { ROUTES } from "../../../../constants/routes";
import {
  LOCAL_STORAGE_KEYS,
  getItem,
  setItem,
} from "../../../../utils/localStorage";
import { constructDraftUrl, copyToClipBoard } from "../../../../utils/utility";
import { IDraft } from "./typeDefs";
import StyleWrapper from "./style";

const columns = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    width: 25,
    render: (_: any, draft: IDraft) => draft.formSpec.name,
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "description",
    width: 25,
    ellipsis: true,
    render: (description: string) => description ?? "-",
  },
  {
    key: "edit",
    title: "Edit",
    dataIndex: "edit",
    width: 15,
    ellipsis: true,
    render: (_: any, draft: IDraft) => (
      <Link to={ROUTES.CREATE_FORMS} relative="path" className="edit-icon">
        <EditOutlined className="action-icon" />
      </Link>
    ),
  },
  {
    key: "share",
    title: "Share",
    dataIndex: "share",
    width: 25,
    ellipsis: true,
    render: (_: any, draft: IDraft) => {
      let link = constructDraftUrl(draft);
      if (!link) return "-";
      return (
        <LinkOutlined
          className="action-icon"
          onClick={() => copyToClipBoard(link!)}
        />
      );
    },
  },
  {
    key: "delete",
    title: "Delete",
    dataIndex: "tempId",
    width: 15,
    ellipsis: true,
    render: (tempId: string, { onDelete }: IDraft) => {
      return (
        <DeleteOutlined
          className="action-icon"
          onClick={() => onDelete(tempId)}
        />
      );
    },
  },
];

function Drafts() {
  const [drafts, setDrafts] = useState<IDraft[]>([]);

  const onDelete = useCallback((tempId: string) => {
    let draftForms = getItem<IDraft[]>(LOCAL_STORAGE_KEYS.DRAFT_FORMS) ?? [];
    draftForms = draftForms.filter((draft) => draft.tempId !== tempId);
    setItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS, draftForms);
    draftForms = draftForms.map((draft) => ({
      ...draft,
      key: draft.tempId,
      onDelete,
    }));
    setDrafts(draftForms);
  }, []);

  useEffect(() => {
    let draftForms = getItem<IDraft[]>(LOCAL_STORAGE_KEYS.DRAFT_FORMS) ?? [];
    draftForms = draftForms.map((draft) => ({
      ...draft,
      key: draft.tempId,
      onDelete,
    }));
    setDrafts(draftForms);
  }, [onDelete]);

  return (
    <StyleWrapper>
      {!!drafts.length && (
        <Table
          columns={columns}
          dataSource={drafts}
          pagination={false}
          scroll={{ y: "calc(100vh - 208px)" }}
        />
      )}
      {!drafts.length && <EmptyScreen />}
    </StyleWrapper>
  );
}

export default Drafts;
