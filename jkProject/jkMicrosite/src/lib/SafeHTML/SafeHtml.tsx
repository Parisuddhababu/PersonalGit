import { ISafeHTMLProps } from "@lib/SafeHTML";
import { useEffect, useState } from "react";

/**
 * @name : Safe HTML
 * @description : A React component that will sanitize user-inputted HTML code,
 */
const SafeHtml = (props: ISafeHTMLProps) => {
  const [renderHTML, setRederHTML] = useState<string>("");

  useEffect(() => {
    setRederHTML(props?.html ?? "");
  }, [props?.html]);

  useEffect(() => {
    if (!renderHTML) {
      return;
    }
    if (props.removeAllTags) {
      removeAllHTMLTags();
    }
    // eslint-disable-next-line
  }, [props.removeAllTags]);

  const removeAllHTMLTags = () => {
    const regexForStripHTML = /<\/?[^>]+(>|$)/gi;
    const text = renderHTML;
    const clearContent = text.replaceAll(regexForStripHTML, "");
    setRederHTML(clearContent);
  };

  return renderHTML ? (
    <p
      className={props.className ? props.className : ""}
      dangerouslySetInnerHTML={{ __html: renderHTML ? renderHTML : "" }}
    />
  ) : (
    <></>
  );
};

export default SafeHtml;
