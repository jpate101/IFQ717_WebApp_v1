// button to navigate to the award specific URL 

import React from 'react';
import LabelledButton from '../Buttons/LabelledButton';
import { enableAward } from '../../API/Utilities.js'
import { useState } from 'react';

//TODO: handle button updated successfully!

export default function AwardsButton({ award, setIsAwardEnabled, setAwardButtonError }) {
  const [isLoading, setIsLoading] = useState(false);
  const awardTemplateId = award.award_template_id;

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await enableAward(awardTemplateId);
      console.log('clicked');
      if (response.status === 201) {
        setIsAwardEnabled(true);
      }
    } catch (error) {
      console.error(error);
      setIsAwardEnabled(false);
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
    <LabelledButton buttonText={isLoading ? "Loading..." : "Enable"} onClick={handleClick} />
  );
}