import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
