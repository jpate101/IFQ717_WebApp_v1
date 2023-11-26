// AwardList.js
import React, { useEffect, useState } from 'react';
import Award from './Award';
import { getAwards } from '../../API/Utilities.js';
import usePagination from '../../Hooks/usePagination';
import Pagination from '../Pagination.js';

const AwardList = () => {
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [currentItems, totalItems, setCurrentPage, currentPage] = usePagination(awards, itemsPerPage);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const fetchedAwards = await getAwards();
        const enabled = fetchedAwards.filter(award => award.award_template_organisation_id !== null);
        const available = fetchedAwards.filter(award => award.award_template_organisation_id === null);
        setAwards([...enabled, ...available]); 
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
  
    fetchAwards();
  }, []);

  return (
    <div className="flex flex-col mt-4 overflow-hidden align-items-center">
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error.message}</div>}
      {!isLoading && !error && (
        <div className="w-full">
          {currentItems.map((award) => (
            <Award key={award.award_template_id} award={award} />
          ))}
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AwardList;