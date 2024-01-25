import { Link } from "react-router-dom";
import {
  FileOutlined,
  LaptopOutlined,
  NotificationOutlined,
  RightSquareOutlined,
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
    key: MY_FORM_MENU_KEYS.SUBMISSIONS,
    label: "Submissions",
    icon: (
      <Link to={`${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.SUBMISSIONS}`}>
        <RightSquareOutlined />
      </Link>
    ),
  },
  {
    key: "Saved",
    label: "Saved Forms",
    type: "group",
    children: [
      {
        key: MY_FORM_MENU_KEYS.LOCAL,
        label: "This Device",
        icon: (
          <Link to={`${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.LOCAL}`}>
            <LaptopOutlined />
          </Link>
        ),
      },
      {
        key: MY_FORM_MENU_KEYS.NOSTR,
        label: "Nostr Profile",
        icon: (
          <Link to={`${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.NOSTR}`}>
            <NotificationOutlined />
          </Link>
        ),
      },
    ],
  },
];
