// List of employees, and their awards, with capability to set or change their award. 
import React, { useEffect, useState } from 'react';
import EmployeeAward from './EmployeeAward.js';
import { getUsers } from '../../API/Utilities.js';
import usePagination from '../../Hooks/usePagination';
import Pagination from '../Pagination.js';

const EmployeesAwardsList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [currentItems, totalItems, setCurrentPage, currentPage] = usePagination(users, itemsPerPage);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        console.log('Fetched users:', fetchedUsers);
        setUsers(fetchedUsers); 
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col mt-4 overflow-hidden align-items-center">
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error.message}</div>}
      {!isLoading && !error && (
        <div className="w-full">
          {currentItems.map((user) => (
            <EmployeeAward key={user.id} employee={user} />
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

export default EmployeesAwardsList;