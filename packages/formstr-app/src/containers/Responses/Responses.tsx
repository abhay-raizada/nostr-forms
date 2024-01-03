import { getFormResponses } from "@formstr/sdk";
import { V1Response } from "@formstr/sdk/dist/interfaces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Responses = () => {
  const { formSecret } = useParams();
  const [responses, setResponses] = useState<Array<V1Response>>([]);

  useEffect(() => {
    async function fetchResponses() {
      if (!formSecret) {
        throw Error("form secret required to view responses");
      }
      const responses = await getFormResponses(formSecret);
      setResponses(responses);
    }
    fetchResponses();
  }, [formSecret]);

  return <>{JSON.stringify(responses)}</>;
};
