export const LOCAL_STORAGE_KEYS = {
  LOCAL_FORMS: "formstr:forms",
  DRAFT_FORMS: "formstr:drafts",
  SUBMISSIONS: "formstr:submissions",
};

export function getItem<T>(key: string, { parseAsJson = true } = {}): T | null {
  let value = localStorage.getItem(key);
  if (value === null) {
    return value;
  }
  if (parseAsJson) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      value = null;
      localStorage.removeItem(key);
    }
  }

  return value as T;
}

export const setItem = (
  key: string,
  value: any,
  { parseAsJson = true } = {}
) => {
  let valueToBeStored = value;
  if (parseAsJson) {
    valueToBeStored = JSON.stringify(valueToBeStored);
  }
  try {
    localStorage.setItem(key, valueToBeStored);
  } catch (e) {
    console.log("Error in setItem: ", e);
  }
};
