import { useTheme } from "@mui/material";
import { AppDeskProvider as BaseAppDeskProvider } from "@formstr/common-ui";
import type { CSSProperties, ReactNode } from "react";
import "@formstr/common-ui/styles.css";

/**
 * Forms host wrapper: maps the app's MUI tokens into the shared drawer and
 * mounts it once for the whole app.
 */
export function AppDeskProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();

  const deskStyle = {
    "--fs-desk-bg": theme.palette.background.paper,
    "--fs-desk-ink": theme.palette.text.primary,
    "--fs-desk-muted": theme.palette.text.secondary,
    "--fs-desk-line": theme.palette.divider,
    "--fs-desk-line-strong": theme.palette.divider,
    "--fs-desk-hover": theme.palette.action.hover,
    "--fs-desk-radius": `${theme.shape.borderRadius}px`,
    "--fs-desk-shadow": theme.shadows[8],
  } as CSSProperties;

  return (
    <BaseAppDeskProvider
      currentAppId="forms"
      theme={theme.palette.mode}
      style={deskStyle}
    >
      {children}
    </BaseAppDeskProvider>
  );
}
