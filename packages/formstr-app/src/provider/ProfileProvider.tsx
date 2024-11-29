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
    const profile = getItem<IProfile>(LOCAL_STORAGE_KEYS.PROFILE);
    if (profile) {
      setPubkey(profile.pubkey);
    } else {
      console.log("Couldn't find npub");
    }
  }, []);

  const logout = () => {
    setItem(LOCAL_STORAGE_KEYS.PROFILE, null);
    setPubkey(undefined);
  };

  const requestPubkey = async () => {
    setUsingNip07(true);
    let publicKey = await window.nostr.getPublicKey();
    setPubkey(publicKey);
    setItem(LOCAL_STORAGE_KEYS.PROFILE, { pubkey: publicKey });
    setUsingNip07(false);
    return pubkey;
  };

  return (
    <ProfileContext.Provider value={{ pubkey, requestPubkey, logout }}>
      {children}
      <Modal
        open={usingNip07}
        footer={null}
        onCancel={() => setUsingNip07(false)}
      >
        {" "}
        Check your NIP07 Extension{" "}
      </Modal>
    </ProfileContext.Provider>
  );
};
