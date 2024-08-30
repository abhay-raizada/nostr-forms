import React, { createContext, FC, ReactNode, useRef } from "react";
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

export const ApplicationProvider: FC<ApplicationProviderProps> = ({
  children,
}) => {
  const poolRef = useRef(new SimplePool());

  return (
    <ApplicationContext.Provider value={{ poolRef }}>
      {children}
    </ApplicationContext.Provider>
  );
};
