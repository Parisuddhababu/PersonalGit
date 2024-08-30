import { GET_ALL_SOCIAL_CONNECTIONS } from "../graphql/queries/myProfile";
import { useQuery } from "@apollo/client";
import useLoadingAndErrors from "./useLoadingAndErrors";
import { IActivePlatforms, IPlatformDetails } from "@/types/hooks";

const useGetActiveSocialPlatform = () => {
  const { data, loading, error } = useQuery(GET_ALL_SOCIAL_CONNECTIONS);
  useLoadingAndErrors([loading], [error]);

  const getActiveSocialPlatform = () => {
    let activePlatformList: IActivePlatforms = {};

    if (!data?.getAllSocialConnections?.data) return;

    data?.getAllSocialConnections?.data.forEach((platform: IPlatformDetails) => {
      activePlatformList = {
        ...activePlatformList,
        [platform.connection_name]: platform.status === "1",
      };
    });
    return activePlatformList;
  };

  return {
    activePlatformList: getActiveSocialPlatform(),
  };
};

export default useGetActiveSocialPlatform;
