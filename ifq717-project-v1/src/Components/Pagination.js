// common pagination component for re-use on any of our lists

import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center pb-2">
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item mr-1'>
            <a 
              onClick={(event) => {
                event.preventDefault();
                paginate(number);
              }} 
              href='!#' 
              className={`px-4 py-2 border border-primary text-sm leading-none rounded ${currentPage === number ? 'bg-white' : 'bg-gray-50'} hover:shadow-lg`}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;