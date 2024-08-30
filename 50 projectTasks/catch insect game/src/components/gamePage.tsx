import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onResult } from "../store/insectSlice";
import { Button } from "@mui/material";

type Data = {
  insectSelect: {
    insectSelected: string;
  }[];
  imagesData: { id: string; url: string; name: string }[];
  userName: { userName: string; duration: number }[];
  result: { score: number }[];
};

const GamePage = () => {
  const data = useSelector((item: { insect: Data }) => item.insect);
  const [score, setScore] = useState(0);
  const time = JSON.parse(localStorage.getItem("time") as string);
  const [timer, setTimer] = useState(
    time ? parseInt(time) : data.userName[data.userName.length - 1].duration
  );
  const [idleTimer, setIdleTimer] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      if (idleTimer < 6) {
        setIdleTimer((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(int);
  }, [timer]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  /*for timer */
  useEffect(() => {
    const time = setInterval(() => {
      setTimer((timer) => timer - 1);

      if (timer === 0) {
        dispatch(
          onResult({
            score: score,
          })
        );

        navigate("/leaderBoard");
        window.location.reload();
      }
    }, 1000);
    localStorage.setItem("time", JSON.stringify(timer));
    return () => clearInterval(time);
  }, [timer]);

  const insectGameHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    // if (idleTimer >= 5) {
    //   setIdleTimer(0);
    //   setScore((prev) => prev);
    //   localStorage.setItem("score", JSON.stringify(score));
    // }

    /*for generating image random locations */
    document.querySelector(".insect")?.classList.add("caught");
    setTimeout(() => {
      (e.target as HTMLImageElement).style.top = `${Math.floor(
        Math.random() * (window.innerHeight - 200) + 100
      )}px`;
      (e.target as HTMLImageElement).style.left = `${Math.floor(
        Math.random() * (window.innerWidth - 200) + 100
      )}px`;
      document.querySelector(".insect")?.classList.remove("caught");
    }, 1000);

    /*for setting score */
    setScore((prev) => prev + 1);
    localStorage.setItem("score", JSON.stringify(score));
    setIdleTimer(0);
  };

  const insectSelectLength = data.insectSelect.length;
  const leaderBoardHandler = () => {
    dispatch(
      onResult({
        score: score,
      })
    );
    navigate("/leaderBoard");
    window.location.reload();
  };

  localStorage.setItem("userName", JSON.stringify(data.userName));
  localStorage.setItem("insectSelect", JSON.stringify(data.insectSelect));
  localStorage.setItem("result", JSON.stringify(data.result));
  localStorage.setItem("imagesData", JSON.stringify(data.imagesData));
  useEffect(() => {
    setScore(parseInt(JSON.parse(localStorage.getItem("score")!)));
  }, []);
  return (
    <>
      <Button
        onClick={leaderBoardHandler}
        variant="contained"
        color="success"
        style={{ marginTop: 40 }}
      >
        Quit Game
      </Button>
      <div className="screen game-container" id="game-container">
        <h3 id="time" className="time">
          Time:{timer}
        </h3>
        <h3 id="score" className="score">
          Score:{score}
        </h3>
        <h5 id="message" className="message">
          Are you annoyed yet? <br />
          You are playing an impossible game!!
        </h5>
        <img
          className={`insect ${idleTimer >= 5 ? "blink" : ""}`}
          style={{ width: "150px", height: "150px" }}
          src={data.insectSelect[insectSelectLength - 1].insectSelected}
          onClick={insectGameHandler}
        />
      </div>
    </>
  );
};
export default GamePage;
