import { useState, useEffect } from "react";
import { Modal } from "antd";

export function ShowPastResponses({ showPastResponses, UserNpub, onCancel }) {
  const [pubkey, setPubkey] = useState("");

  useEffect(() => {
    if (pubkey?.length === 0) {
      setPubkey(UserNpub);
    }
  }, [UserNpub, pubkey]);
  return <Modal open={showPastResponses} onCancel={onCancel}></Modal>;
}
