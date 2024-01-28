import "./SubmitRequest.css";
import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Form } from "../Components/Form";
import { postData, getData } from "../Api/api";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";

const alertDuration = 5 * 1000;

export async function requestsPageLoader({ request }) {
  const eventId = new URL(request.url).pathname.substring(1);
  return getData(`events/${eventId}`);
}

function SubmitRequest() {
  const [alert, setAlert] = useState({
    severity: "success",
    title: "Request submitted",
    message: "Thank you for your request: Another One Bites The Dust by Queen",
  });
  const { eventId } = useParams();
  const eventInfo = useLoaderData();

  const SubmitForm = (values) => {
    const { song: songTitle, artist: artistName, name: requestorName } = values;
    postData(`requests/${eventId}`, {
      songTitle,
      artistName,
      requestorName,
    }).then((data) => {
      setAlert(data);

      // todo: if status 200, increment 1 request in local cookie storage
    });
  };

  // alert banner handling
  //   useEffect(() => {
  //     if (alert) {
  //       const timeout = setTimeout(() => {
  //         setAlert();
  //       }, alertDuration);

  //       return () => {
  //         clearTimeout(timeout);
  //       };
  //     }
  //   }, [alert]);

  return (
    <div className="container">
      {alert && (
        <div>
          <Alert severity={alert.severity} onClose={() => setAlert()}>
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.message}
          </Alert>
        </div>
      )}
      <div className="submit-request">
        <img
          src={"/request_a_song.jpg"}
          className="request-a-song-image"
          alt="Song Request Form Header Image"
        />
        <div>
          <p className="event-name">{eventInfo.name}</p>
          <p className="event-date">{eventInfo.date}</p>
        </div>
        <Form OnSubmit={SubmitForm} />
      </div>
    </div>
  );
}

export default SubmitRequest;
