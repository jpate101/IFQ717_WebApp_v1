// Modelling the Employee Award entry for the list
import React from 'react';

const EmployeeAward = ({ employee }) => {
  return (
    <div className="bg-white w-full" style={{ padding: '0 0.5rem 0.5rem 0.5rem', fontSize: '0.8rem' }}>
      <div className="flex items-start gap-2"> 
        <div style={{ flex: '3' }}>{employee.name}</div>
        <div style={{ flex: '1.5', textAlign: 'right' }}>
          Award ID: {employee.award_template_id}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAward;