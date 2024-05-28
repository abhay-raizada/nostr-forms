import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FormDetails } from "../CreateFormNew/components/FormDetails";

export const Dashboard = () => {
  const { state } = useLocation();
  const [showFormDetails, setShowFormDetails] = useState<boolean>(!!state);

  return (
    <>
      <FormDetails
        isOpen={showFormDetails}
        pubKey={state.pubKey}
        onClose={() => setShowFormDetails(false)}
      />
    </>
  );
};
