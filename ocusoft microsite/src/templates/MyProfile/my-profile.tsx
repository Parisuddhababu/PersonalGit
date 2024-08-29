import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { getComponents } from "@templates/MyProfile/components/index";
import { IMyProfileMain } from "@templates/MyProfile/index";

const MyProfile = (props: IMyProfileMain) => {
  // const [type] = useState(props?.data?.user_account_details_type ?? 1)
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
  }, []);

  return (
    <main>
      {props.sequence?.map((ele) =>
        getComponents(
          "1",
          ele,
          props?.data?.[ele]?.[0]
        )
      )}
    </main>
  );
};

export default MyProfile;
