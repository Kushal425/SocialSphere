import React from 'react';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

const FilterBar = ({ onSearch, onFilter, onSort }) => {
  return (
    <div className="glass rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <select
            className="w-full md:w-40 bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            onChange={(e) => onFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="News">News</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>

        <div className="relative flex-1 md:flex-none">
          <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <select
            className="w-full md:w-40 bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            onChange={(e) => onSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
