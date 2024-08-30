import { NextIcon, PreviousIcon } from '@components/icons';
import React from 'react';
import ReactPaginate from 'react-paginate';
import { paginationProps } from 'src/types/pagination';

const Pagination = ({ pageCount, onPageChange, currentPage, hasPreviousPage, hasNextPage }: paginationProps) => {
	// first page navigating  handler
	const handleFirstPageClick = () => {
		if (currentPage !== 1) {
			onPageChange({ selected: 0 });
		}
	};
	// last page navigating handler
	const handleLastPageClick = () => {
		if (currentPage !== pageCount) {
			onPageChange({ selected: pageCount - 1 });
		}
	};

	return (
		<div className='flex items-center'>
			{/* for first page  */}
			<button className={`btn sm:h-6 sm:w-7 mx-1 ${hasPreviousPage ? '' : 'text-[#BDC0D4] disabled'}`} onClick={handleFirstPageClick} disabled={!hasPreviousPage}>
				<PreviousIcon />
			</button>
			{/* for pagination  */}
			<ReactPaginate containerClassName='flex justify-center items-center ' pageLinkClassName='btn mx-1' activeLinkClassName='btn btn-primary' previousClassName={`btn btn-default w-14 h-8 m-auto  text-center ${hasPreviousPage ? '' : ' disabled'}`} previousLinkClassName={`btn mx-1${hasPreviousPage ? '' : ' disabled'}`} nextClassName={`btn btn-default w-14 h-8 text-center ${hasNextPage ? '' : ' disabled'}`} nextLinkClassName={`btn mx-1  ${hasNextPage ? '' : ' disabled'}`} breakLabel='...' nextLabel='>' onPageChange={onPageChange} pageRangeDisplayed={1} pageCount={pageCount} forcePage={currentPage - 1} previousLabel='<' renderOnZeroPageCount={null} />
			{/* for last page  */}
			<button className={`btn mx-1 sm:h-6 sm:w-7 ${hasNextPage ? '' : 'text-[#BDC0D4] disabled'}`} onClick={handleLastPageClick} disabled={!hasNextPage}>
				<NextIcon />
			</button>
		</div>
	);
};

export default Pagination;
