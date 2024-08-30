
export interface IInviteLinkModel {
    referData : IReferData,
    toggleModal : () => void;
  }

export interface IReferData {
    they_get_discount : string,
    you_get_discount : string
}
  