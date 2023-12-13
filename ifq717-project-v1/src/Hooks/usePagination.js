// standard pagination available for re-use on any list

import { useState, useEffect } from 'react';

const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(items.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, items, itemsPerPage]);

  const totalItems = items.length;

  const setCurrentPageNo = (pageNumber) => {
    //setAwardButtonError(null); // used for clearing erros on compliance list when changing pagination but causes error. 
    setCurrentPage(pageNumber);
  };

  return [currentItems, totalItems, setCurrentPageNo, currentPage]; 
};

export default usePagination;