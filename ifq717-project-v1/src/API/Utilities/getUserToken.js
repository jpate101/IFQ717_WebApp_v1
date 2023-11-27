// Fetch the token from the cookie

function getUserToken() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
    return token;
  }
  
  export default getUserToken;