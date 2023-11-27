// common pagination component for re-use on any of our lists

import React from 'react';
import '../style.css';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const nextPage = (event) => {
    event.preventDefault();
    if (currentPage < pageNumbers.length) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  return (
    <nav className="flex justify-center pb-2">
      <ul className='pagination'>
        <li className='page-item mr-1'>
          <a onClick={prevPage} href='!#' className={`px-2 py-2 border border-primary text-sm leading-none rounded ${currentPage === 1 ? 'disabled' : ''} hover:shadow-lg`}>
            Prev
          </a>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className='page-item mr-1'>
            <a 
              onClick={(event) => {
                event.preventDefault();
                paginate(number);
              }} 
              href='!#' 
              className={`px-2.5 py-2 border border-primary text-sm text-primary leading-none rounded ${currentPage === number ? 'bg-white' : 'bg-gray-50'} hover:shadow-lg`}
            >
              {number}
            </a>
          </li>
        ))}
        <li className='page-item mr-1'>
          <a onClick={nextPage} href='!#' className={`px-2 py-2 border border-primary text-sm leading-none rounded ${currentPage === pageNumbers.length ? 'disabled' : ''} hover:shadow-lg`}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;