import { IsBrowser } from "@util/common";

interface InlineStyleProps {
  src: string;
}

const InlineStyle = (props: InlineStyleProps) => {
  if (IsBrowser) {
    return <link rel="stylesheet" type="text/css" href={props.src} />;
  }
  /* eslint-disable */
  const { readFileSync } = require("fs");
  const { join } = require("path");
  const paths = props.src.split("/").filter((p) => p);
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: readFileSync(join(process.cwd(), "public", ...paths), "utf-8"),
      }}
    />
  );
};

export default InlineStyle;
