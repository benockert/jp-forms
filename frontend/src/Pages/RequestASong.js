import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Form } from "../Components/Form";
import Header from "../Components/Header";
import { postData, getData } from "../api/api";
import Chip from "@mui/material/Chip";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import Box from "@mui/material/Box";

import "./RequestASong.css";

export async function requestASongPageLoader({ request }) {
  const eventId = new URL(request.url).pathname.split("/")[1];
  return getData(`events/${eventId}`);
}

const requestLimitReachedMessage =
  "Sorry, your request limit has been reached.";

function RequestASong() {
  const { eventId } = useParams();
  const eventInfo = useLoaderData();
  const [formMessage, setFormMessage] = useState({});
  const [formDisabled, setFormDisabled] = useState(true);
  const [requestCount, setRequestCount] = useState(() => {
    // load request count from local storage
    const count =
      parseInt(
        localStorage.getItem(`jamin-productions-requests-form-${eventId}-count`)
      ) || 0;

    // compare to limit
    if (count >= eventInfo.requestLimit) {
      setFormDisabled(true);
      setFormMessage({ message: requestLimitReachedMessage });
    } else {
      // if under limit, enable the form
      setFormDisabled(false);
    }

    return count;
  });

  const SubmitForm = (values) => {
    setFormMessage({});

    const { song: songTitle, artist: artistName, name: requestorName } = values;
    postData(`requests/${eventId}`, {
      songTitle,
      artistName,
      requestorName,
    }).then((data) => {
      setFormMessage(data);

      if (data.result === "success") {
        const count = requestCount + 1;
        setRequestCount(count);
        localStorage.setItem(
          `jamin-productions-requests-form-${eventId}-count`,
          count
        );

        // disable the form if we have reached our limit
        if (count >= eventInfo.requestLimit) {
          setFormDisabled(true);
        }
      }
    });
  };

  return (
    <div className="container">
      <Header eventInfo={eventInfo}></Header>
      <Box className="requests-view">
        <Form OnSubmit={SubmitForm} formDisabled={formDisabled}>
          {formMessage.message && (
            <Box
              className="form-message"
              sx={{
                "& .MuiChip-outlined": {
                  border: "none",
                },
              }}
            >
              {formMessage.result === "success" ? (
                <Chip
                  icon={<PlaylistAddCheckIcon />}
                  label={formMessage.message}
                  color="success"
                  variant="outlined"
                  sx={{
                    "& MuiChip-outlined": {
                      border: "none",
                    },
                  }}
                />
              ) : (
                <Chip
                  icon={<PlaylistRemoveIcon />}
                  label={formMessage.message}
                  color="warning"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Form>
      </Box>
    </div>
  );
}

export default RequestASong;
