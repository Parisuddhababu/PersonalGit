import DummyData from "./dummyData.json";
export const fourRandomNumbers: number[] = [];

/* Generating four random numbers among all */
for (let i = 0; i <= DummyData.dummyData.length; i++) {
  const randomNumberGenerator = Math.floor(
    Math.random() * DummyData.dummyData.length
  );
  if (
    fourRandomNumbers.length < 4 &&
    !fourRandomNumbers.includes(randomNumberGenerator)
  ) {
    fourRandomNumbers.push(randomNumberGenerator);
  }
}

/* acceccing 4 random questions from Json and sorting into ascending */

export const randomQuestions: {
  question: string;
  answers: string[];
  correctIndex: string;
  points: number;
  id: string;
}[][] = [];

for (let i = 0; i < fourRandomNumbers.length; i++) {
  randomQuestions.push([
    {
      ...DummyData.dummyData[fourRandomNumbers.sort()[i]],
    },
  ]);
}
