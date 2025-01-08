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

  const fetchFormEvents = async (forms: Tag[], existingPool?: SimplePool) => {
    try {
      const dTags = forms.map((f) => f[1].split(":")[1]);
      const pubkeys = forms.map((f) => f[1].split(":")[0]);
      
      let myFormsFilter = {
        kinds: [30168],
        "#d": dTags,
        authors: pubkeys,
      };
      console.log("myFormsFilter", myFormsFilter);
      
      // Use the existing pool if provided, otherwise create new one
      const pool = existingPool || new SimplePool();
      let myForms = await pool.querySync(getDefaultRelays(), myFormsFilter);
      setFormEvents(myForms);
      
      // Only close if we created a new pool
      if (!existingPool) {
        pool.close(getDefaultRelays());
      }
    } catch (error) {
      console.error('Error fetching form events:', error);
    } finally {
      setRefreshing(false);
    }
};

const fetchMyForms = async (existingPool?: SimplePool) => {
    if (!userPub) return;
    
    setRefreshing(true);
    const pool = existingPool || new SimplePool();
    
    try {
      let existingListFilter = {
        kinds: [14083],
        authors: [userPub],
      };
      
      let myFormsList = await pool.get(getDefaultRelays(), existingListFilter);
      
      if (!myFormsList) {
        setRefreshing(false);
        return;
      }
      
      let forms = await window.nostr.nip44.decrypt(
        userPub,
        myFormsList.content
      );
      
      await fetchFormEvents(JSON.parse(forms), pool);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setRefreshing(false);
    } finally {
      if (!existingPool) {
        pool.close(getDefaultRelays());
      }
    }
};

const handleFormDeleted = async (formId: string, extractedFormPubkey: string) => {
  if (!userPub) return;
  setRefreshing(true);
  const pool = new SimplePool();
  
  try {
    const existingListFilter = {
      kinds: [14083],
      authors: [userPub],
    };
    
    const myFormsList = await pool.get(getDefaultRelays(), existingListFilter);
    
    if (!myFormsList) {
      console.error('No forms list found');
      return;
    }

    const forms = JSON.parse(await window.nostr.nip44.decrypt(
      userPub,
      myFormsList.content
    ));

    const updatedForms = forms.filter((f: Tag) => {
      const [formPubKey, extractedFormId] = f[1].split(":");
      return !(formPubKey === extractedFormPubkey && extractedFormId === formId);
    });

    const event = {
      kind: 14083,
      content: await window.nostr.nip44.encrypt(
        userPub,
        JSON.stringify(updatedForms)
      ),
      tags: [],
      created_at: Math.floor(Date.now() / 1000),
      pubkey: userPub
    };

    const signedEvent = await window.nostr.signEvent(event);
    await pool.publish(getDefaultRelays(), signedEvent);
    await fetchMyForms();

  } catch (error) {
    console.error('Error handling form deletion:', error);
  } finally {
    setRefreshing(false);
    pool.close(getDefaultRelays());
  }
};

useEffect(() => {
  if (userPub) {
    fetchMyForms();
  }
}, [userPub]);

  return (
    <>
      {refreshing ? <Spin size="large" /> : null}
      {formEvents.map((form) => {
        const formId = form.tags.find((tag: Tag) => tag[0] === "d")?.[1];
        return (
          <FormEventCard 
            event={form} 
            key={form.id}
            onDeleted={() => formId && handleFormDeleted(formId, form.pubkey)}
          />
        );
      })}
    </>
  );
};