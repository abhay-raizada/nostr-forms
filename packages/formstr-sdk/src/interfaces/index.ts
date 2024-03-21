export * from "./v1";
export * from "./v0";

export type FormPassword = string | null;

export enum Errors {
  FORM_PASSWORD_REQUIRED = "FORM_PASSWORD_REQUIRED",
  WRONG_PASSWORD = "WRONG_PASSWORD",
}
