import { IsBrowser } from "@util/common";

interface InlineScriptProps {
  src: string;
}

const InlineScript = (props: InlineScriptProps) => {
  if (IsBrowser) {
    return <script src={props.src} async={true} />;
  }
  /* eslint-disable */
  const { readFileSync } = require("fs");
  const { join } = require("path");
  const paths = props.src.split("/").filter((p) => p);

  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: readFileSync(join(process.cwd(), "public", ...paths), "utf-8"),
      }}
    />
  );
};

export default InlineScript;
