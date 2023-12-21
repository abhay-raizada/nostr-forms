import {
  FileOutlined,
  InboxOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { MY_FORM_MENU_KEYS } from "./constants";
import { ROUTES } from "./routes";
import { Link } from "react-router-dom";

export const MY_FORM_MENU = [
  {
    key: MY_FORM_MENU_KEYS.DRAFTS,
    label: "Draft",
    icon: (
      <Link to={ROUTES.DRAFTS}>
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
          <Link to={ROUTES.LOCAL}>
            <InboxOutlined />
          </Link>
        ),
      },
      {
        key: MY_FORM_MENU_KEYS.NOSTR,
        label: "Nostr",
        icon: (
          <Link to={ROUTES.NOSTR}>
            <NotificationOutlined />
          </Link>
        ),
      },
    ],
  },
];
