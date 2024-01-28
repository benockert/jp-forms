import "./App.css";
import { Form } from "./Components/Form";
import { postData } from "./api";

const SubmitForm = (values) => {
  const { song: songTitle, artist: artistName, name: requestorName } = values;
  postData({ songTitle, artistName, requestorName }).then((data) => {
    // response
    console.log(data);
  });
};

function App() {
  return (
    <div className="App">
      <img
        src={"/request_a_song.jpg"}
        className="request-a-song"
        alt="song-request-form-header-image"
      />
      <div>
        <p>Event Name</p>
      </div>
      <Form OnSubmit={SubmitForm} />
    </div>
  );
}

export default App;
