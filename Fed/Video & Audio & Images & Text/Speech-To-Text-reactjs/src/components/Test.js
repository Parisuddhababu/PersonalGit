import { useState } from "react";
import "../App.css";

// Speak Any Color(Basic And Single) To Change The Color Of Body

const Test = () => {
  const [message, setMessage] = useState();
  const [color, setColor] = useState();
  const [listening, setListening] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  const bg = document.querySelector("html");

  const handleClick = () => {
    recognition.start();
    setListening(true);
    console.log("Ready to receive a color command.");
  };

  recognition.onresult = (event) => {
    const color = event.results[0][0].transcript;
    setColor(color);
    setMessage(`Result received: ${color}`);
    setListening(false);
    bg.style.backgroundColor = color;
  };

  return (
    <div className="container">
      <button className="mic-button" onClick={handleClick}>
        <img
          src={process.env.PUBLIC_URL + "/mic.png"}
          className={`mic-image ${listening ? "animate" : ""}`}
          alt="Microphone"
        />
      </button>
      {message && <div className="message">{message}</div>}
      <textarea value={color} readOnly rows={1} />
    </div>
  );
};

export default Test;
