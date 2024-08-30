import GSTForm from "./GSTForm";

export interface IGSTFormProps {
  getGstInformation: (_: string, __: string) => void;
  visable: boolean;
  onCloseModal: () => void;
  setIsGst: (_: number) => void;
  isEdit?: boolean
  currentBusinessName?: string;
  currentGstNumber?: string
}
export interface IGSTFormData {
  businessName: string;
  gstNumber: string;
}

export default GSTForm;
