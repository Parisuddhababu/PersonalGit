export type paginationProps = {
	pageCount: number;
	onPageChange: (selectedItem: { selected: number }) => void;
	currentPage: number;
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
};
