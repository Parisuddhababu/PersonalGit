import { ILink } from "@type/Common/Base";

export interface IWhyUs {
  para1: string;
  para2: string;
  para3: string;
  link: ILink;
}

export interface IAbout {
  description: string;
  description2: string;
  whyUs: IWhyUs;
  image: string;
}
