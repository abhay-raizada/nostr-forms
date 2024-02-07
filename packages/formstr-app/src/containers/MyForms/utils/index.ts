import { ROUTES } from "../configs/routes";
import { MY_FORM_MENU_KEYS } from "../configs/constants";
import {log} from "../../../utils/logger";

export const getSelectedKey = (location: any) => {
  log("location got was", location.pathname);
  if (location.pathname.includes(ROUTES.DRAFTS)) {
    return MY_FORM_MENU_KEYS.DRAFTS;
  }
  if (location.pathname.includes(ROUTES.LOCAL)) {
    return MY_FORM_MENU_KEYS.LOCAL;
  }
  if (location.pathname.includes(ROUTES.NOSTR)) {
    return MY_FORM_MENU_KEYS.NOSTR;
  }
  if (location.pathname.includes(ROUTES.SUBMISSIONS)) {
    return MY_FORM_MENU_KEYS.SUBMISSIONS;
  }
  return MY_FORM_MENU_KEYS.LOCAL;
};
