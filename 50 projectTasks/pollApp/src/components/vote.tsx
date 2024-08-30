import { useSelector, useDispatch } from "react-redux";
import { vote } from "../store/pollSlice";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import ResultPage from "./resultPage";

interface User {
  name: [];
}
interface Data {
  questionData: {
    id: number;
    question: string;
    answers: { questionId: number; option: string }[];
    questionId: number;
    votes: {
      userName: string;
      option: string;
      questionId: number;
    }[];
  }[];
}

const VotePage = () => {
  const user = useSelector((state: { user: User }) => state.user);
  const data = useSelector((item: { poll: Data }) => item.poll);
  const [Sdata] = useState(
    data.questionData.length === 0
      ? JSON.parse(localStorage.getItem("data")!)
      : data
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /*to dispatch vote details */
  const handleVote = (answer: { questionId: number; option: string }) => {
    // const votesData = [];
    // data.questionData.forEach((i) => console.log(i.votes));

    // votesData.push([
    // userName: user.name,
    //  option: answer?.option,
    //  questionId: answer?.questionId,])

    dispatch(
      vote({
        userName: user.name,
        option: answer?.option,
        questionId: answer?.questionId,
      })
    );
  };

  /*to restart  */
  const homePageHandler = () => {
    navigate("/");
    window.location.reload();
    localStorage.removeItem("count");
  };

  const submitHandler = () => {
    navigate("/login");
  };

  return (
    <>
      <div style={{ marginTop: 0 }}>
        <Button onClick={homePageHandler}>homePage</Button>
      </div>
      <h1 style={{ color: "green", textAlign: "center" }}>
        Welcome To Poll, {user.name}!
      </h1>
      <div>
        <div style={{ marginLeft: 150 }}>
          <ul style={{ listStyleType: "none" }}>
            {Sdata?.questionData?.map(
              (item: {
                id: number;
                question: string;
                answers: { questionId: number; option: string }[];
              }) => (
                <div key={item.id}>
                  <li>
                    <h3>Question:{item.question}</h3>
                  </li>
                  <p>Options:</p>
                  <div>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        {item?.answers?.map(
                          (answer: { questionId: number; option: string }) => (
                            <li
                              key={answer.option}
                              style={{
                                listStyleType: "none",
                                color: "blue",
                                marginBottom: 20,
                              }}
                            >
                              <FormControlLabel
                                value={answer.option}
                                control={<Radio />}
                                label={answer.option}
                                onClick={() => handleVote(answer)}
                              />
                            </li>
                          )
                        )}
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              )
            )}
          </ul>
          <Button onClick={submitHandler}>Submit</Button>
          {/* <Button onClick={() => navigate("/login")}>Submit</Button> */}
        </div>
      </div>
      <ResultPage />
    </>
  );
};
export default VotePage;
