import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
              SocialSphere
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/messages" className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                  <FaEnvelope size={20} />
                </Link>
                <Link to={`/profile/${user.id}`} className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                  <FaUserCircle size={24} />
                  <span className="hidden md:block">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
