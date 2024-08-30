import { useDispatch, useSelector } from "react-redux";
import { onSelected } from "../store/insectSlice";
import { useNavigate } from "react-router-dom";
import React from "react";

type Data = {
  insectSelect: {
    insectSelected: string;
  }[];
  imagesData: { id: string; url: string; name: string }[];
  userName: { userName: string; duration: number }[];
  result: { score: number; time: number }[];
};

const CatchInsect = () => {
  const dispatch = useDispatch();
  const data = useSelector((item: { insect: Data }) => item.insect);
  const navigate = useNavigate();

  /*for image click handler */
  const imageHandler = (image: { id: string; url: string; name: string }) => {
    /*for dispatching the selected insect url */
    dispatch(
      onSelected({
        insectSelect: image?.url,
      })
    );
    navigate("/game");
  };

  return (
    <>
      <div>
        <h3>select Insect which you are interested </h3>
        <div>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              height: 200,
              width: 200,
              margin: 20,
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {data.imagesData?.map(
              (image: { id: string; url: string; name: string }) => (
                <li style={{ listStyleType: "none" }} key={image.id}>
                  <img
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      height: 200,
                      width: 200,
                      margin: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    key={image.id}
                    src={image.url}
                    alt={image.name}
                    id={image.id}
                    onClick={() => imageHandler(image)}
                  />
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
export default CatchInsect;
