// Set headers for use on the Tanda API, requiring token. 

import GetToken from './GetToken';

const setHeaders = () => {
  const token = GetToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export default setHeaders;