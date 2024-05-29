import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FormDetails } from "../CreateFormNew/components/FormDetails";
import { Event, SimplePool } from "nostr-tools";
import useNostrProfile, {
  useProfileContext,
} from "../../hooks/useProfileContext";
import { getDefaultRelays } from "@formstr/sdk";
import { LoggedOutScreen } from "./LoggedOutScreen";
import { FormEventCard } from "./FormEventCard";

const defaultRelays = getDefaultRelays();

export const Dashboard = () => {
  const { state } = useLocation();
  const [showFormDetails, setShowFormDetails] = useState<boolean>(!!state);
  const [loggedOut, setLoggedOut] = useState<boolean>(false);
  const [nostrForms, setNostrForms] = useState<Event[] | undefined>(undefined);
  const [submissions, setSubmission] = useState<Event[] | undefined>(undefined);

  const { pubkey, requestPubkey } = useProfileContext();

  const fetchNostrForms = async () => {
    if (!pubkey) {
      setLoggedOut(true);
      return;
    }
    const filter = {
      kinds: [30168],
      "#p": [pubkey],
    };
    const pool = new SimplePool();
    const events = await pool.querySync(defaultRelays, filter);
    setNostrForms(events);
  };

  const fetchUserSubmissions = async () => {
    if (!pubkey) {
      setLoggedOut(true);
      return;
    }
    const filter = {
      kinds: [30169],
      "#p": [pubkey],
    };
    const pool = new SimplePool();
    const submissionEvents = await pool.querySync(getDefaultRelays(), filter);
    let events: Event[] = [];
    submissionEvents.map((event) => {
      const referenceTag = event.tags.find((tag) => tag[0] == "a") || [];
      const [_, pubKey, d_tag] = referenceTag[1].split(":");
      pool
        .get(defaultRelays, {
          kinds: [30168],
          "#d": [d_tag],
          authors: [pubKey],
        })
        .then((event: Event | null) => {
          if (event) {
            events.push(event);
          }
        });
    });

    setSubmission(events);
  };

  const fetchAllUserForms = () => {
    fetchNostrForms();
    fetchUserSubmissions();
  };

  useEffect(() => {
    fetchAllUserForms();
  }, [loggedOut]);

  const allForms = [...(nostrForms || []), ...(submissions || [])];
  console.log("loggedOut", loggedOut);

  return (
    <>
      {loggedOut && <LoggedOutScreen />}
      {!loggedOut &&
        allForms.map((formEvent: Event) => {
          return <FormEventCard event={formEvent} />;
        })}
      {showFormDetails && (
        <FormDetails
          isOpen={showFormDetails}
          pubKey={state.pubKey}
          onClose={() => setShowFormDetails(false)}
        />
      )}
    </>
  );
};
