import React, { useState } from 'react';

export default function Home() {
  const [isLoggedIn] = useState(
    localStorage.getItem('token') ? true : false
  );
  console.log(isLoggedIn);
  return (
    <main className="dash flex-grow-1">
      <title>Tanda Launchpad</title>
      <header className="bg-background text-primary py-4">
        <h1 className="text-center text-2xl">Launchpad</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 text-cyan-500">Home pg place holder. Coming soon in Sprint 2</div>
        <div className="bg-white p-4 text-cyan-500">Available to non/logged in users. State of isLoggedIn is {isLoggedIn.toString()}</div>
      </div>
    </main>
  );
}