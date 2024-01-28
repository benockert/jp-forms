import "./SubmitRequest.css";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Form } from "../Components/Form";
import { postData, getData } from "../Api/api";

export async function requestsPageLoader({ request }) {
  const eventId = new URL(request.url).pathname.substring(1);
  return getData(`events/${eventId}`);
}

const requestLimitReachedMessage =
  "Sorry, your request limit has been reached.";

function SubmitRequest() {
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
      <img
        src={"/request_a_song.jpg"}
        className="request-a-song-image"
        alt="Request a song"
      />
      <div>
        <p className="event-name">{eventInfo.name}</p>
        <p className="event-date">{eventInfo.date}</p>
      </div>
      <Form
        OnSubmit={SubmitForm}
        message={formMessage}
        formDisabled={formDisabled}
      />
    </div>
  );
}

export default SubmitRequest;
