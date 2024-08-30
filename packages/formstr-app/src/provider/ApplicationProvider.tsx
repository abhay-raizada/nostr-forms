import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { LOCAL_STORAGE_KEYS, getItem, setItem } from "../utils/localStorage";
import { Modal } from "antd";
import { SimplePool } from "nostr-tools";

interface ApplicationProviderProps {
  children?: ReactNode;
}

export interface ApplicationContextType {
  poolRef: React.MutableRefObject<SimplePool>;
}

export const ApplicationContext = createContext<
  ApplicationContextType | undefined
>(undefined);

export const ProfileProvider: FC<ApplicationProviderProps> = ({ children }) => {
  const poolRef = useRef(new SimplePool());

  return (
    <ApplicationContext.Provider value={{ poolRef }}>
      {children}
    </ApplicationContext.Provider>
  );
};
