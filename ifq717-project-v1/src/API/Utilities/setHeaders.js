// Set headers for use on the Tanda API, requiring token. 

import getUserToken from './getUserToken';

const setHeaders = () => {
  const token = getUserToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export default setHeaders;