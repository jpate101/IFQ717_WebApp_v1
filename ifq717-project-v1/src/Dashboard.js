import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");

  // TODO: move this into a separate component and store the URL elsewhere.
  useEffect(() => {
    fetch('https://my.tanda.co/api/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error(error));
  }, [token]);

  return (
    <main className="flex-grow-1">
      <h4>Dashboard placeholder. Coming soon.</h4>
      {user && (
        <div>
        <h1>Organisation Onboarding Overview (placeholder)</h1>
        <div className="container d-flex justify-content-center">
          <div className="card">
            <div className="card-header">Overall progress</div>
            <div className="card-body">{user.organisation} onboarding status placeholder</div>
          </div>
          <div className="card">
            <div className="card-header">Progress Bar</div>
            <div className="card-body">This is the text for card 2. </div>
          </div>
        </div>
      </div>
      )}
    </main>
  );
}