import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';
import ProfileModal from '../components/ProfileModal';
import { FaSearch } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [showResults, setShowResults] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchFriendsAndPosts();
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/users/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults(res.data || []);
        setShowResults(true);
      } catch (err) {
        console.error('Error searching users:', err);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchFriendsAndPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch friends list
      const friendsRes = await axios.get(`${API_URL}/users/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const friendsList = friendsRes.data || [];
      setFriends(friendsList);
      
      // Fetch all posts
      const postsRes = await axios.get(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allPosts = postsRes.data.posts || [];
      
      // Filter to show only posts from friends and own posts
      const friendIds = friendsList.map(f => f._id);
      const filteredPosts = allPosts.filter(post => 
        friendIds.includes(post.author._id) || post.author._id === user.id
      );
      
      setPosts(filteredPosts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchFriendsAndPosts();
  };

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreatePost = async (postData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/posts`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateForm(false);
      fetchFriendsAndPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            className="flex-1 bg-transparent text-white focus:outline-none"
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
            {searchResults.map(result => (
              <div
                key={result._id}
                onClick={() => {
                  setSelectedUserId(result._id);
                  setShowProfileModal(true);
                  setSearchQuery('');
                  setShowResults(false);
                }}
                className="flex items-center space-x-3 p-3 hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {result.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{result.username}</p>
                  <p className="text-slate-400 text-sm">{result.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Feed
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          {showCreateForm ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {showCreateForm && (
        <CreatePostForm 
          onSubmit={handleCreatePost} 
          onClose={() => setShowCreateForm(false)} 
        />
      )}

      {loading ? (
        <div className="text-white text-center mt-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-slate-400 text-center mt-8 p-8 bg-slate-800/50 rounded-lg">
          <p>No posts from friends yet.</p>
          <p className="text-sm mt-2">Connect with friends to see their posts here!</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} onUpdate={handlePostCreated} />
          ))}
        </div>
      )}
      {showProfileModal && (
        <ProfileModal 
          userId={selectedUserId} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
}
