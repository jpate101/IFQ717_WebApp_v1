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
      <h4>Dashboard. This is what we would see when we are logged in as tanda sandbox user</h4>
      <div>Bearer Token: {token}</div>
      {user && (
        <div>
          <h5>Sandbox User Details:</h5>
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>User ID: {user.user_ids}</div>
          <div>Organisations: {user.organisation}</div>
          <div>Permissions: {user.permissions.join(', ')}</div>
          <div>Platform role IDs: {user.platform_role_ids.join(', ')}</div>
        </div>
      )}
    </main>
  );
}