// button to navigate to the award specific URL 

import React from 'react';
import LabelledButton from '../Buttons/LabelledButton';

export default function AwardsButton({ award }) {
  const to = `/award_templates/${award.award_template_id}`;
  console.log(to);

  return (
    <LabelledButton buttonText="Configure" to={to} />
  );
}