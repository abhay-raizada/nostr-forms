import { makeTag, constructFormUrl, constructResponseUrl } from "./utils";

describe("makeTag", () => {
  test("should generate a tag with the specified length", () => {
    const length = 10;
    const tag = makeTag(length);
    expect(tag).toHaveLength(length);
  });

  test("should generate a tag containing only alphanumeric characters", () => {
    const length = 20;
    const tag = makeTag(length);
    expect(tag).toMatch(/^[A-Za-z0-9]+$/);
  });

  test("should return an empty string when length is 0", () => {
    const tag = makeTag(0);
    expect(tag).toBe("");
  });

  test("should return an empty string when length is negative", () => {
    const tag = makeTag(-5);
    expect(tag).toBe("");
  });

  test("should return an empty string when length is not a number", () => {
    const tag = makeTag("invalid");
    expect(tag).toBe("");
  });
});

describe("constructFormUrl function", () => {
  test("Construct URL with a valid public key", () => {
    const publicKey = "validPublicKey";
    const expectedURL = `http://formstr.app/#/forms/${publicKey}`;
    const generatedURL = constructFormUrl(publicKey);
    expect(generatedURL).toBe(expectedURL);
  });

  test("Construct URL with an empty public key throws an error", () => {
    const publicKey = "";
    expect(() => constructFormUrl(publicKey)).toThrowError(
      "public key is required"
    );
  });
});

describe("constructResponseUrl function", () => {
  test("Construct URL with a valid private key", () => {
    const privateKey = "validPrivateKey";
    const expectedURL = `http://formstr.app/#/forms/${privateKey}/responses`;
    const generatedURL = constructResponseUrl(privateKey);
    expect(generatedURL).toBe(expectedURL);
  });

  test("Construct URL with an empty private key throws an error", () => {
    const privateKey = "";
    expect(() => constructResponseUrl(privateKey)).toThrowError(
      "public key is required"
    );
  });
});
