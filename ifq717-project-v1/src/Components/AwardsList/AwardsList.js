// AwardList.js
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { getAwards } from '../../API/Utilities.js';
import Award from './Award';
import usePagination from '../../Hooks/usePagination';
import Pagination from '../Pagination.js';

const AwardList = () => {
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [awardButtonError, setAwardButtonError] = useState(null);
  const itemsPerPage = 10;
  const [currentItems, totalItems, setCurrentPage, currentPage] = usePagination(awards, itemsPerPage, setAwardButtonError);

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
      {awardButtonError && (
        <Alert variant="danger" className="w-full text-center">
          {awardButtonError}
        </Alert>
      )}
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error.message}</div>}
      {!isLoading && !error && (
        <div className="w-full">
          {currentItems.map((award, index) => (
            <Award key={award.award_template_id} award={award} setAwardButtonError={setAwardButtonError} isFirst={index === 0} />
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