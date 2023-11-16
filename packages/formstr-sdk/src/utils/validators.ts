import { FormSpec } from "../interfaces";
import { Schema, Validator } from "jsonschema";

export async function getSchema(version: number): Promise<Schema> {
  return (await import(`../form-schemas/v${version}/form-spec.json`))
    .default as Promise<Schema>;
}

export function isValidV1Schema(
  formSchema: Schema,
  formSpec: unknown,
): formSchema is FormSpec {
  const v = new Validator();
  v.validate(formSpec, formSchema, {
    throwError: true,
  });
  return true;
}
