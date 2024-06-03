import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { LOCAL_STORAGE_KEYS, getItem, setItem } from "../utils/localStorage";
import { Actions, NIP07Interactions } from "../components/NIP07Interactions";
import { Event } from "nostr-tools";

interface ProfileProviderProps {
  children?: ReactNode;
}

export interface ProfileContextType {
  pubkey?: string;
  requestPubkey: () => void;
}

export interface IProfile {
  pubkey: string;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [pubkey, setPubkey] = useState<string | undefined>(undefined);
  const [usingNip07, setUsingNip07] = useState(false);

  useEffect(() => {
    if (!pubkey) {
      let profile = getItem<IProfile>(LOCAL_STORAGE_KEYS.PROFILE);
      if (profile) {
        console.log("Found npub", profile.pubkey);
        setPubkey(profile.pubkey);
      } else {
        console.log("couldnt find npub");
      }
    }
  }, [pubkey]);

  const requestPubkey = () => {
    setUsingNip07(true);
  };

  return (
    <ProfileContext.Provider value={{ pubkey, requestPubkey }}>
      {children}
      {usingNip07 ? (
        <NIP07Interactions
          action={Actions.GET_PUBKEY}
          ModalMessage={"Get pubkey"}
          callback={(pubkey: string | Event) => {
            setPubkey(pubkey as string);
            setUsingNip07(false);
            setItem(LOCAL_STORAGE_KEYS.PROFILE, { pubkey: pubkey });
          }}
        />
      ) : null}
    </ProfileContext.Provider>
  );
};
