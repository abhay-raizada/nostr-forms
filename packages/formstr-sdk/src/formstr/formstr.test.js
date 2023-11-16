import { AnswerTypes } from "../interfaces";
import { makeTag } from "../utils/utils";
import * as formstr from "./formstr";
import * as nostrTools from "nostr-tools";

jest.mock("nostr-tools", () => {
  let nostrTools = jest.requireActual("nostr-tools");
  return {
    __esModule: true,
    ...nostrTools,
    generatePrivateKey: jest.fn(() => {
      return "priv";
    }),
    getPublicKey: jest.fn((sk) => {
      return "pub";
    }),
    getEventHash: jest.fn((event) => 1),
    getSignature: jest.fn((_) => "1"),
    SimplePool: jest.fn(() => {
      return {
        publish: jest.fn((relays) => {
          return relays.map(() => {
            new Promise((resolve) => {
              return resolve(null);
            });
          });
        }),
        list: jest.fn((relays) => {
          return new Promise((resolve) =>
            resolve([{ content: '{"name": "test"}' }]),
          );
        }),
        close: jest.fn(),
        get: jest.fn(() => {
          return new Promise((resolve) => {
            resolve({content: '{"name": "test"}'})
          })
        })
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

const mockWindow = {
  nostr: {
    nip04: {
      encrypt: jest.fn(),
      decrypt: jest.fn(() => {
        return new Promise((resolve) =>
          resolve(JSON.stringify([["form", ["pub", "priv"]]])),
        );
      }),
    },
    getPublicKey: jest.fn(),
    signEvent: jest.fn(),
  },
};

// For Node.js environment
if (typeof window === "undefined") {
  global.window = mockWindow;
}
beforeEach(() => {
  const mockedNip04 = {
    encrypt: jest.fn(),
    decrypt: jest.fn(() => {
      return new Promise((resolve) =>
        resolve(JSON.stringify([["form", ["pub", "priv"]]])),
      );
    }),
  };
  jest.replaceProperty(nostrTools, "nip04", mockedNip04);
});
afterEach(() => {
  jest.clearAllMocks();
  makeTag.mockReset();
  nostrTools.nip04.encrypt.mockReset();
  nostrTools.nip04.decrypt.mockReset();
  if (typeof window === "undefined") {
    global.window = undefined;
  }
});

test("works with a valid formSpec", async () => {
  let creds = await formstr.createForm({ name: "vale", schemaVersion: "v1" });
  expect(creds).toEqual(["pub", "priv"]);
  expect(nostrTools.getEventHash).toHaveBeenCalled();
  expect(makeTag).toHaveBeenCalledTimes(0);
});

test("adds question id for each question", async () => {
  await formstr.createForm({
    name: "vale",
    schemaVersion: "v1",
    fields: [
      { question: "Short question", answerType: AnswerTypes.shortText },
      { question: "Long question", answerType: AnswerTypes.paragraph },
    ],
  });
  expect(makeTag).toHaveBeenCalledTimes(2);
});

test("adds choice id for each choice", async () => {
  await formstr.createForm({
    name: "vale",
    schemaVersion: "v1",
    fields: [
      {
        question: "Short question",
        answerType: AnswerTypes.radioButton,
        choices: [
          {
            message: "choice1",
          },
          {
            message: "choice2",
          },
        ],
      },
    ],
  });
  expect(makeTag).toHaveBeenCalledTimes(3);
});

test("throws error if bad answer type is added", async () => {
  await expect(
    formstr.createForm({
      name: "vale",
      fields: [
        { question: "Short question", answerType: AnswerTypes.shortText },
        { question: "Wrong question", answerType: "i don't exist" },
      ],
    }),
  ).rejects.toThrow(Error);
});

test("saves form on nostr if flag is set", async () => {
  let spy = jest
    .spyOn(formstr, "saveFormOnNostr")
    .mockImplementationOnce(async () => {
      return Promise.resolve(null);
    });
  await formstr.createForm(
    {
      name: "vale",
      schemaVersion: "v1"
    },
    true,
  );
  expect(spy).toHaveBeenCalledTimes(1);
});

describe("Testing getPastUserForms", () => {
  test("should fetch and parse user forms", async () => {
    const userPublicKey = "publicKey";
    const savedForms = await formstr.getPastUserForms(userPublicKey);
    expect(savedForms).toEqual([["form", ["pub", "priv"]]]);
  });

  test("should handle missing window.nostr", async () => {
    delete global.window;
    await expect(formstr.getPastUserForms("publicKey")).rejects.toThrow();
    //global.window = mockWindow;
  });

  test("should handle invalid data from pool.list", async () => {
    await expect(formstr.getPastUserForms("publicKey")).rejects.toThrow();
  });

  test("should handle JSON.parse error", async () => {
    await expect(formstr.getPastUserForms("publicKey")).rejects.toThrow();
  });

  test("should decrypt retrieved forms", async () => {
    global.window = mockWindow;
    const savedForms = await formstr.getPastUserForms("publicKey");
    expect(savedForms).toEqual([["form", ["pub", "priv"]]]);
  });
});

describe("saveFormOnNostr", () => {
  test("should save form on Nostr with userSecretKey", async () => {
    const formCredentials = ["pub1", "priv1"];

    await formstr.saveFormOnNostr(formCredentials, "userPriv");

    expect(nostrTools.getEventHash).toHaveBeenCalledTimes(1);
    expect(nostrTools.nip04.encrypt).toHaveBeenCalledTimes(1);
    expect(nostrTools.nip04.decrypt).toHaveBeenCalledTimes(1);
  });

  test("should save form on Nostr without userSecretKey and with window.nostr", async () => {
    const formCredentials = ["pub1", "priv1"];
    await formstr.saveFormOnNostr(formCredentials);

    expect(global.window.nostr.signEvent).toHaveBeenCalledTimes(1);
  });

  test("should handle missing methods for encryption", async () => {
    const formCredentials = ["pub1", "priv1"];
    delete global.window;

    await expect(formstr.saveFormOnNostr(formCredentials)).rejects.toThrow();
  });
});

describe('getFormTemplate', () => {
  it('should return the form template when it exists', async () => {

    const formTemplate = await formstr.getFormTemplate("npub");

    expect(formTemplate).toEqual({ name: 'test', schemaVersion: "v1" });
  });

  it('should convert old templates to v1', async () => {
    jest.spyOn(nostrTools, "SimplePool").mockImplementationOnce(() =>{
      return {
        get: jest.fn(()=> new Promise((resolve) => resolve(
          {content: 
          JSON.stringify({
            name: "Heyo",
            fields: [ {
              question: "Question1",
              answerType: "singleChoice",
              tag: "asdasd",
              choices: [
                {
                  message: "choice",
                  tag: "tfsdfg"
                }
              ]
            }]
          })}
        ))),
        close: jest.fn()
      }
    } );
    const formTemplate = await formstr.getFormTemplate("npub");

    expect(formTemplate).toEqual({ name: 'Heyo', schemaVersion: "v1", fields: [ {
      question: "Question1",
      answerType: "radioButton",
      questionId: "asdasd",
      choices: [
        {
          message: "choice",
          choiceId: "tfsdfg"
        }
      ]
    }] });
  });

  it('should raise error if theres a problem in converting', async () => {
    jest.spyOn(nostrTools, "SimplePool").mockImplementationOnce(() =>{
      return {
        get: jest.fn(()=> new Promise((resolve) => resolve(
          {content: 
          JSON.stringify({
            name: "Heyo",
            fields: [ {
              question: "Question1",
              answerType: "random question type",
              tag: "asdasd",
            }]
          })}
        ))),
        close: jest.fn()
      }
    } );
    await expect(formstr.getFormTemplate("npub")).rejects.toThrow();
  });

  it('should throw an error when the form template is not found', async () => {
    jest.spyOn(nostrTools, "SimplePool").mockImplementationOnce(() =>{
      return {
        get: jest.fn(()=> new Promise((resolve) => resolve(null))),
        close: jest.fn()
      }
    } );
    await expect(formstr.getFormTemplate("npub")).rejects.toThrow();
  });
});
