import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";

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
const ResultPage = () => {
  const dataa: { userName: string; option: string; questionId: number }[][] =
    [];
  const data = useSelector((item: { poll: Data }) => item.poll);

  /*to push user name and votes  */
  data?.questionData?.forEach((item) => {
    dataa.push(item.votes);
  });
  /*to caluculate percentage  */
  const calculateOptionPercentages = (
    dataa: { userName: string; option: string; questionId: number }[][]
  ) => {
    const optionCounts: Record<string, Record<string, number>> = {};
    const optionPercentages: Record<string, Record<string, string>> = {};
    for (const i of dataa) {
      i.forEach((item) => {
        const { questionId, option } = item;
        if (!optionCounts[questionId]) {
          optionCounts[questionId] = {};
        }
        if (!optionCounts[questionId][option]) {
          optionCounts[questionId][option] = 0;
        }

        optionCounts[questionId][option]++;
        /*setting count values in local storage*/
        localStorage.setItem("count", JSON.stringify(optionCounts));
      });
    }
    /*getting count values from local storage*/
    const optionCount = JSON.parse(localStorage.getItem("count") as string);

    Object?.keys(optionCount || {})?.forEach((questionId) => {
      const totalCount = Object?.values(optionCount[questionId]).reduce(
        (acc: number, count: any) => acc + count,
        0
      );

      optionPercentages[questionId] = {};

      Object?.keys(optionCount[questionId] || {}).forEach((option) => {
        const count = optionCount[questionId][option];
        const percentage = (count / totalCount) * 100;
        optionPercentages[questionId][option] = percentage.toFixed(2);
      });
    });
    return optionPercentages;
  };

  const optionPercentages = calculateOptionPercentages(dataa);

  return (
    <>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1>result</h1>
        {Object.keys(optionPercentages).map((questionId) => (
          <div key={questionId}>
            <ul style={{ listStyleType: "none" }}>
              {Object?.keys(optionPercentages[questionId])?.map((option) => (
                <li key={option}>
                  <h3>Option:{option}</h3> , Percentage:
                  {optionPercentages[questionId][option]}%
                  <br />
                  <div
                    style={{
                      width: 500,
                      margin: "auto",
                    }}
                  >
                    <ProgressBar
                      completed={optionPercentages[questionId][option]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResultPage;
