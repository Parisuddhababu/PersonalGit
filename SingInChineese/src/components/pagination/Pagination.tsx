import TotalRecords from '@components/totalRecords/totalRecords';
import { DEFAULT_PAGINATION_LIMIT } from '@config/constant';
import React from 'react';
import ReactPaginate from 'react-paginate';
import { PaginationProps } from 'src/types/component';

const Pagination = ({ length, onSelect, limit, page }: PaginationProps) => {
	return (
		<div className='flex items-center justify-between mt-8 max-md:flex-col max-md:items-start'>
			<TotalRecords length={length} />
			{length > limit && <ReactPaginate containerClassName='flex items-center' pageLinkClassName='btn mx-1' activeLinkClassName='btn btn-primary' previousLinkClassName='btn btn-default mr-3' disabledClassName='hidden' nextLinkClassName='btn btn-default ml-3' breakLabel='...' nextLabel='Next' onPageChange={onSelect} pageRangeDisplayed={DEFAULT_PAGINATION_LIMIT} pageCount={Math.ceil(length / limit)} previousLabel='Previous' renderOnZeroPageCount={null} forcePage={page} />}
		</div>
	);
};

export default Pagination;
