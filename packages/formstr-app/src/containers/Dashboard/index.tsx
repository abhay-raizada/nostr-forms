import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FormDetails } from "../CreateFormNew/components/FormDetails";
import { Event, Filter, SimplePool } from "nostr-tools";
import {
  useProfileContext,
} from "../../hooks/useProfileContext";
import { fetchProfiles, getDefaultRelays } from "@formstr/sdk";
import { FormEventCard } from "./FormEventCard";
import DashboardStyleWrapper from "./index.style";
import { Button, Typography } from "antd"
import EmptyScreen from "../../components/EmptyScreen";

const { Text } = Typography

const defaultRelays = getDefaultRelays();

export const Dashboard = () => {
  const { state } = useLocation();
  const [showFormDetails, setShowFormDetails] = useState<boolean>(!!state);
  const [nostrForms, setNostrForms] = useState<Event[] | undefined>(undefined);
  const [submissions, setSubmission] = useState<Event[] | undefined>(undefined);
  const [filteredForms, setFilteredForms] = useState<Event[]>([])

  const { pubkey, requestPubkey } = useProfileContext();

  const fetchParticipantForms = async (pubKey: string) => {
    const pool = new SimplePool();
    const filter = {
      kinds: [30168],
      "#p": [pubKey],
    };
    let events = await pool.querySync(defaultRelays, filter);
    pool.close(defaultRelays);
    return events
  }

  const fetchNostrForms = async () => {
    if (!pubkey) return;
    let participantEvents = await fetchParticipantForms(pubkey);
    console.log("Got form events", participantEvents);
    setNostrForms(participantEvents);
    return participantEvents
  };

  const fetchUserSubmissions = async () => {
    if(!pubkey) return;
    const filter = {
      kinds: [1069],
      "#p": [pubkey],
    };
    let pool = new SimplePool()
    const submissionEvents = await pool.querySync(defaultRelays, filter);
    let events: Event[] = [];
    submissionEvents.map((event) => {
      const referenceTag = event.tags.find((tag) => tag[0] == "a") || [];
      const [_, pubKey, d_tag] = referenceTag[1].split(":");
      const pool = new SimplePool();
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
          pool.close(defaultRelays);
        });
    });
    pool.close(defaultRelays)
    console.log("Submission events", events);
    setSubmission(events);
    return events
  };

  const fetchAllUserForms = async () => {
    let nostrForms = await fetchNostrForms();
    let userSubmissions = await fetchUserSubmissions();
    const allForms = [...(nostrForms || []), ...(userSubmissions || [])];
    setFilteredForms(allForms);
  };

  useEffect(() => {
    if (!nostrForms || !submissions) fetchAllUserForms();
  }, [pubkey]);

  return (
    <DashboardStyleWrapper>
      <div className="dashboard-container">
        {!pubkey ? <><EmptyScreen message="You are logged out" linkLabel="Login" onPress={requestPubkey}/> </> : null}
        {pubkey ? ( filteredForms.length === 0 ? <EmptyScreen message="Please wait while we fetch your forms..."/>:
          (<div className="form-cards-container">
            {filteredForms.map((formEvent: Event) => {
              return <FormEventCard event={formEvent} key={formEvent.id}/>;
            })}
          </div>)
        ) : null}
        {showFormDetails ? (
          <FormDetails
            isOpen={showFormDetails}
            pubKey={state.pubKey}
            secretKey={state.secretKey}
            formId={state.formId}
            onClose={() => setShowFormDetails(false)}
          />
        ) : null}
      </div>
    </DashboardStyleWrapper>
  );
};
