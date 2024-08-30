import { useEffect, useState } from "react";
import "./App.css";
const App = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [message, setMessage] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  console.log(recognition);
  recognition.continuous = true;

  recognition.onstart = () => {
    setListening(true);
    setMessage("Speak Now...  Listnening...");
  };

  recognition.onresult = (event) => {
    const { transcript } = event.results[event.results.length - 1][0];
    setTranscript(transcript);
    setListening(false);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      recognition.stop();
    }, 200); // Adjust the pause duration threshold here (in milliseconds)

    setTimeoutId(newTimeoutId);
  };

  recognition.onend = () => {
    setListening(false);
    setMessage("");
  };

  const handleMicClick = () => {
    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <>
      {/* use Test component to test color changing of body by giving color in voice */}
      {/* <Test /> */}
      <div className="container">
        <button className="mic-button" onClick={handleMicClick}>
          <img
            src={process.env.PUBLIC_URL + "/mic.png"}
            className={`mic-image ${listening ? "animate" : ""}`}
            alt="Microphone"
          />
        </button>
        {message && <div className="message">{message}</div>}
        <textarea className="transcript" value={transcript} readOnly />
      </div>
    </>
  );
};

export default App;
