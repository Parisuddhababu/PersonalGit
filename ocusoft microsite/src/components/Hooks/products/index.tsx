import { IListProductProps } from "@templates/ProductList";
import { ICurrentFilterProps } from "@templates/ProductList/components/CurrentFilter";
import { IFilterSection1Props } from "@templates/ProductList/components/FilterSection";
import { IImage } from "@type/Common/Base";

export interface IUseProductFilterProps extends IFilterSection1Props {}

export interface IUseProductListFilterProps extends IListProductProps {}

export interface IUseProductListCurrentFilterProps extends ICurrentFilterProps {}

export interface IUseProductQuickViewProps {
  slug: string;
}

export interface ICustomImageSilderProps {
  images: IImage[] | [];
}

export interface IUsePaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}
