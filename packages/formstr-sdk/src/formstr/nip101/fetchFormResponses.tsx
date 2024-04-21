import { SimplePool, getPublicKey, nip19, nip44 } from "nostr-tools";
import {
  FormPassword,
  FormResponse,
  V1Field,
  V1FormSpec,
  V1Response,
} from "../../interfaces";
import { fetchProfiles, getDefaultRelays } from "../formstr";
import { fetchFormTemplate } from "./fetchFormTemplate";
import { getResponseSchema, isValidResponse } from "../../utils/validators";

const defaultRelays = getDefaultRelays();

function createQuestionMap(formTemplate: V1FormSpec) {
  const questionMap: { [key: string]: V1Field } = {};
  formTemplate.fields?.forEach((field) => {
    questionMap[field.questionId] = field;
  });
  return questionMap;
}

function fillData(
  response: Array<V1Response>,
  questionMap: { [key: string]: V1Field }
) {
  return response.map((questionResponse: V1Response) => {
    const question = questionMap[questionResponse.questionId];
    if (!question) {
      questionResponse.questionLabel = "Unknown Question";
      questionResponse.displayAnswer = questionResponse.answer.toString();
      return questionResponse;
    }
    questionResponse.questionLabel = question.question;
    questionResponse.displayAnswer = getDisplayAnswer(
      questionResponse.answer,
      question
    );
    return questionResponse;
  });
}

const getDisplayAnswer = (
  answer: string | number | boolean,
  field: V1Field
) => {
  return (
    field.answerSettings.choices
      ?.filter((choice) => {
        const answers = answer.toString().split(";");
        return answers.includes(choice.choiceId);
      })
      .map((choice) => choice.label)
      .join(", ") || answer.toString()
  );
};

async function getParsedResponse(
  response: string,
  questionMap: { [key: string]: V1Field },
  createdAt: number
) {
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(response);
  } catch (e) {
    return null;
  }
  if (!isValidResponse(await getResponseSchema("v1"), parsedResponse)) {
    return null;
  }
  parsedResponse = fillData(parsedResponse, questionMap);
  const dateObj = new Date(createdAt * 1000);
  return {
    response: parsedResponse,
    createdAt: dateObj.toDateString(),
  };
}

async function getNIP101Responses(pubKey: string, formId: string) {
  let relayList = defaultRelays;
  let formIdPubkey = formId;
  if (formId.startsWith("nprofile")) {
    const { pubkey, relays } = nip19.decode(formId)
      .data as nip19.ProfilePointer;
    relayList = relays || defaultRelays;
    formIdPubkey = pubkey;
  }
  const pool = new SimplePool();
  const filter = {
    kinds: [30169],
    a: [`30168:${pubKey}:${formId}`],
  };
  const responses = pool.querySync(relayList, filter);
  pool.close(relayList);
  return responses;
}

export const getFormResponses = async (
  pubKey: string,
  formId: string,
  password: FormPassword
) => {
  const responses = await getNIP101Responses(pubKey, formId);
  type ResponseType = {
    responses: Array<FormResponse>;
    authorName: string;
  };
  const formTemplate = await fetchFormTemplate(pubKey, formId, password);
  const questionMap = createQuestionMap(formTemplate);
  const finalResponses: { [key: string]: ResponseType } = {};
  const responsesBy = responses.map((r) => r.pubkey);
  const profiles = await fetchProfiles(responsesBy);
  for (const response of responses) {
    let decryptedResponse;
    try {
      decryptedResponse = await window.nostr.nip44.decrypt(
        pubKey,
        response.content
      );
    } catch (e) {
      continue;
    }
    const parsedResponse = await getParsedResponse(
      decryptedResponse,
      questionMap,
      response.created_at
    );
    if (!parsedResponse) continue;
    let entry = finalResponses[response.pubkey];

    if (!entry) {
      entry = {
        responses: [parsedResponse],
        authorName: "",
      };
    } else {
      entry.responses.push(parsedResponse);
    }
    finalResponses[response.pubkey] = entry;
  }
  for (const [pubkey, attrs] of Object.entries(finalResponses)) {
    attrs.authorName = profiles[pubkey].name;
  }
  return {
    allResponses: finalResponses,
    questionMap: questionMap,
    formSummary: formTemplate,
  };
};
