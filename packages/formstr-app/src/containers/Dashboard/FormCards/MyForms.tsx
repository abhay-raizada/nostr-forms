import { useEffect, useState } from "react";
import { useProfileContext } from "../../../hooks/useProfileContext";
import { Event, SimplePool } from "nostr-tools";
import { getDefaultRelays } from "../../../nostr/common";
import { Tag } from "../../../nostr/types";
import { FormEventCard } from "./FormEventCard";
import { Spin } from "antd";

export const MyForms = () => {
  const { pubkey: userPub } = useProfileContext();
  const [refreshing, setRefreshing] = useState(false);
  const [formEvents, setFormEvents] = useState<Event[]>([]);

  const fetchFormEvents = async (forms: Tag[]) => {
    const dTags = forms.map((f) => f[1].split(":")[1]);
    const pubkeys = forms.map((f) => f[1].split(":")[0]);
    console.log("Dtags", dTags, "pubkeys", pubkeys);
    let myFormsFilter = {
      kinds: [30168],
      "#d": dTags,
      authors: pubkeys,
    };
    console.log("my forms filter", myFormsFilter);
    let pool = new SimplePool();
    let myForms = await pool.querySync(getDefaultRelays(), myFormsFilter);
    console.log("Final my forms", myForms);
    setFormEvents(myForms);
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchMyForms = async () => {
      if (!userPub) return;
      setRefreshing(true);
      let existingListFilter = {
        kinds: [14083],
        authors: [userPub],
      };
      let pool = new SimplePool();
      let myFormsList = await pool.get(getDefaultRelays(), existingListFilter);
      pool.close(getDefaultRelays());
      if (!myFormsList) {
        return;
      }
      let forms = await window.nostr.nip44.decrypt(
        userPub,
        myFormsList.content
      );
      console.log("myFormList", forms);
      fetchFormEvents(JSON.parse(forms));
    };
    if (userPub) fetchMyForms();
  }, [userPub]);
  return (
    <>
      {refreshing ? <Spin size="large" /> : null}
      {formEvents.map((form) => {
        return <FormEventCard event={form} key={form.id} />;
      })}
    </>
  );
};
