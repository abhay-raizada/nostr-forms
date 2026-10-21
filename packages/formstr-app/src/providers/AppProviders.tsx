import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { muiTheme } from "../theme/muiTheme";
import { SnackbarProvider } from "./SnackbarProvider";
import { AppDeskProvider } from "./AppDeskProvider";

const ThemedProviders = ({ children }: { children: React.ReactNode }) => {
  // MUI is the sole styling system: ui-rewrite-mui Phase 6 removed antd's
  // ConfigProvider. All components take tokens from muiTheme.
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppDeskProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </AppDeskProvider>
    </MuiThemeProvider>
  );
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemedProviders>{children}</ThemedProviders>
    </I18nextProvider>
  );
};

export default AppProviders;
