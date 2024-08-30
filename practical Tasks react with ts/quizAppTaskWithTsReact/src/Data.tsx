import { useState, useEffect } from "react";

const QuizData = (props: {
  questions: {
    questionText: string;
    answerOptions: {
      answerText: string;
      isCorrect: boolean;
    }[];
  }[];
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [restart, setRestart] = useState<number>(5);

  const AnswerHandler = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < props.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRestart((prev) => prev - 1);
      if (restart === 1) {
        window.location.reload();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      <div className="App">
        <div>
          <h1>Quiz </h1>
          <div className="question-section">
            <p>
              question
              <span>
                {currentQuestion + 1} / {props.questions.length}
              </span>
            </p>
            <p>{props.questions[currentQuestion].questionText}</p>
          </div>

          <div className="answer_section">
            {props.questions[currentQuestion].answerOptions.map((item) => (
              <button
                key={item.answerText}
                onClick={() => AnswerHandler(item.isCorrect)}
              >
                {item.answerText}
              </button>
            ))}
          </div>

          <div className="score-section">
            {showScore && (
              <p className="score">
                Your score is {score} out of {props.questions.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizData;
