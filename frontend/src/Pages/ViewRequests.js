import React from "react";
import { useLoaderData } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getData } from "../api/api";
import Header from "../Components/Header";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import PersonIcon from "@mui/icons-material/Person";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import "./ViewRequests.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export async function viewRequestsPageLoader({ request }) {
  const eventId = new URL(request.url).pathname.split("/")[1];
  const eventInfo = await getData(`events/${eventId}`);
  const eventRequests = await getData(`requests/${eventId}`);
  return { eventInfo, eventRequests };
}

const ViewRequests = () => {
  const { eventId } = useParams();
  const { eventInfo, eventRequests } = useLoaderData();

  return (
    <div className="container">
      <Header eventInfo={eventInfo}></Header>
      <Box
        sx={{
          "& .MuiChip-outlined": {
            border: "none",
            fontSize: "1rem",
          },
        }}
        className="requests-view"
      >
        <Stack spacing={2}>
          {eventRequests.map((request) => {
            return (
              <Item>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                >
                  <Chip
                    icon={<MusicNoteIcon />}
                    label={request.song_title}
                    variant="outlined"
                  />
                  <Chip
                    icon={<PersonIcon />}
                    label={request.artist_name}
                    variant="outlined"
                  />
                </Stack>
              </Item>
            );
          })}
        </Stack>
      </Box>
    </div>
  );
};

export default ViewRequests;
