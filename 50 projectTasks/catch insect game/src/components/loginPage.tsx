import * as React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { onUser } from "../store/insectSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [duration, setDuration] = useState<number>(0);
  const [userName, SetUserName] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* for username*/
  const nameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetUserName(event.target.value);
  };
  /* for duration*/
  const durationHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(Math.floor(+event.target.value));
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    /*for dispatching username and duration */
    localStorage.setItem("time", JSON.stringify(duration));
    localStorage.setItem("score", JSON.stringify(0));
    dispatch(
      onUser({
        userName: userName,
        duration: duration,
      })
    );
    navigate("/selectInsect");
    setDuration(0);
    SetUserName("");
  };

  return (
    <div>
      <h1>Catch Insect Game</h1>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <TextField
          style={{ width: 600, marginBottom: 40 }}
          required
          id="outlined-basic"
          label="Enter your name"
          variant="outlined"
          value={userName}
          onChange={nameHandler}
        ></TextField>
        <br />
        <TextField
          style={{ width: 600, marginBottom: 40 }}
          type="number"
          label="Enter specific duration"
          value={duration || ""}
          id="duration"
          onChange={durationHandler}
        ></TextField>
        <br />
        {userName.length > 0 && duration > 0 && (
          <Button
            style={{ width: 150, height: 60 }}
            type="submit"
            variant="contained"
            color="success"
            onClick={submitHandler}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};
export default LoginPage;
