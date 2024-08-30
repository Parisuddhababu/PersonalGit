export interface IMenuLinks {
    title: string;
    link: string;
}

export interface IFooterMenu {
    menu_header_title: string;
    is_default: number;
    menu_links: IMenuLinks[];
}

export interface IChildCategory {
    name: string;
    url: string;
}

export interface IParentCategory {
    name: string;
    url: string;
    child_category: IChildCategory[];
}

export interface IHeaderMenu {
    name: string;
    url: string;
    parent_category: IParentCategory[];
}

export interface IOurSolution {
    name: string;
    url: string;
}

export interface ISitemapMenu {
    footer_menus: IFooterMenu[];
    header_menus: IHeaderMenu[];
    our_solution: IOurSolution[];
    other_menus: IOurSolution[];
}

export interface ISitemapProps {
    sitemap: ISitemapMenu;
}