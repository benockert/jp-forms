import "./Header.css";

const Header = ({ eventInfo }) => {
  console.log({ eventInfo });
  return (
    <div>
      <img
        src={"/images/request_a_song.jpg"}
        className="request-a-song-image"
        alt="Request a song"
      />
      <div>
        <p className="event-name">{eventInfo.name}</p>
        <p className="event-date">{eventInfo.date}</p>
      </div>
    </div>
  );
};

export default Header;
