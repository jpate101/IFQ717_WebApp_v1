import React from 'react';
import ClockInUserGrid from './ClockInUserGrid';
import DynamicBanner from '../Components/DynamicBanner';
import RocketIcon from '../Components/Icons/RocketIcon';
import '../style.css';

function ClockIn() {
  return (
    <>
    <DynamicBanner text="Manage employee clockins" Icon={RocketIcon} />
     <div className="clockin-container mx-auto px-4">
      <ClockInUserGrid /> 
    </div>
    </>
  );
}

export default ClockIn;