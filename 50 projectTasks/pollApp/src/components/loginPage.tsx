import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setName } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

const LoginPage = () => {
  const [name, setNameState] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /*for user name */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameState(e.target.value);
  };
  /*for user login */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setName(name));
    setNameState("");
    navigate("/vote");
  };
  /*to restart the poll */
  const restartHandler = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <form
        onSubmit={handleLogin}
        style={{
          textAlign: "center",
          backgroundColor: "lightgray",
          minHeight: 300,
          minWidth: 1000,
          margin: 10,
        }}
      >
        <div>
          <h1 style={{ color: "blue" }}>Login Page</h1>
          <TextField
            required
            helperText="enter your name*"
            type="text"
            value={name}
            onChange={handleNameChange}
            id="outlined-helperText"
            label="name"
          />
          <br />
          <Button type="submit" variant="contained">
            Login
          </Button>
        </div>
        <Button onClick={restartHandler}>Restart Poll</Button>
      </form>
    </div>
  );
};

export default LoginPage;
