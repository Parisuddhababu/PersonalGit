import { useEffect, useState } from 'react';

interface PaginationProps {
    totalPages: number;
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        setCurrentPage(1)
    }, [totalPages])

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
            <li key="prev" className='prev'>
                <a onClick={() => handlePageChange(currentPage - 1)}>
                    <em className="osicon-cheveron-down"></em>
                </a>
            </li>
        );

        // Generate page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = (
                <li>
                    <a onClick={() => handlePageChange(i)}
                        key={i} className={currentPage === i ? 'active' : ''}>
                        {i}
                    </a>
                </li>
            );

            pages.push(pageItem);
        }

        // Display the next page button
        pages.push(
            <li key="next" className='next'>
                <a onClick={() => handlePageChange(currentPage + 1)}>
                    <em className="osicon-cheveron-down"></em>
                </a>
            </li>
        );

        return pages;
    };

    return (
        <div className="pagination-wrap">
            <ul className="product-pagination">
                {generatePagination()}
            </ul>
        </div>
    );
};

export default Pagination;
