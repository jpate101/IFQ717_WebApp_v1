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
    if (currentPage >= pageNumbers.length) return;
    paginate(currentPage + 1);
  };

  const prevPage = (event) => {
    event.preventDefault();
    if (currentPage <= 1) return;
    paginate(currentPage - 1);
  };

  return (
    <nav className="flex justify-center pb-2">
      <ul className='flex'>
        <li className='mr-1'>
          {currentPage > 1 && <a onClick={prevPage} href='!#' className='px-2 py-1 underline text-primary text-sm font-medium'>Prev</a>}
          {currentPage === 1 && <span className='px-2 py-1 text-accent text-sm font-medium'>Prev</span>}
        </li>
        {pageNumbers.map(number => (
          <li key={number} className='mr-1'>
            {currentPage !== number && <a onClick={(event) => {event.preventDefault(); paginate(number);}} href='!#' className='px-2 py-1 underline text-primary text-sm font-medium'>{number}</a>}
            {currentPage === number && <span className='px-2 py-1 text-accent text-sm font-medium'>{number}</span>}
          </li>
        ))}
        <li className='mr-1'>
          {currentPage < pageNumbers.length && <a onClick={nextPage} href='!#' className='px-2 py-1 underline text-primary text-sm font-medium'>Next</a>}
          {currentPage === pageNumbers.length && <span className='px-2 py-1 text-accent text-sm font-medium'>Next</span>}
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;