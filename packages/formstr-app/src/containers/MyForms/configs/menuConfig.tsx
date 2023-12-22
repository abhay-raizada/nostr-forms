import { Link } from "react-router-dom";
import {
  FileOutlined,
  InboxOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { ROUTES as GLOBAL_ROUTES } from "../../../constants/routes";
import { MY_FORM_MENU_KEYS } from "./constants";
import { ROUTES } from "./routes";

export const MY_FORM_MENU = [
  {
    key: MY_FORM_MENU_KEYS.DRAFTS,
    label: "Draft",
    icon: (
      <Link to={`${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.DRAFTS}`}>
        <FileOutlined />
      </Link>
    ),
  },
  {
    key: "Saved",
    label: "Saved on",
    type: "group",
    children: [
      {
        key: MY_FORM_MENU_KEYS.LOCAL,
        label: "Local",
        icon: (
          <Link to={`${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.LOCAL}`}>
            <InboxOutlined />
          </Link>
        ),
      },
      {
        key: MY_FORM_MENU_KEYS.NOSTR,
        label: "Nostr",
        icon: (
          <Link to={`${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.NOSTR}`}>
            <NotificationOutlined />
          </Link>
        ),
      },
    ],
  },
];
