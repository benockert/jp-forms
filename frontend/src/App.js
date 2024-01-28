import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RequestASong, { requestASongPageLoader } from "./Pages/RequestASong";
import ViewRequests, { viewRequestsPageLoader } from "./Pages/ViewRequests";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
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
});

function App() {
  const router = createBrowserRouter([
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
  ]);

  return (
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
