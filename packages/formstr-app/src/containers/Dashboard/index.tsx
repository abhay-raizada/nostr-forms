import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FormDetails } from "../CreateFormNew/components/FormDetails";
import { Event, SimplePool, SubCloser } from "nostr-tools";
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
  const [nostrForms, setNostrForms] = useState<Event[] | undefined>(undefined);

  const handleEvent = (event: Event) => {
    setNostrForms((prevEvents) => {
      return [...(prevEvents || []), event]
    })
  }

  const { pubkey, requestPubkey } = useProfileContext();

  const fetchNostrForms = () => {
    const filter = {
      kinds: [30168],
      "#p": [pubkey!],
    };
    const pool = new SimplePool();
    const subCloser = pool.subscribeMany(defaultRelays, [filter], { onevent: handleEvent });
    return subCloser
  };

  useEffect(() => {
    let subCloser: SubCloser | undefined;
    if (!nostrForms && pubkey) subCloser = fetchNostrForms();
    return () => {
      if (subCloser) {
        subCloser.close()
      }
    }
  }, [pubkey]);
  const allForms = [...(nostrForms || [])];

  return (
    <DashboardStyleWrapper>
      <div className="dashboard-container">
        {!pubkey && <LoggedOutScreen requestLogin={requestPubkey}/>}
        {pubkey && (
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
            secretKey={state.secretKey}
            formId={state.formId}
            onClose={() => setShowFormDetails(false)}
          />
        )}
      </div>
    </DashboardStyleWrapper>
  );
};
