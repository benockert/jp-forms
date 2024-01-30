import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import RequestASong, { requestASongPageLoader } from "./Pages/RequestASong";
import ViewRequests, { viewRequestsPageLoader } from "./Pages/ViewRequests";
import Home from "./Pages/Home";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiChip: {
      styleOverrides: {
        label: {
          whiteSpace: "normal", // to allow line break where necessary (mobile devices)
        },
      },
    },
  },
});

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/:eventId",
      element: <RequestASong />,
      loader: requestASongPageLoader,
    },
    {
      path: "/:eventId/view",
      element: <ViewRequests />,
      loader: viewRequestsPageLoader,
    },
    {
      // 404: page not found
      path: "*",
      loader: async () => {
        return redirect("/");
      },
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
