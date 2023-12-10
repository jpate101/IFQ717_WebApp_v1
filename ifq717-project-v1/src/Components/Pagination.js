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
      <ul className='flex'>
        <li className='mr-1'>
          <a onClick={prevPage} href='!#' className={`px-2 py-1 ${currentPage === 1 ? 'text-accent' : 'underline text-primary'}`}>
            Prev
          </a>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className='mr-1'>
            <a 
              onClick={(event) => {
                event.preventDefault();
                paginate(number);
              }} 
              href='!#' 
              className={`px-2 py-1 ${currentPage === number ? 'text-accent' : 'underline text-primary'}`}
            >
              {number}
            </a>
          </li>
        ))}
        <li className='mr-1'>
          <a onClick={nextPage} href='!#' className={`px-2 py-1 ${currentPage === pageNumbers.length ? 'text-accent' : 'underline text-primary'}`}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;