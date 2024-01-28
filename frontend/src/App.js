import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SubmitRequest, { requestsPageLoader } from "./Pages/SubmitRequest";

function App() {
  const router = createBrowserRouter([
    {
      path: "/:eventId",
      element: <SubmitRequest />,
      loader: requestsPageLoader,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
