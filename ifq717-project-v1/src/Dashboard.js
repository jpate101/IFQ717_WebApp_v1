import React from 'react';

export default function Dashboard() {
  // Temporarily display the token on the dashboard for the team to easily refer to while we develop our features
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
  return (
    <main className="flex-grow-1">
      <h4>Dashboard. This is what we'll see when we are logged in</h4>
      <div>Bearer Token: {token}</div>
    </main>
  );
}