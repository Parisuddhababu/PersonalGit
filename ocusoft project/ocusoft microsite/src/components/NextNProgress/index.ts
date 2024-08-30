import NextNProgress from "@components/NextNProgress/NextNProgress";

export interface INextNProgressProps {
  color?: string;
  startPosition?: number;
  stopDelayMs?: number;
  options?: object;
  height?: string;
}

export default NextNProgress;
