import React, { useState } from "react";
import { randomQuestions } from "./randomQuestions";
import "./quizApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/700.css";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Resultpage from "./result";

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [prevbutton, setPrevButton] = useState<number>();
  const [submitButon, setSubmitButton] = useState<boolean>(false);
  const [currentSelectedQuestion, setCurrentSelectedQuestion] = useState<
    string
  >("");
  const [showSkipButton, setShowSkipButon] = useState<boolean>(true);
  const [skippedQUestion, setSkippedQuestion] = useState<number>();
  const [userSelectedAnswers, setUserSeelectedAnswers] = useState<string[]>([]);
  const [prevClicked, setPrevClicked] = useState<boolean>(false);
  const [showScoreCard, setScoreCard] = useState<boolean>(false);

  /*to move next question */
  const nextHandler = () => {
    if (currentSelectedQuestion === "") {
      toast.error("please select any option!");
    }
    /*to redirect to stopped */
    if (prevbutton! > 0 && currentSelectedQuestion.length > 1) {
      setCurrentQuestion(prevbutton! - 1);
      setPrevButton(-2);
    }
    if (
      currentQuestion < randomQuestions.length - 1 &&
      currentSelectedQuestion.length > 1
    ) {
      setCurrentQuestion((prev) => prev + 1);
      setUserSeelectedAnswers((prev) => [
        ...prev,
        `${currentSelectedQuestion}_${randomQuestions[currentQuestion][0].id}`,
      ]);
      setCurrentSelectedQuestion("");
    }

    if (
      currentQuestion > randomQuestions.length - 2 &&
      currentSelectedQuestion.length > 1
    ) {
      setUserSeelectedAnswers((prev) => [
        ...prev,
        `${currentSelectedQuestion}_${randomQuestions[currentQuestion][0].id}`,
      ]);

      setCurrentSelectedQuestion("");
    }
  };
  /*to move previous skipped question  */
  const onClickPrevButton = () => {
    setPrevButton(currentQuestion);
    setCurrentQuestion(skippedQUestion!);
    setPrevClicked(true);
  };

  /*To submit quiz  */

  const submitHandler = () => {
    setUserSeelectedAnswers((prev) => [
      ...prev,
      `${currentSelectedQuestion}_${randomQuestions[currentQuestion][0].id}`,
    ]);
    toast.success("submitted successfully!Thank you!");

    setScoreCard(true);
  };

  /*To skip the Question   */
  const onSkipHandler = () => {
    setShowSkipButon(false);
    /*if it is last question */
    if (currentQuestion > randomQuestions.length - 2) {
      submitHandler();
    }
    if (currentQuestion < randomQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      toast("you skipped the question");
    }
    setSkippedQuestion(currentQuestion);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    /*if it is last question  */
    if (currentQuestion === randomQuestions.length - 1) {
      setCurrentSelectedQuestion(e.target.value);
      setSubmitButton(true);
    }
    if (currentQuestion <= randomQuestions.length - 2) {
      setCurrentSelectedQuestion(e.target.value);
      setSubmitButton(false);
    }
  };

  console.log(prevbutton);
  return (
    <div className="quiz-container" id="quiz">
      <ToastContainer />

      <div className="quiz-header">
        {!showScoreCard && (
          <>
            {randomQuestions[currentQuestion].map((data) => {
              return (
                <>
                  <h2 id="question">
                    Question {currentQuestion + 1} : {data.question}
                  </h2>
                  <h3 id="question">Points for this question: {data.points}</h3>
                  <FormHelperText>Choose an answer below</FormHelperText>
                  <ul>
                    {data.answers.map((answer: string) => {
                      return (
                        <>
                          <li>
                            <input
                              type="Radio"
                              name="answer"
                              value={answer}
                              id={answer}
                              className="answer"
                              checked={currentSelectedQuestion === `${answer}`}
                              onChange={onChangeHandler}
                            />
                            <label htmlFor={answer}>{answer}</label>
                          </li>
                        </>
                      );
                    })}
                  </ul>
                </>
              );
            })}

            {showSkipButton && (
              <Button
                variant="outlined"
                color="primary"
                onClick={onSkipHandler}
              >
                Skip
              </Button>
            )}

            {!showSkipButton && !prevClicked && (
              <Button variant="text" color="error" onClick={onClickPrevButton}>
                PrevButton
              </Button>
            )}

            {!submitButon && (
              <Button
                id="submit"
                variant="outlined"
                color="secondary"
                onClick={nextHandler}
              >
                Next
              </Button>
            )}

            {submitButon && (
              <Button
                variant="contained"
                color="secondary"
                onClick={submitHandler}
              >
                Submit
              </Button>
            )}
          </>
        )}

        {showScoreCard && <Resultpage data={userSelectedAnswers} />}
      </div>
    </div>
  );
};

export default QuizApp;
