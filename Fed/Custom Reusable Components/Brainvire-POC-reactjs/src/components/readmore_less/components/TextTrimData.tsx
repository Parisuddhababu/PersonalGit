import { UseHandleWindowResizer } from "../../../hooks/useHandleWindowResizer";
import { TextTrimDataProps } from "../index";
import { useTextReadMoreLess } from "../../../hooks/useTextReadMoreLess";
import { textReplacePWithSpan } from "../../../common/common";
import { useEffect, useState } from "react";

const TextTrimData = (props: TextTrimDataProps) => {
  const [shouldDisplay, setShouldDisplay] = useState(window.innerWidth > 767);

  const { textData } = props;

  const description = textReplacePWithSpan(textData);
  const { isMobile } = UseHandleWindowResizer();
  const { textExpand, trimText, buttonText } = useTextReadMoreLess({
    description,
    textData,
  });

  useEffect(() => {
    const handleResize = () => {
      setShouldDisplay(window.innerWidth > 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="services-offering-item-content">
      <div>
        <span
          dangerouslySetInnerHTML={{
            __html: isMobile ? textReplacePWithSpan(textData) : trimText,
          }}
        />
        &nbsp;
        {shouldDisplay && (
          <span className="btn-link" onClick={textExpand}>
            {buttonText}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextTrimData;
