import { IBaseTemplateProps } from "@templates/index";
import { IHome } from "@type/Pages/home";
import AppHome from "./app-home";
import { SlugInfoProps } from "@components/Meta";

export interface IAppHome extends IBaseTemplateProps, IHome {
    slugInfo?: SlugInfoProps;
}

export default AppHome;
