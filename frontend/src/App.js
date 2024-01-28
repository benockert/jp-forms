import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import SubmitRequest, { requestsPageLoader } from "./Pages/SubmitRequest";

function App() {
  const router = createBrowserRouter([
    {
      path: ":eventId",
      element: <SubmitRequest />,
      loader: requestsPageLoader,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
