// button to navigate to the award specific URL 

import React from 'react';
import LabelledButton from '../Buttons/LabelledButton';
import { enableAward } from '../../API/Utilities.js'
import { useState } from 'react';
import '../../App.css';
import '../../style.css';

//TODO: handle button updated successfully!

export default function AwardsButton({ award, setIsAwardEnabled, setAwardButtonError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const awardTemplateId = award.award_template_id;

  const handleClick = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await enableAward(awardTemplateId);
      console.log('clicked');
      if (response.status === 201) {
        setIsAwardEnabled(true);
      }
    } catch (error) {
      console.error(error);
      setIsAwardEnabled(false);
      setIsError(true); 
      if (error.response && error.response.status === 400) {
        setAwardButtonError(error.response.data.error);
      } else {
        setAwardButtonError('Award failed to enable. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LabelledButton
      className={isError ? "award-button decline-button" : "award-button approve-button"}
      buttonText={isLoading ? "Loading..." : isError ? "Retry" : "Enable"}
      onClick={handleClick}
      isError={isError} 
    />
  );

}