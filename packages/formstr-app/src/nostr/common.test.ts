import { sendNotification } from "./common";
import { Response, Tag } from "./types";

jest.mock("nostr-tools", () => ({
  ...jest.requireActual("nostr-tools"),
  generateSecretKey: () => new Uint8Array(32),
  getPublicKey: () => "test-pubkey",
}));
jest.mock(
  "nostr-tools/utils",
  () => ({ normalizeURL: (url: string) => url }),
  { virtual: true },
);
jest.mock("../signer", () => ({ signerManager: {} }));
jest.mock("../dataLayer", () => ({
  subscribe: jest.fn(),
  fetchOne: jest.fn(),
  fetchMany: jest.fn(),
}));

describe("sendNotification", () => {
  it("handles unanswered fields with null response values", async () => {
    const form: Tag[] = [
      ["name", "Test form"],
      ["settings", JSON.stringify({ notifyNpubs: [] })],
      [
        "field",
        "question-id",
        "option",
        "Optional question",
        JSON.stringify([["choice-id", "Choice"]]),
        "{}",
      ],
    ];
    const responses = [
      ["response", "question-id", null, "{}"] as unknown as Response,
    ];

    await expect(sendNotification(form, responses)).resolves.toBeUndefined();
  });
});
