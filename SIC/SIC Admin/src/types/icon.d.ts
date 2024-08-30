export type IconSvg = {
	className?: string;
	fontSize?: string;
	ref?: (node: HTMLElement | null) => void;
	style?: DragStyle;
};

export type DragStyle = {
	transition: string | undefined;
	transform: string | undefined;
};
