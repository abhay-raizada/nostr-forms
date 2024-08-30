import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FormDetails } from "../CreateFormNew/components/FormDetails";
import { Event, Relay, SimplePool, SubCloser } from "nostr-tools";
import useNostrProfile, {
  useProfileContext,
} from "../../hooks/useProfileContext";
import { getDefaultRelays } from "@formstr/sdk";
import { LoggedOutScreen } from "./LoggedOutScreen";
import { FormEventCard } from "./FormEventCard";
import DashboardStyleWrapper from "./index.style";
import EmptyScreen from "../../components/EmptyScreen";
import { useApplicationContext } from "../../hooks/useApplicationContext";

const defaultRelays = getDefaultRelays();

export const Dashboard = () => {
  const { state } = useLocation();
  const [showFormDetails, setShowFormDetails] = useState<boolean>(!!state);
  const [nostrForms, setNostrForms] = useState<Event[] | undefined>(undefined);
  const { poolRef } = useApplicationContext();

  const subCloserRef = useRef<SubCloser | null>(null);

  const handleEvent = (event: Event) => {
    setNostrForms((prevEvents) => {
      return [...(prevEvents || []), event];
    });
  };

  const { pubkey, requestPubkey } = useProfileContext();

  const fetchNostrForms = () => {
    console.log("Inside fetchNostrForms");

    const filter = {
      kinds: [30168],
      "#p": [pubkey!],
    };

    // Subscribe to events on all relays
    subCloserRef.current = poolRef.current.subscribeMany(
      defaultRelays,
      [filter],
      {
        onevent: handleEvent,
        onclose() {
          subCloserRef.current?.close();
        },
      }
    );
  };

  useEffect(() => {
    if (pubkey && !nostrForms) {
      fetchNostrForms();
    }
    return () => {
      if (subCloserRef.current) {
        subCloserRef.current.close();
      }
    };
  }, [pubkey]);
  const allForms = [...(nostrForms || [])];

  return (
    <DashboardStyleWrapper>
      <div className="dashboard-container">
        {!pubkey && <LoggedOutScreen requestLogin={requestPubkey} />}
        {pubkey && (
          <div className="form-cards-container">
            {allForms.map((formEvent: Event) => {
              return <FormEventCard event={formEvent} />;
            })}
          </div>
        )}
        {pubkey && allForms.length === 0 ? <EmptyScreen /> : null}
        {showFormDetails && (
          <FormDetails
            isOpen={showFormDetails}
            pubKey={state.pubKey}
            secretKey={state.secretKey}
            viewKey={state.viewKey}
            formId={state.formId}
            onClose={() => setShowFormDetails(false)}
          />
        )}
      </div>
    </DashboardStyleWrapper>
  );
};
