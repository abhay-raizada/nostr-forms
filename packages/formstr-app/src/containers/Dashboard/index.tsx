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
import { getItem, LOCAL_STORAGE_KEYS } from "../../utils/localStorage";
import { ILocalForm } from "../CreateFormNew/providers/FormBuilder/typeDefs";
import { LocalFormCard } from "./LocalFormCard";
import { Dropdown, Menu, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";

const defaultRelays = getDefaultRelays();

export const Dashboard = () => {
  // const { state } = useLocation();
  const { pubkey, requestPubkey } = useProfileContext();

  // const { state } = useLocation();
  const state = {
    pubKey: "123",
    viewKey: "123",
    secretKey: "123",
    formId: "123",
  };
  const [showFormDetails, setShowFormDetails] = useState<boolean>(!!state);
  const [localForms, setLocalForms] = useState<ILocalForm[]>(
    getItem(LOCAL_STORAGE_KEYS.LOCAL_FORMS) || []
  );
  const [nostrForms, setNostrForms] = useState<Event[] | undefined>(undefined);
  const [filter, setFilter] = useState<"local" | "nostr">(
    pubkey ? "nostr" : "local"
  );

  const { poolRef } = useApplicationContext();

  const subCloserRef = useRef<SubCloser | null>(null);

  const handleEvent = (event: Event) => {
    setNostrForms((prevEvents) => {
      return [...(prevEvents || []), event];
    });
  };

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

  const renderForms = () => {
    console.log("Filter is ", filter);
    if (filter === "local") {
      return localForms.map((localForm: ILocalForm) => (
        <LocalFormCard key={localForm.key} form={localForm} />
      ));
    } else if (filter === "nostr") {
      return (nostrForms || []).map((formEvent: Event) => {
        let d_tag = formEvent.tags.filter((t) => t[0] === "d")[0]?.[1];
        let key = `${formEvent.kind}:${formEvent.pubkey}:${
          d_tag ? d_tag : null
        }`;
        return <FormEventCard key={key} event={formEvent} />;
      });
    }
    return null;
  };

  const menu = (
    <Menu>
      <Menu.Item key="local" onClick={() => setFilter("local")}>
        Forms on this device
      </Menu.Item>
      <Menu.Item
        key="nostr"
        onClick={() => setFilter("nostr")}
        disabled={!pubkey}
      >
        Forms on your Nostr profile
      </Menu.Item>
    </Menu>
  );

  return (
    <DashboardStyleWrapper>
      <div className="dashboard-container">
        <div style={{ margin: 10 }}>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
            <div
              style={{
                color: "grey",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {filter === "local" ? (
                <Typography.Text> Forms on this device </Typography.Text>
              ) : (
                <Typography.Text>
                  Forms linked to your Nostr profile
                </Typography.Text>
              )}
              <DownOutlined
                style={{ marginLeft: "8px", fontSize: "12px", marginTop: -5 }}
              />
            </div>
          </Dropdown>
        </div>
        {!pubkey && localForms.length !== 0 ? (
          <div className="form-cards-container">{renderForms()}</div>
        ) : null}

        {!pubkey && localForms.length === 0 && (
          <LoggedOutScreen requestLogin={requestPubkey} />
        )}

        {pubkey && (
          <>
            <div className="form-cards-container">{renderForms()}</div>
            {!nostrForms?.length && !localForms.length ? <EmptyScreen /> : null}
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
          </>
        )}
      </div>
    </DashboardStyleWrapper>
  );
};
