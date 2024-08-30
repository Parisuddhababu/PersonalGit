import Button from '@components/button/button';
import { AngleLeftIcon, AngleRightIcon } from '@components/icons/icons';
import React, { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number, newRecordsPerPage?: number) => void;
  recordsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };
  const renderPageNumbers = () => {
    const maxDisplayedPages = 3;
    const pageNumbers = [];

    const leftPageBoundary = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    const rightPageBoundary = Math.min(totalPages, leftPageBoundary + maxDisplayedPages - 1);

    for (let i = leftPageBoundary; i <= rightPageBoundary; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handlePageClick(pageNumber)}
        className={`mx-[9px] h-9 w-9 text-center border border-solid border-border-primary cursor-pointer rounded-xl box-border ${pageNumber === currentPage ? 'bg-primary text-white border border-solid border-transparent ' : ''}`}
      >
        {pageNumber}
      </button>
    ));
  };

  const handlePrevPageClick = useCallback(() => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  }, [currentPage]);

  const handleNextPageClick = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const pageClass = currentPage === totalPages ? 'text-secondary bg-transparent [&>div]:text-gray-800' : '[&>div]:text-white';

  return (
    <div className="pagination">
      <div className="flex mt-[10px] mb-2 items-center">
        <Button
          onClick={handlePrevPageClick}
          disabled={currentPage === 1}
          className={`mr-[9px] p-[10px] border border-solid border-border-primary bg-primary rounded-xl ${pageClass}`} label={''} title='Previous'>
          <div>
            <AngleLeftIcon fontSize='14' />
          </div>
        </Button>
        <div className='flex'>
          {renderPageNumbers()}
        </div>
        <Button
          onClick={handleNextPageClick}
          disabled={currentPage === totalPages}
          className={`ml-[9px] p-[10px] border border-solid border-border-primary bg-primary rounded-xl ${pageClass}`} label={''} title='Next'>
          <div>
            <AngleRightIcon fontSize='14' />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
