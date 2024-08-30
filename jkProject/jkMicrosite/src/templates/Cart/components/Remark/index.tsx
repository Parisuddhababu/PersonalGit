import IRemark1 from "@templates/Cart/components/Remark/remark-1";

export interface IRemarkView1Props {
  onClose: () => void;
  updateData: () => void;
  remark: string;
  cart_id: string;
  remarkId: string;
  isModal: boolean;
  remark_index: number;
}

export interface IRemark {
  remark: string;
}


export default IRemark1;
