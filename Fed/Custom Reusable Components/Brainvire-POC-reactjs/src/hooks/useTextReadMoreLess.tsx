import { useState } from "react";
import { TextTruncate, textReplacePWithSpan } from "../common/common";

export interface TextReadMoreLessProps {
  description: string;
  textData: string;
}

export const useTextReadMoreLess = ({
  description,
  textData,
}: TextReadMoreLessProps) => {
  const [trimText, setTrimText] = useState(TextTruncate(description, 135));
  const [buttonText, setButtonText] = useState("Read More");

  const textExpand = (e): string => {
    const ele = e.target;
    const preEle = document.querySelector<HTMLElement>(".read-less");

    if (buttonText === "Read More") {
      if (preEle) preEle.click();
      setTrimText(textReplacePWithSpan(textData));
      setButtonText("Read Less");
      ele.classList.add("read-less");
      return;
    }
    ele.classList.remove("read-less");
    setTrimText(TextTruncate(description, 135));
    setButtonText("Read More");
  };

  return {
    trimText,
    buttonText,
    textExpand,
  };
};
