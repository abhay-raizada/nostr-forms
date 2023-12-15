import {
  BASIC_MENU_KEYS,
  INPUTS_TYPES,
  PRE_BUILT_MENU_KEYS,
} from "./constants";
import { ShopOutlined } from "@ant-design/icons";

export const BASIC_MENU = [
  {
    key: BASIC_MENU_KEYS.SECTION,
    label: "Section",
    icon: <ShopOutlined style={{ color: "#800080" }} />,
  },
  {
    key: BASIC_MENU_KEYS.TITLE,
    label: "Title",
    icon: <ShopOutlined style={{ color: "#800080" }} />,
  },
];

export const INPUTS_MENU = [
  {
    key: INPUTS_TYPES.SHORT_ANSWER,
    label: "Short answer",
    icon: <ShopOutlined style={{ color: "#FFD580" }} />,
  },
  {
    key: INPUTS_TYPES.PARAGRAPH,
    label: "Paragraph",
    icon: <ShopOutlined style={{ color: "#FFD580" }} />,
  },
  {
    key: INPUTS_TYPES.MULTIPLE_CHOICE,
    label: "Multiple choice",
    icon: <ShopOutlined style={{ color: "#FFD580" }} />,
  },
  {
    key: INPUTS_TYPES.SINGLE_CHOICE,
    label: "Single choice",
    icon: <ShopOutlined style={{ color: "#FFD580" }} />,
  },
  {
    key: INPUTS_TYPES.SELECT,
    label: "Select",
    icon: <ShopOutlined style={{ color: "#FFD580" }} />,
  },
  {
    key: INPUTS_TYPES.DATE,
    label: "Date",
    icon: <ShopOutlined style={{ color: "#FFD580" }} />,
  },
  {
    key: INPUTS_TYPES.TIME,
    label: "Time",
    icon: <ShopOutlined style={{ color: "#FFD580" }} />,
  },
];

export const PRE_BUILT_MENU = [
  {
    key: PRE_BUILT_MENU_KEYS.EMAIL,
    label: "Email",
    icon: <ShopOutlined style={{ color: "#1e3f66.17" }} />,
  },
  {
    key: PRE_BUILT_MENU_KEYS.ADDRESS,
    label: "Address",
    icon: <ShopOutlined style={{ color: "#1e3f66.17" }} />,
  },
  {
    key: PRE_BUILT_MENU_KEYS.PHONE_NUMBER,
    label: "Phone number",
    icon: <ShopOutlined style={{ color: "#1e3f66.17" }} />,
  },
  {
    key: PRE_BUILT_MENU_KEYS.CARD_INFORMATION,
    label: "Card information",
    icon: <ShopOutlined style={{ color: "#1e3f66.17" }} />,
  },
  {
    key: PRE_BUILT_MENU_KEYS.DATE_OF_BIRTH,
    label: "Date of birth",
    icon: <ShopOutlined style={{ color: "#1e3f66.17" }} />,
  },
];
