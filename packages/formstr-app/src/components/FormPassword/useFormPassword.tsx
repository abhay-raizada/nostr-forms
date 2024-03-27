import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const getPasswordFromUrl = (searchParams: URLSearchParams) => {
  return searchParams.get("pwd")?.replace(/\/$/, "") || null;
};

export const useFormPassword = () => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const passwordFromUrl = getPasswordFromUrl(searchParams);
  const [password, setPassword] = useState(passwordFromUrl);
  const syncPasswordWithUrl = () => {
    if (password && password !== passwordFromUrl) {
      setSearchParams({ ...searchParams, pwd: password });
    }
  };

  const onPasswordEnter = (enteredPassword: string) => {
    setPassword(enteredPassword);
    setShowPasswordPrompt(false);
  };

  const setPasswordRequired = () => setShowPasswordPrompt(true);

  return {
    password,
    syncPasswordWithUrl,
    showPasswordPrompt,
    onPasswordEnter,
    setPasswordRequired,
  };
};
