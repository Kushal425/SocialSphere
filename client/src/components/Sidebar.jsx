import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaEnvelope, FaUser, FaCog, FaSearch, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: <FaHome size={20} />, label: 'Feed' },
    { path: '/notifications', icon: <FaBell size={20} />, label: 'Notifications' },
    { path: '/messages', icon: <FaEnvelope size={20} />, label: 'Messages' },
    { path: `/profile/${user?.id || user?._id}`, icon: <FaUser size={20} />, label: 'Profile' },
    // { path: '/settings', icon: <FaCog size={20} />, label: 'Settings' }, // Optional
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 pt-20 pb-4 px-4">
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>


    </div>
  );
};

export default Sidebar;
