import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);

  //Add.........
  const imageSetHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesData = event.target.files!;
    for (let i = 0; i < filesData.length; i++) {
      if (
        (filesData[i].type === "image/png" ||
          filesData[i].type === "image/jpg" ||
          filesData[i].type === "image/jpeg") &&
        filesData[i].size < 2 * 1024 * 1024
      ) {
        setImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            url: URL.createObjectURL(filesData[i]),
          },
        ]);
      } else if (filesData[i].size > 2 * 1024 * 1024) {
        return alert("Size is Less than 2Mb");
      } else {
        return alert("Inavlid File");
      }
    }
  };

  //slider ..

  const [intialNumber, setNextNumber] = useState(0);

  const ImageSlideHandlerBack = () => {
    if (intialNumber === 0) {
      setNextNumber(images.length - 1);
    } else {
      setNextNumber((prev) => prev - 1);
    }
  };

  const ImageSlideHandlerNext = () => {
    if (intialNumber === images.length - 1) {
      setNextNumber(0);
    } else {
      setNextNumber((prev) => prev + 1);
    }
  };

  //PopUp Handler
  const [showPopUp, setShowPopUp] = useState(false);
  const popUpHandler = () => {
    setShowPopUp((prev) => !prev);
    console.log(showPopUp);
  };

  const Card = (
    <>
      <div>
        <button onClick={ImageSlideHandlerBack}>&#10094;</button>
        <img src={images[intialNumber].url} alt="" />
        <button onClick={ImageSlideHandlerNext}>&#10095;</button>

        <button onClick={popUpHandler}>Close</button>
      </div>
    </>
  );

  // Delete........
  const ImageDeleteHandler = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as Element;
    return setImages((prevState) =>
      prevState.filter((deleteID) => deleteID.id !== target.id)
    );
  };
  //Main Function
  return (
    <>
      <div className="inputContainer">
        <h1>Upload Multiple Images</h1>
        <label htmlFor="file"> choose file</label>
        <br />
        <input
          type="file"
          id="file"
          accept="image/*"
          multiple
          onChange={imageSetHandler}
        ></input>
      </div>
      {!showPopUp &&
        images.map((image) => (
          <div className="imagesContainer" key={image.id}>
            <img
              src={image.url}
              key={image.id}
              className="images"
              onClick={popUpHandler}
              alt=""
            />
            <button id={image.id} onClick={ImageDeleteHandler}>
              Delete
            </button>
          </div>
        ))}

      {showPopUp && Card}
    </>
  );
};

export default App;
