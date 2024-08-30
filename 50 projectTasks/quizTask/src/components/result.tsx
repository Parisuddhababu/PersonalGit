import React, { useEffect } from "react";
import { randomQuestions } from "./randomQuestions";
import "./result.css";
import Button from "@mui/material/Button";

const Resultpage = (props: { data: string[] }) => {
  let points = 0;
  const wrong = randomQuestions.length; /* total questions-correct */
  let correct = 0;
  const AllAnswers = props.data.map((item: string) => item.split("_")[0]);

  /* To checking correct answers and adding score. */

  props.data.forEach((item: string) => {
    return randomQuestions.filter((obj) => {
      /* checking both IDS   */
      if (obj[0].correctIndex === item.split("_")[0]) {
        correct += 1;
        return (points += obj[0].points);
      }
    });
  });

  /* to restart quiz when click on button   */

  const reloadHandler = () => {
    window.location.reload();
  };

  /* automatic restart after 30 secs after the result   */
  useEffect(() => {
    const interval = setInterval(() => {
      reloadHandler();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  });

  interface itemProps {
    question: string;
    answers: string[];
    correctIndex: string;
    points: number;
    id: string;
  }

  return (
    <>
      <div className="result">
        <Button variant="contained" color="success" onClick={reloadHandler}>
          Restart
        </Button>

        <h3>Result</h3>
        <p>Your Points : {points}</p>
        <p>
          Total Question: <span>{randomQuestions.length}</span>
        </p>

        <p>
          Correct Answers:<span> {correct}</span>
        </p>
        <p>
          Wrong Answers:<span> {wrong - correct}</span>
        </p>
      </div>

      <div className="score">
        <ul>
          {randomQuestions.map((item: itemProps[]) => {
            return (
              <>
                <li>
                  <h3>Question :{item[0].question}</h3>
                  <h5>
                    <span>Points : {item[0].points}</span>
                  </h5>

                  {/* your selected answer  */}

                  {item[0].answers.map((item: any) => (
                    <>
                      <li>
                        {AllAnswers[`${AllAnswers.indexOf(item)}`] ===
                        item[0].correctIndex ? (
                          <li>-{item} </li>
                        ) : (
                          <p>your answer : {item}</p>
                        )}
                      </li>
                    </>
                  ))}
                  {/* showing correct answer */}
                  <p className="correct">
                    *Correct Answer: {item[0].correctIndex}
                  </p>
                </li>
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
};
export default Resultpage;
