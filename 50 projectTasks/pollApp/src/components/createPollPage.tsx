import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuestion } from "../store/pollSlice";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Data {
  questionData: {
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

const CreatePoll = () => {
  const [question, setQuestion] = useState<string>("");
  const [option, setOption] = useState("");
  const [options, setOptions] = useState<
    { option: string; questionId: number; id: number }[]
  >([]);
  const navigate = useNavigate();
  const data = useSelector((item: { poll: Data }) => item.poll);
  const [questionId] = useState(Math.floor(Math.random() * 100));
  const [showSubmit, setShowSubmit] = useState(false);
  const dispatch = useDispatch();
  /*to add options */
  const addOption = () => {
    /*do not allow same option */
    if (option === "") {
      alert("plese enter one option");
    }
    if (options.some((item) => item.option === option)) {
      alert("option present");
    } else {
      setOptions([
        ...options,
        {
          option: option,
          questionId: questionId,
          id: Math.floor(Math.random() * 100),
        },
      ]);
    }
    setOption("");
  };

  /*question and answer submit handler */

  const submitHandler = () => {
    /*not allow options not more than one */
    if (options.length < 2) {
      alert("add more than one option");
    }
    if (options.length >= 2) {
      dispatch(
        addQuestion({
          question: question,
          answers: options,
          questionId: questionId,
        })
      );
      setShowSubmit(true);
      setQuestion("");
      setOption("");
      setOptions([]);
    }
  };
  /*to login */
  const loginHandler = () => {
    localStorage.setItem("data", JSON.stringify(data));
    navigate("/login");
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "lightblue",
          padding: 20,
        }}
      >
        <h1 style={{ color: "blue" }}>Create A Poll </h1>
        <div>
          <h3 style={{ color: "red" }}>Question:</h3>
          <TextField
            required
            type="text"
            label="question"
            value={question}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuestion(e.target.value)
            }
            helperText="Ask a Question"
          />
          <br />
          <TextField
            required
            type="text"
            value={option}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOption(e.target.value)
            }
            helperText="Add Some Options for Poll"
            label="option"
          />
          <br />
          <div>
            <Button onClick={addOption} variant="contained" color="secondary">
              Add
            </Button>
            <br />
            <Button
              onClick={submitHandler}
              variant="contained"
              style={{ marginTop: 30 }}
            >
              submit
            </Button>
          </div>
          <div>
            {showSubmit && (
              <Button
                variant="contained"
                color="success"
                onClick={loginHandler}
              >
                login to poll
              </Button>
            )}
          </div>
          <ul>
            {data?.questionData?.map((question) => (
              <li
                style={{ listStyleType: "none" }}
                key={Math.floor(Math.random() * 100)}
              >
                <h3>Question:{question.question}</h3>
                <h4>Options:</h4>
                {question?.answers?.map((option) => (
                  <p key={option.option}>{option.option}</p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default CreatePoll;
