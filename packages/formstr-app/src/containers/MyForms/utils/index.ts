import { ROUTES } from "../configs/routes";
import { MY_FORM_MENU_KEYS } from "../configs/constants";

export const getSelectedKey = (location: any) => {
  if (location.pathname.includes(ROUTES.DRAFTS)) {
    return MY_FORM_MENU_KEYS.DRAFTS;
  }
  if (location.pathname.includes(ROUTES.LOCAL)) {
    return MY_FORM_MENU_KEYS.LOCAL;
  }
  if (location.pathname.includes(ROUTES.NOSTR)) {
    return MY_FORM_MENU_KEYS.NOSTR;
  }
  return MY_FORM_MENU_KEYS.LOCAL;
};
