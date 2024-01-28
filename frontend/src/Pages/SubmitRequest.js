import "./SubmitRequest.css";
import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Form } from "../Components/Form";
import { postData, getData } from "../Api/api";

export async function requestsPageLoader() {
  return getData("events/BentleyGala2024");
}

function SubmitRequest() {
  const { eventId } = useParams();
  const eventInfo = useLoaderData();
  console.log({ eventInfo });

  const SubmitForm = (values) => {
    const { song: songTitle, artist: artistName, name: requestorName } = values;
    postData(`requests/${eventId}`, {
      songTitle,
      artistName,
      requestorName,
    }).then((data) => {
      // response
      console.log(data);
    });
  };

  return (
    <div className="submit-request-stack">
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
  );
}

export default SubmitRequest;
