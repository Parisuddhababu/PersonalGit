import { IHomeOurBenefitsData } from "@type/Pages/home";
import OurBenifits1 from "./our-benifits-1";
export interface IOurBenifits1Props {
  data: IHomeOurBenefitsData[];
  dynamic_title:{
    our_benefit_title:string
  }
}

export default OurBenifits1;
