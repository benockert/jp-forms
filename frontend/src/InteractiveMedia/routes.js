import { redirect } from "react-router-dom";
import Home from "./pages/Home";
import Northeastern2024PhotoWall from "./pages/Northeastern2024PhotoWall";

const basepath = "/interactive";
const InteractiveMediaRoutes = [
  {
    path: basepath,
    element: <Home />,
  },
  {
    path: `${basepath}/Northeastern2024PhotoWall`,
    element: <Northeastern2024PhotoWall />,
  },
  {
    // 404: page not found
    path: `${basepath}/*`,
    loader: async () => {
      return redirect(basepath);
    },
  },
];

export default InteractiveMediaRoutes;
