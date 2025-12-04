import React, { useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

const CreatePostForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <div className="glass rounded-xl p-6 mb-8 animate-fadeIn border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Create New Post</h3>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <FaTimes />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Post Title"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        
        <div>
          <textarea
            placeholder="What's on your mind?"
            rows="4"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
          />
        </div>

        <div className="flex gap-4">
          <select
            className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="General">General</option>
            <option value="Tech">Tech</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="News">News</option>
            <option value="Gaming">Gaming</option>
          </select>

          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <FaPaperPlane />
            <span>Post</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
