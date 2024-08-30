import { PaginationProps } from '@/types/components';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Pagination: React.FC<PaginationProps> = ({ totalPages, onPageChange, filterPage, pageSelectHandler, totalIteamCount,htmlElements }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        setCurrentPage(filterPage ?? 1)
    }, [totalPages,filterPage])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
            setCurrentPage(newPage)
        }
    };

    const generatePagination = () => {
        const pages: JSX.Element[] = [];
        
        // Display the previous page button
        pages.push(
            <div key="prev" className='prev'>
                <Link href="" aria-label="previous page button" onClick={() => handlePageChange(currentPage - 1)}
                    className={`arrowIcon ${currentPage === 1 ? 'disabled' : ''}`}> <span className="icon-left"></span></Link>
            </div>
        );
        
        //generate only current page
        const pageItem = (
            <Link href="" aria-label="current page" onClick={() => handlePageChange(currentPage)}
                key={currentPage} className={'active'}>
                <span className="pageNum">  {currentPage}</span>
            </Link>
        );
        pages.push(pageItem);

        // Display the next page button
        pages.push(
            <div key="next" className='next'>
                <Link href="" onClick={() => handlePageChange(currentPage + 1)} aria-label="next page button" className={`arrowIcon ${currentPage === totalPages ? 'disabled' : ''}`}><span className="icon-right"></span></Link>
            </div>
        );
        return pages;

    };
    
    return (
        <div className="table-pagination table-pagination-with-button">
          <div className="paginationList">
            <div className="pagination-form-group">
              <div className="form-group-page">
                <div className="select-group">
                  <span className="icon-down"></span>
                  <select className="form-control small" onChange={pageSelectHandler} aria-label="Select Option">
                    <option value={10} selected>
                      10
                    </option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <span className="pageText">Per Page</span>
                <span className="pageDesc">{totalIteamCount} Items Listed</span>
              </div>
            </div>
          </div>
          {htmlElements ?? <></>}
          <div className="PaginationNav">
            <div className="pageNav">{generatePagination()}</div>
          </div>
          
        </div>
    ); 
};

export default Pagination;
