import useOrderSettingHooks from "@components/Hooks/OrderSettings/useOrderSettingsHook";

export interface IOrderSetting {
    code: string;
    name: string;
}
export interface IOrderSettingsHooksState {
    max_cod_amount: number;
    order_status: IOrderSetting[];
    payment_method: IOrderSetting[];
}

export default useOrderSettingHooks;
