import { Button, Card, Divider } from "antd";
import { getItem, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { Tag } from "../../../nostr/types";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteDraft } from "../../../utils/utility";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function constructDraftUrl(
  draft: { formSpec: unknown; tempId: string },
  host: string
) {
  if (!draft) {
    return;
  }
  let draftHash = window.btoa(encodeURIComponent(JSON.stringify(draft)));
  draftHash = window.encodeURIComponent(draftHash);

  return `${host}/#/drafts/${draftHash}`;
}

export const Drafts = () => {
  type Draft = { formSpec: Tag[]; tempId: string };
  const [drafts, setDrafts] = useState<Draft[]>(
    getItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS) as Draft[]
  );
  useEffect(() => {
    setDrafts(getItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS) as Draft[]);
  }, []);
  console.log("Drafts are", drafts);
  return (
    <div>
      {drafts.map((d: Draft) => {
        let name = d.formSpec.filter((t) => t[0] === "name");
        return (
          <Card
            style={{ margin: 10 }}
            extra={
              <DeleteOutlined
                onClick={() => {
                  deleteDraft(d.tempId);
                  setDrafts(getItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS) as Draft[]);
                }}
              />
            }
            title={name}
          >
            {d.formSpec.filter((f) => f[0] === "field").length} Question(s)
            <Divider />
            <Button
              onClick={() =>
                window.open(
                  constructDraftUrl(d, window.location.origin),
                  "_blank"
                )
              }
            >
              Open Draft
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
