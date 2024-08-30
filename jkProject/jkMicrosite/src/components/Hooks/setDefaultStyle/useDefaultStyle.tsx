// import { setDynamicDefaultStyle } from "@util/common";

import { IRootColor } from "@type/Common/Base";

const useDefaultStyle = () => {
  const setRootDefaultStyle = (default_style: IRootColor, theme: string) => {
    if (default_style || theme) {
      // TODO: Once Data was final need to un-comment
      // setDynamicDefaultStyle(default_style, theme);
    }
  };

  return { setRootDefaultStyle };
};

export default useDefaultStyle;
