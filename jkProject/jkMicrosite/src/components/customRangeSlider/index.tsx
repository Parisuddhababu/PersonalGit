export interface ICustomRangeProps {
  min: number;
  max: number;
  // eslint-disable-next-line
  onChange: (data: { min: number; max: number }) => void;
  currentApplyRange: {
    min: number;
    max: number;
  };
  setApplyClick: () => void;
  isDisplayApplyBtn?: boolean;
  resetFilterButton: () => void;
}
