import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { LOCAL_STORAGE_KEYS, getItem } from "../utils/localStorage";
import { Actions, NIP07Interactions } from "../components/NIP07Interactions";

interface ProfileProviderProps {
  children?: ReactNode;
}

export interface ProfileContextType {
  pubkey?: string;
  requestPubkey: () => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [pubkey, setPubkey] = useState<string | undefined>(undefined);
  const [usingNip07, setUsingNip07] = useState(false);

  useEffect(() => {
    let npub = getItem<ProfileContextType>(LOCAL_STORAGE_KEYS.PROFILE);
    if (npub) {
      setPubkey(pubkey);
    }
  }, []);

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
          callback={(pubkey: string) => {
            setPubkey(pubkey);
            setUsingNip07(false);
          }}
        />
      ) : null}
    </ProfileContext.Provider>
  );
};
