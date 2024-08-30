import React, { FormEvent, useCallback } from "react";
import { useEffect, useState } from "react";
import "./App.css";

type passwordProps = {
  length: number;
  numbers: string;
  symbols: string;
  upperCase: string;
  alphabates: string;
};

const App: React.FC = () => {
  const [password, setpassword] = useState<passwordProps>({
    length: 8,
    numbers: "false",
    symbols: "false",
    upperCase: "false",
    alphabates: "false",
  });

  const [randomText, setRandomText] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [showData, setShowData] = useState<string[]>([]);

  const ChangeNumbersHandler = () => {
    setpassword({
      ...password,
      numbers: password.numbers === "true" ? "false" : "true",
    });
  };

  const ChangeSymbolsHandler = () => {
    setpassword({
      ...password,
      symbols: password.symbols === "true" ? "false" : "true",
    });
  };
  const ChangeAlphabatesHandler = () => {
    setpassword({
      ...password,
      alphabates: password.alphabates === "true" ? "false" : "true",
    });
  };
  const ChangeUpperCaseHandler = () => {
    setpassword({
      ...password,
      upperCase: password.upperCase === "true" ? "false" : "true",
    });
  };

  const setPasswordLength = (val: number) => {
    setpassword({
      ...password,
      length: val,
    });
  };

  const randomPassword = useCallback(() => {
    const numbersArray: string[] = [
      "1",
      "2",
      "3",
      "4",
      " 5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ];
    const symbolsArray: string[] = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
    ];
    // const alphabatesArray = [
    //   "a","b","c","d","e","f","g","h","i","j","k", "l","m","n",
    //   "o","p","q","r","s","t","u","v","w","x","y","z",
    // ];

    const characterCodes: number[] = Array.from(Array(26)).map(
      (_e, i) => i + 97
    );

    const alphabatesArray: string[] = characterCodes.map((code) =>
      String.fromCharCode(code)
    );

    const uppercaseArray: string[] = alphabatesArray.map((lettor) =>
      lettor.toUpperCase()
    );

    const { length, numbers, symbols, upperCase, alphabates } = password;

    const generateRandomPassword = (
      length: number,
      numbers: string,
      symbols: string,
      upperCase: string,
      alphabates: string
    ) => {
      const allValues: string[] = [
        ...(numbers === "true" ? numbersArray : []),
        ...(symbols === "true" ? symbolsArray : []),
        ...(alphabates === "true" ? alphabatesArray : []),
        ...(upperCase === "true" ? uppercaseArray : []),
      ];

      console.log(allValues);

      const RandomArray = (array: string[]) =>
        array.sort(() => Math.random() - 0.5);

      const characters: string[] = RandomArray(allValues).slice(0, length);

      setRandomText(characters.join(""));

      if (characters.join("") !== "") {
        setHistory((prev) => [characters.join(""), ...prev]);
      }
      return characters;
    };

    generateRandomPassword(length, numbers, symbols, upperCase, alphabates);
  }, [password]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      randomPassword();
    }, 2000);
    return () => clearInterval(timeInterval);
  }, [randomPassword]);

  const formSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    randomPassword();
  };

  const generateHistoryHandler = () => {
    setShowData(history.slice(0, 5));
  };

  return (
    <div className="container">
      <center>
        <section>
          <h1>Random Password</h1>
          <form onSubmit={formSubmitHandler}>
            <div>
              <input
                type="text"
                placeholder="password"
                className="Input-container"
                value={randomText}
                onChange={(e) => setRandomText(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="number">length</label>
              <input
                type="number"
                id="number"
                className="Input-container"
                value={password.length}
                onChange={(e) => setPasswordLength(+e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="number">numarical</label>
              <input
                type="checkbox"
                id="number"
                className="checkBox"
                value={password.numbers}
                onChange={ChangeNumbersHandler}
              />
            </div>
            <div>
              <label htmlFor="symbols">symbols</label>
              <input
                type="checkbox"
                id="symbols"
                className="checkBox"
                value={password.symbols}
                onChange={ChangeSymbolsHandler}
              />
            </div>
            <div>
              <label htmlFor="alphabates">LowerCase</label>
              <input
                type="checkbox"
                id="alphabates"
                className="checkBox"
                value={password.alphabates}
                onChange={ChangeAlphabatesHandler}
              />
            </div>
            <div>
              <label htmlFor="UpperCase">UpperCase</label>
              <input
                type="checkbox"
                id="UpperCase"
                className="checkBox"
                value={password.upperCase}
                onChange={ChangeUpperCaseHandler}
              />
            </div>

            <button type="submit" onClick={randomPassword}>
              Generate password
            </button>
            <div>
              <button onClick={generateHistoryHandler}>Generate History</button>

              {showData.map((item) => (
                <li>{item}</li>
              ))}
            </div>
          </form>
        </section>
      </center>
    </div>
  );
};

export default App;
