// EmployeeAwardsButton.js (TODO: style better)

import React from 'react';
import LabelledButton from '../Buttons/LabelledButton';
import addAwardToEmployee  from '../../API/Utilities/addAwardToEmployee'; 
import { useState, useEffect } from 'react';
import '../../Compliance/compliance.css';

export default function EmployeeAwardsButton({ employee, setIsAwardAdded, setAwardAddError, isEditable, originalAwardId, isDisabled }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const employeeId = employee.id;
    const awardId = employee.award_template_id; 
    const [buttonText, setButtonText] = useState('Assign');

    useEffect(() => {
        setIsChanged(originalAwardId !== awardId);
        setIsLocked(originalAwardId !== null);
      }, [awardId, originalAwardId]);

    useEffect(() => {
        setButtonText('Assign');
      }, [awardId]);
    

  const handleClick = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const { status, body } = await addAwardToEmployee(employeeId, awardId);
      console.log('heres my status', status);
      console.log(status);
      if (status === 200) {
        console.log('award assigned to employee');
        setButtonText('Assigned');
        setIsAwardAdded(true);
        setIsLocked(true);
      }
    } catch (error) {
      console.error('hey this is the error', error);
      setIsAwardAdded(false);
      setIsError(true);
      setButtonText('Retry');
      if (error.response) {
        if ([400, 401, 500].includes(error.response.status)) {
          setAwardAddError('Award assignment failed. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LabelledButton 
    className={isError ? "employee-award-button decline-button" : isDisabled || isLoading ? "employee-award-button disabled-button" : "employee-award-button approve-button"}
      buttonText={isLoading ? "Loading..." : buttonText} 
      onClick={handleClick} 
      disabled={isDisabled || isLoading} 
      isError={isError}
    />
  );
}