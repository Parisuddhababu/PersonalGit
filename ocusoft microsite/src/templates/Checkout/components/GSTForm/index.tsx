import GSTForm from "@templates/Checkout/components/GSTForm/GSTForm";

export interface IGSTFormProps {
  getGstInformation: (_: string, __: string) => void;
  visable: boolean;
  onCloseModal: () => void;
  setIsGst: (_: number) => void;
  isEdit?: boolean
  currentBusinessName: string | undefined;
  currentGstNumber: string | undefined
}
export interface IGSTFormData {
  businessName: string;
  gstNumber: string;
}

export default GSTForm;
