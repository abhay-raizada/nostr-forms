import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { LOCAL_STORAGE_KEYS, getItem, setItem } from "../utils/localStorage";
import { Modal } from "antd";

interface ProfileProviderProps {
  children?: ReactNode;
}

export interface ProfileContextType {
  pubkey?: string;
  requestPubkey: () => void;
  logout: () => void;
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

  const logout = () => {
    setItem(LOCAL_STORAGE_KEYS.PROFILE, null);
    setPubkey(undefined);
  }

  const requestPubkey = async () => {
    setUsingNip07(true);
    console.log("Fetching pubkeyyyyyyy");
    let publicKey = await window.nostr.getPublicKey();
    console.log("Got pubkey asdfasfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsdfsdfasdf", publicKey);
    setPubkey(publicKey);
    setItem(LOCAL_STORAGE_KEYS.PROFILE, { profile: publicKey }) 
    setUsingNip07(false)
    return pubkey
  };

  return (
    <ProfileContext.Provider value={{ pubkey, requestPubkey, logout }}>
      {children}
      <Modal open={usingNip07}> Check your NIP07 Extension </Modal>
    </ProfileContext.Provider>
  );
};
