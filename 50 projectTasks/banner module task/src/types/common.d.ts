export type ResetPasswordNavParams = {
    token: string
}

export type ColArrType = {
    name : string
    sortable : boolean
    fildName : string
}
export type ChangeStatusProps = {
    onClose: () => void;
    changeStatus: () => void;
  };

export type DeleteBannerProps={
    onClose:()=>void;
    deleteHandler:()=>void;
}