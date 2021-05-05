import { createMuiTheme } from "@material-ui/core/styles";
export const theme = createMuiTheme({
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      paper: "#fff",
      default: "#fafafa",
      dark: "#070F23",
      ligthDark: "#121827",
    },
    primary: {
      light: "rgba(89, 210, 188, 1)",
      main: "#674293",
    },
    textColors: {
      primary: "#C80C81",
      secondary: "#C80C81",
      textPrimary: "#ffffff",
      textSecondary: "#1e1e1e",
      textLight: "#212121",
      textDark: "#e5e5e5",
    },
  },
});
export default theme;
