// List of employees and their awards, with capability to add new award or change award.
// TODO: refactor, break into components

import { Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { getUsers, getAwards } from '../../API/Utilities.js';
import usePagination from '../../Hooks/usePagination';
import Pagination from '../Pagination.js';
import Unlock from '../Icons/Unlock.js';
import EmployeeAwardsButton from './EmployeeAwardsButton.js';
import '../../style.css';
import '../../App.css';

const EmployeeAwardsList = () => {
  const [employees, setEmployees] = useState([]);
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState({});
  const itemsPerPage = 20;
  const [awardButtonError, setAwardButtonError] = useState(null);
  const [isAwardAdded, setIsAwardAdded] = useState(false);
  const [awardAddError, setAwardAddError] = useState(null);
  const [currentItems, totalItems, setCurrentPage, currentPage] = usePagination(employees, itemsPerPage, setAwardButtonError);
  const [isUnlocked, setIsUnlocked] = useState({});
  
  useEffect(() => {
    getUsers().then(retrievedUsers => {
        retrievedUsers.sort((a, b) => a.name.localeCompare(b.name)); // Order by name, descending
        retrievedUsers = retrievedUsers.map(user => ({ ...user, original_award_template_id: user.award_template_id }));
        setEmployees(retrievedUsers);
        setIsLoading(false);
        const initialEditableState = retrievedUsers.reduce((state, user) => {
          state[user.id] = !(user.award_template_id && user.award_template_id === user.original_award_template_id);
          return state;
        }, {});
        setIsEditable(initialEditableState);
      }).catch(error => {
        setError(error);
        setIsLoading(false);
      });
    
    getAwards().then(retrievedAwards => {
      const enabledAwards = retrievedAwards.filter(award => award.award_template_organisation_id !== null);
      setAwards(enabledAwards);
    }).catch(error => {
      //TODO: ccheck error handling. 
    });
  }, []);

  const handleUnlock = (event, employeeId) => {
    console.log('unlock clicked')
    event.preventDefault();
    setIsAwardAdded(false); 
    setIsEditable(prevState => ({ ...prevState, [employeeId]: true }));
    setIsUnlocked(prevState => ({ ...prevState, [employeeId]: true })); // Set isUnlocked to true
  };

  const handleAwardChange = (employeeId, awardTemplateId) => {
    // Find and update employee and their award
    const employeeIndex = employees.findIndex(employee => employee.id === employeeId);
    if (employeeIndex !== -1) {
      const updatedEmployees = [...employees];
      updatedEmployees[employeeIndex] = {
        ...updatedEmployees[employeeIndex],
        award_template_id: awardTemplateId
      };
      setEmployees(updatedEmployees);
      // Make the dropdown uneditable again
      setIsEditable(prevState => ({ ...prevState, [employeeId]: false }));
    }
  };

  return (
    <div className="bg-white w-full flex flex-col mt-4 overflow-hidden align-items-center" style={{ padding: '0 0.5rem 0.5rem 0.5rem', fontSize: '0.8rem' }}>
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error.message}</div>}
      {!isLoading && !error && (
        <div className="w-full">
          {currentItems.map(employee => (
            <div key={employee.id} className="flex items-center justify-between">
              <div style={{ flex: '3' }}>{employee.name}</div> 
              <div style={{ flex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'right' }}> 
              <Dropdown className="compliance-custom-dropdown-height" 
              disabled={!isEditable[employee.id]}
              key={isEditable[employee.id]}
              >
    <Dropdown.Toggle 
  className="custom-dropdown compliance-custom-dropdown-button-height compliance-custom-button-color truncate" 
  style={{ textAlignLast: 'right', width: '145%' }}
  disabled={employee.award_template_id != null && !isUnlocked[employee.id]} // Disable the dropdown toggle when an award is assigned and it's not unlocked
>
  {
    (() => {
      const award = awards.find(award => award.award_template_id === employee.award_template_id);
      return award ? award.name : 'Assign an award';
    })()
  }
</Dropdown.Toggle>
                    <Dropdown.Menu>
                {awards.map(award => (
                    award && 
                    <Dropdown.Item 

                    key={award.award_template_id} 
                    onClick={() => handleAwardChange(employee.id, award.award_template_id)}
                >
                    {award.name}
                </Dropdown.Item>
                            ))}
                 </Dropdown.Menu>
                 </Dropdown>
                </div>
                <div style={{ flex: '0.15', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                {employee.award_template_id != null && !isUnlocked[employee.id] && (
  <a href="#" onClick={(event) => handleUnlock(event, employee.id)}>
    <Unlock size="20" alt="unlock icon" />
  </a>
)}
                <EmployeeAwardsButton 
                    employee={employee} 
                    setIsAwardAdded={setIsAwardAdded} 
                    setAwardAddError={setAwardAddError} 
                    isEditable={isEditable[employee.id]}
                    originalAwardId={employee.original_award_template_id}
                    isDisabled={employee.award_template_id && employee.award_template_id === employee.original_award_template_id && !isUnlocked[employee.id]}
                    isAwardAdded={isAwardAdded} 
                    />
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4">
          <Pagination itemsPerPage={itemsPerPage} totalItems={totalItems} paginate={setCurrentPage} currentPage={currentPage} />
        </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAwardsList;