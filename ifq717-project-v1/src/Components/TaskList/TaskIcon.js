// icon in the task list, is represents either no or done depending on task state

import React from 'react';
import { ReactComponent as DoneIcon } from '../../svg/done.svg';
import { ReactComponent as IncompleteIcon } from '../../svg/no.svg';

export default function TaskIcon({ isComplete }) {
  const Icon = isComplete ? DoneIcon : IncompleteIcon;

  return <Icon />;
}