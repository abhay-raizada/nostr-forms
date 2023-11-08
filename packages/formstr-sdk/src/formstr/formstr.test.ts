import { AnswerTypes } from "../interfaces";
import { makeTag } from "../utils/utils";
import { createForm } from "./formstr";
import { getEventHash } from "nostr-tools";

jest.mock("nostr-tools", () => {
  let nostrTools = jest.requireActual("nostr-tools");
  return {
    ...nostrTools,
    generatePrivateKey: jest.fn(() => {
      return "1";
    }),
    getPublicKey: jest.fn((sk) => {
      return "1";
    }),
    getEventHash: jest.fn((event) => 1),
    getSignature: jest.fn((_) => "1"),
    SimplePool: jest.fn(() => {
      return {
        publish: jest.fn((relays): Promise<void> => {
          return relays.map(() => {
            new Promise((resolve) => {
              return resolve(null);
            });
          });
        }),
        close: jest.fn(),
      };
    }),
  };
});

jest.mock("../utils/utils", () => {
  const utils = jest.requireActual("../utils/utils");
  return {
    ...utils,
    makeTag: jest.fn(utils.makeTag),
  };
});

test("works with a valid formSpec", async () => {
  let creds = await createForm({ name: "vale" });
  expect(creds).toEqual(["1", "1"]);
  expect(getEventHash).toHaveBeenCalled();
  expect(makeTag).toHaveBeenCalledTimes(0);
});

test("adds question id for each question", async () => {
  await createForm({
    name: "vale",
    fields: [
      { question: "Short question", answerType: AnswerTypes.shortText },
      { question: "Long question", answerType: AnswerTypes.paragraph },
    ],
  });
  expect(makeTag).toHaveBeenCalledTimes(2);
});
