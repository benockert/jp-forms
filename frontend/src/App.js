import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RequestASong, { requestASongPageLoader } from "./Pages/RequestASong";

function App() {
  const router = createBrowserRouter([
    {
      path: "/:eventId",
      element: <RequestASong />,
      loader: requestASongPageLoader,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
