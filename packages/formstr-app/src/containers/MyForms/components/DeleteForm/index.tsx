import { IDeleteFormsLocal, IDeleteFormsTrigger } from "./types";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import {
  getItem,
  LOCAL_STORAGE_KEYS,
  setItem,
} from "../../../../utils/localStorage";
import { ILocalForm } from "../Local/typeDefs";

function DeleteConfirmationLocal({
  formId,
  onCancel,
  onDeleted,
}: IDeleteFormsLocal) {
  const onDeleteForm = () => {
    let localForms =
      getItem<ILocalForm[]>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) ?? [];
    localForms = localForms.filter((v) => v.key !== formId);
    setItem(LOCAL_STORAGE_KEYS.LOCAL_FORMS, localForms);
    onDeleted();
  };
  return (
    <Modal
      title={"Are you sure you want to delete this form from your device?"}
      open
      onOk={onDeleteForm}
      onCancel={onCancel}
    >
      <p>This action is irreversible</p>
    </Modal>
  );
}

function DeleteFormTrigger({
  formId,
  type,
}: Optional<IDeleteFormsTrigger, "onDeleted" | "onCancel">) {
  const [deleteConfirmationOpen, updateDeleteConfirmationOpen] =
    useState(false);
  const closeConfirmationModal = () => {
    updateDeleteConfirmationOpen(false);
  };
  return (
    <>
      <Button
        type={"text"}
        onClick={(e) => {
          updateDeleteConfirmationOpen(true);
        }}
      >
        <DeleteOutlined />
      </Button>
      {deleteConfirmationOpen && type === "local" && (
        <DeleteConfirmationLocal
          formId={formId}
          onDeleted={closeConfirmationModal}
          onCancel={closeConfirmationModal}
        />
      )}
    </>
  );
}

export default DeleteFormTrigger;
