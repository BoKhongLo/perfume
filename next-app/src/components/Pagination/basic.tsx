import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="join">
      <button
        className="join-item btn"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        «
      </button>
      <button className="join-item btn">
        Page {currentPage}
      </button>
      <button
        className="join-item btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
