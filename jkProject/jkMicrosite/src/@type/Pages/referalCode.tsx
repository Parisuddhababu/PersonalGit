
export interface IReferalCodeModel {
    referData : IReferData,
    toggleModal : () => void;
    toggleReferalModel : () => void;
    refralCode: string;
  }

export interface IReferData {
    they_get_discount : string,
    you_get_discount : string
}
  