import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaUserFriends, FaComments, FaRocket } from 'react-icons/fa';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-animated opacity-80"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="animate-fadeIn">
            <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-lg mb-6 border border-white/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <FaGlobeAmericas size={48} className="text-cyan-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                SocialSphere
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect, share, and engage with the world in a modern, vibrant space designed for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FaRocket />
                <span>Get Started</span>
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Shapes Animation */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<FaUserFriends size={32} />}
              title="Connect"
              description="Build your network and stay in touch with friends and communities that matter to you."
              color="text-emerald-400"
            />
            <FeatureCard 
              icon={<FaComments size={32} />}
              title="Chat"
              description="Real-time messaging to keep the conversation going, anytime, anywhere."
              color="text-cyan-400"
            />
            <FeatureCard 
              icon={<FaGlobeAmericas size={32} />}
              title="Discover"
              description="Explore trending topics, news, and stories from around the globe."
              color="text-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 border-t border-slate-800 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} SocialSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="glass p-8 rounded-2xl hover:border-cyan-500/50 transition-colors duration-300 group">
      <div className={`mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
