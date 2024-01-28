import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import "./Form.css";

const formValidationSchema = yup.object({
  song: yup.string().required("Song title is required"),
  artist: yup.string().required("Artist name is required"),
  name: yup.string(),
});

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

export const Form = ({ OnSubmit }) => {
  const formik = useFormik({
    validationSchema: formValidationSchema,
    initialValues: {
      name: "",
      song: "",
      artist: "",
    },
    onSubmit: (values) => {
      OnSubmit(values);
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <div className="requests-form">
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              className="form-field"
              id="form-song-title"
              name="song"
              label="Song title"
              value={formik.values.song}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.song && Boolean(formik.errors.song)}
              helperText={formik.touched.song && formik.errors.song}
            />
            <TextField
              fullWidth
              className="form-field"
              id="form-song-artist"
              name="artist"
              label="Artist name"
              value={formik.values.artist}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.artist && Boolean(formik.errors.artist)}
              helperText={formik.touched.artist && formik.errors.artist}
            />
            <TextField
              fullWidth
              className="form-field"
              id="form-name"
              name="name"
              label="Your name (optional)"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Box>
    </ThemeProvider>
  );
};