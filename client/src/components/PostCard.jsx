import React, { useState, useContext } from 'react';
import { FaHeart, FaComment, FaShare, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostCard({ post, onUpdate }) {
  const { user } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content || '');
  const [editedTitle, setEditedTitle] = useState(post.title || '');

  const isAuthor =
    user && post.author && (post.author._id === user.id || post.author === user.id);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onUpdate) onUpdate();
      alert('Post deleted successfully!');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/posts/${post._id}`,
        {
          title: editedTitle,
          content: editedContent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsEditing(false);
      if (onUpdate) onUpdate();
      alert('Post updated successfully!');
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post');
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-500/30 transition-all">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white font-bold">
            {post.author?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <Link to={`/profile/${post.author?._id}`} className="text-white font-semibold hover:underline">
              {post.author?.username || 'Unknown'}
            </Link>
            <p className="text-slate-400 text-xs">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Options Button */}
        {isAuthor && (
          <div className="relative">
            <button
              className="text-slate-400 hover:text-white"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaEllipsisV />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-cyan-400 hover:bg-slate-700 transition-colors"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-slate-700 transition-colors"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Edit Form */}
      {isEditing ? (
        <div className="mb-4 space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            placeholder="Post title"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            rows="4"
            placeholder="Post content"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedTitle(post.title);
                setEditedContent(post.content);
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
          <p className="text-slate-300 whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-6 pt-4 border-t border-slate-700">
        <button 
          onClick={handleLike}
          className="flex items-center space-x-2 text-slate-400 hover:text-pink-500 transition-colors"
        >
          <FaHeart className={post.likes?.includes(user?.id) ? 'text-pink-500' : ''} />
          <span>{post.likes?.length || 0}</span>
        </button>
        <button className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <FaComment />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

    </div>
  );
}
