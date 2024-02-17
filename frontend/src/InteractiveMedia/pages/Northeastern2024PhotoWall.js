import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { northeastern2024 } from "../themes";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import FloatingImages from "../components/FloatingImages";
import PhotoMosaicForm from "../components/PhotoMosaicForm";

const Northeastern2024PhotoWall = () => {
  const portraitBackground = "2024-N-CommencementBranding-v5_Page_1.png";
  const landscapeBackground = "2024-N-CommencementBranding-v5_Page_3.png";

  useEffect(() => {
    document.title = `Photo Mosaic`; // - ${eventInfo.name}`;
  });
  // }, [eventInfo]);

  return (
    <ThemeProvider theme={northeastern2024}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          backgroundImage: {
            xs: `url(/images/photos/${landscapeBackground})`, //`url(/images/photos/${portraitBackground})`,
            md: `url(/images/photos/${landscapeBackground})`,
          },
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: {
            xs: "left",
            md: "center",
          },
        }}
      >
        <CssBaseline />
        <FloatingImages />
        <PhotoMosaicForm style={{ minWidth: "40vw", maxHeight: "70vh" }} />
      </Box>
    </ThemeProvider>
  );
};

export default Northeastern2024PhotoWall;
