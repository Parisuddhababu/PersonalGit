import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React from "react";

type Data = {
  insectSelect: {
    insectSelected: string;
  }[];
  imagesData: { id: string; url: string; name: string }[];
  userName: { userName: string; duration: number }[];
  result: { score: number; time: number }[];
};

/*for show the score board */
const LeaderBoard = () => {
  const data = useSelector((item: { insect: Data }) => item.insect);
  const navigate = useNavigate();

  localStorage.setItem("userName", JSON.stringify(data.userName));
  localStorage.setItem("insectSelect", JSON.stringify(data.insectSelect));
  localStorage.setItem("result", JSON.stringify(data.result));
  localStorage.setItem("imagsData", JSON.stringify(data.imagesData));

  const homepageHandler = () => {
    navigate("/");
    window.location.reload();
  };
  return (
    <div>
      <Button onClick={homepageHandler} variant="contained" color="secondary">
        Exit
      </Button>
      <h3>welcome to leader board</h3>
      {data.userName.map((user, i) => (
        <li style={{ listStyleType: "none" }} key={i}>
          <p>
            playerName:{user.userName} , Score: {data.result[i]?.score}
          </p>
          <p>Duration:{user.duration}</p>
        </li>
      ))}
    </div>
  );
};
export default LeaderBoard;
