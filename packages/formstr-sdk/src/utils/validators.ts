import { FormSpec } from "../interfaces";
import { Schema, Validator } from "jsonschema";

export async function getSchema(version: string): Promise<Schema> {
  return (await import(`../form-schemas/${version}/form-spec.json`))
    .default as Promise<Schema>;
}

export async function getResponseSchema(version: string): Promise<Schema> {
  return (await import(`../form-schemas/${version}/response-spec.json`))
    .default as Promise<Schema>;
}

export function isValidSpec(
  formSchema: Schema,
  formSpec: unknown,
): formSchema is FormSpec {
  const v = new Validator();
  v.validate(formSpec, formSchema, {
    throwError: true,
  });
  return true;
}

export function isValidResponse(responseSchema: Schema, response: unknown) {
  const v = new Validator();
  const result = v.validate(response, responseSchema);
  return result.valid;
}
