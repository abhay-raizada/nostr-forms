import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Modal } from "antd";
import { DeleteFilled, EditFilled, ShareAltOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { constructDraftUrl } from "../../utils/utility";

interface DraftProps {
  drafts: Array<Draft>;
}

interface ShareDraft {
  formSpec: unknown;
  tempId: string;
}

interface Draft {
  formSpec: { name: string; description: string };
  tempId: string;
}

const { Text } = Typography;
export const Draft = (props: DraftProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareDraft, setShareDraft] = useState<ShareDraft | null>(null);
  const [formDrafts, setFormDrafts] = useState<Array<Draft>>([]);

  function handleDraftDelete(index: number) {
    let drafts = [...formDrafts];
    drafts = drafts.filter((_, ind) => ind !== index);
    localStorage.setItem("formstr:drafts", JSON.stringify(drafts));
    setFormDrafts(drafts);
  }

  useEffect(() => {
    setFormDrafts(props.drafts);
  }, [props]);
  return (
    <>
      {(formDrafts || []).map((draft: Draft, index: number) => {
        return (
          <>
            <Card
              title={draft.formSpec.name}
              type="inner"
              key={draft.tempId}
              extra={
                <div style={{ display: "flex" }}>
                  <div
                    title="share"
                    style={{ marginLeft: "10px", marginBottom: "15px" }}
                  >
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={() => {
                        setIsShareModalOpen(true);
                        setShareDraft(draft);
                      }}
                      size="small"
                    />
                  </div>
                  <div title="edit" style={{ marginLeft: "10px" }}>
                    <Link
                      to="/forms/new"
                      state={{
                        formSpec: draft.formSpec,
                        tempId: draft.tempId,
                      }}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <EditFilled />
                    </Link>
                  </div>
                  <div title="delete" style={{ marginLeft: "10px" }}>
                    <DeleteFilled onClick={() => handleDraftDelete(index)} />
                  </div>
                </div>
              }
            >
              {draft.formSpec.description || "No description"}
            </Card>
          </>
        );
      })}
      {(!formDrafts || formDrafts.length === 0) && (
        <div>
          {" "}
          <Text>
            Hi there! You don't have any drafts yet, click{" "}
            <Link to="/forms/new">
              {" "}
              <Button>Here</Button>{" "}
            </Link>{" "}
            to create one!
          </Text>
        </div>
      )}
      <Modal
        title="Share Draft"
        open={isShareModalOpen}
        onCancel={() => {
          setIsShareModalOpen(false);
        }}
        onOk={() => {
          setIsShareModalOpen(false);
        }}
      >
        <a href={constructDraftUrl(shareDraft)}>
          {constructDraftUrl(shareDraft)}
        </a>
      </Modal>
    </>
  );
};
