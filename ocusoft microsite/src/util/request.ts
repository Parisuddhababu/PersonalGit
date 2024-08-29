import { IQuerySlugProps } from "@type/Common/PageService";
interface IParamsState {
  slug: string;
  technology: string;
  industry: string;
  region: string;
  canonical: string;
}

const RequestParams = (query: IQuerySlugProps) => {
  const params = {
    slug: "",
    technology: "",
    industry: "",
    region: "",
    canonical: "",
  } as IParamsState;

  if (query["slug"] === "portfolio" || query["slug"] === "case-study") {
    params.technology = (query["query"] as string) ?? "";
    params.region = (query["param1"] as string) ?? "";
    params.industry = (query["param2"] as string) ?? "";
  }

  if (params.industry === "all" && params.region === "all" && params.technology === "all") {
    params.canonical = "yes";
  }

  Object.keys(params).forEach((key) => {
    const value: string = params[key as keyof IParamsState];
    if (value === "all") params[key as keyof IParamsState] = "";
  });

  return params;
};

export default RequestParams;