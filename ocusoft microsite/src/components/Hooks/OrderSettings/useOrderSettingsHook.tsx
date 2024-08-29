import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { useEffect, useState } from "react";
import { IOrderSettingsHooksState } from "@components/Hooks/OrderSettings/index";

const useOrderSettingHooks = () => {
  const [orderSettingData, setOrderSettingData] = useState<IOrderSettingsHooksState | null>(null);

  useEffect(() => {
    getOrderSettingData();
  }, []);

  const getOrderSettingData = async () => {
    await pagesServices.getPage(APICONFIG.ORDER_SETTING_DATA, {}).then((res) => {
      if (res?.meta?.status_code === 200) {
        setOrderSettingData(res?.data);
      }
    });
  };
  return orderSettingData;
};

export default useOrderSettingHooks;
