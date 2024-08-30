import { BannerData, MetaRes } from '@framework/graphql/graphql';

export type CreateBanner = {
  bannerTitle: string;
  bannerImage: string;
  status: number | null;
  createdBy: string;
};
export type UpdateBanner = {
  updateBanner: {
    data: BannerData;
    meta: MetaRes;
  };
};
export type bannerPagination = {
  page: number;
  limit: number;
  bannerTitle: string;
  createdBy: string;
  status: number | null;
  sortBy: string;
  sortOrder: string;
};
export type FilterBannerProps = {
  bannerTitle: string;
  createdBy: string;
  status: string;
};

export type BannerProps = {
  onSearchBanner: (value: FilterBannerProps) => void;
  clearSelectionBanner:()=>void
};
export type BannerChangeProps = {
  onClose: () => void;
  changeBannerStatus: () => void;
};
