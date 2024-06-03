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
import DashboardStyleWrapper from "./index.style";

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
    } else {
      setLoggedOut(false);
    }
    const filter = {
      kinds: [30168],
      "#p": [pubkey],
    };
    const pool = new SimplePool();
    const events = await pool.querySync(defaultRelays, filter);
    console.log("Got form events", events);
    setNostrForms(events);
  };

  const fetchUserSubmissions = async () => {
    if (!pubkey) {
      setLoggedOut(true);
      return;
    } else {
      setLoggedOut(false);
    }
    const filter = {
      kinds: [30169],
      "#p": [pubkey],
    };
    const pool = new SimplePool();
    const submissionEvents = await pool.querySync(getDefaultRelays(), filter);
    console.log("ssubmission events", submissionEvents);
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
    console.log("Submission events", events);
    setSubmission(events);
  };

  const fetchAllUserForms = () => {
    fetchNostrForms();
    fetchUserSubmissions();
  };

  useEffect(() => {
    if (!nostrForms || !submissions) fetchAllUserForms();
  }, [loggedOut]);

  const allForms = [...(nostrForms || []), ...(submissions || [])];
  console.log("loggedOut", loggedOut);

  return (
    <DashboardStyleWrapper>
      <div className="dashboard-container">
        {loggedOut && <LoggedOutScreen />}
        {!loggedOut && (
          <div className="form-cards-container">
            {allForms.map((formEvent: Event) => {
              return <FormEventCard event={formEvent} />;
            })}
          </div>
        )}
        {showFormDetails && (
          <FormDetails
            isOpen={showFormDetails}
            pubKey={state.pubKey}
            onClose={() => setShowFormDetails(false)}
          />
        )}
      </div>
    </DashboardStyleWrapper>
  );
};
