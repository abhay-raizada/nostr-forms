import { Tag } from "@formstr/sdk/dist/formstr/nip101";
import { useState } from "react";
import { PrepareForm } from "../../FormFillerNew/PrepareForm";
import { Event } from "nostr-tools";
import { Typography } from "antd";

const { Text } = Typography;

interface PrepareResponse {
  pubKey: string;
  formId: string;
  responseCallback: (formSpec: Tag[], signingKey?: string) => void;
}

export const PrepareResponses: React.FC<PrepareResponse> = ({
  pubKey,
  formId,
  responseCallback,
}) => {
  const getSigningKey = (
    formEvent: Event,
    userPubkey: string,
    formSpec: Tag[]
  ) => {
    let key = formEvent.tags.find((tag: Tag) => {
      tag[0] === "key" && tag[1] === userPubkey;
    });
    if (!key || !key[3]) {
      responseCallback(formSpec);
      return;
    }
    responseCallback(formSpec, key[3]);
  };

  return (
    <PrepareForm
      pubKey={pubKey}
      formId={formId}
      formSpecCallback={(
        formSpec: Tag[],
        formEvent?: Event,
        userPubkey?: string
      ) => {
        if (!formEvent || !userPubkey) {
          responseCallback(formSpec);
          return;
        }
        getSigningKey(formEvent, userPubkey, formSpec);
      }}
      forcePubkey={true}
    />
  );
};
