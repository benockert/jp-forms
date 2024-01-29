import Header from "../Components/Header";

import "./Home.css";

const Home = () => {
  return (
    <div className="container">
      <Header
        title={"Song Requests Submission Form"}
        subtitle={
          "Please ask your event coordinator for the link to your event's request form!"
        }
      ></Header>
    </div>
  );
};

export default Home;
