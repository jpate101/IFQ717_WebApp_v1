import React, { useState } from 'react';

export default function Home() {
  const [isLoggedIn] = useState(
    localStorage.getItem('token') ? true : false
  );
  console.log(isLoggedIn);
  return (
    <main className="flex-grow-1">
      <div>Home. A placeholder for the home page. </div>
      <div>
        The Home page is currently available to both logged in and non logged
        in users.
      </div>
      <div>The state of isLoggedIn is: {isLoggedIn.toString()}</div>
    </main>
  );
}