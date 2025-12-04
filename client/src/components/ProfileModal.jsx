import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaUserPlus, FaCheck, FaUserFriends, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfileModal({ userId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [friendStatus, setFriendStatus] = useState('none');
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);

      // Check friend status
      if (currentUserId && res.data._id !== currentUserId) {
        // Check if friends (friends array contains populated objects with _id)
        const isFriend = res.data.friends?.some(f => 
          (typeof f === 'object' ? f._id : f) === currentUserId
        );
        if (isFriend) {
          setFriendStatus('friends');
        } else if (res.data.friendRequests.includes(currentUserId)) {
          setFriendStatus('sent');
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const sendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendStatus('sent');
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  const handleMessage = () => {
    onClose();
    navigate(`/messages?userId=${userId}`);
  };

  const handleViewProfile = () => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  const handleRemoveFriend = async () => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/remove/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendStatus('none');
    } catch (err) {
      console.error('Error removing friend:', err);
      alert('Failed to remove friend');
    }
  };

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="glass rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-white text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-cyan-400 mb-4">
            <FaUserCircle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{profile.username}</h2>
          <p className="text-slate-400">{profile.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleViewProfile}
            className="w-full px-6 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-all"
          >
            View Full Profile
          </button>

          <button
            onClick={handleMessage}
            className="w-full px-6 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <FaEnvelope />
            <span>Message</span>
          </button>

          {friendStatus === 'friends' ? (
            <button 
              onClick={handleRemoveFriend}
              className="w-full px-6 py-3 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-2"
            >
              <FaUserFriends />
              <span>Remove Friend</span>
            </button>
          ) : friendStatus === 'sent' ? (
            <button className="w-full px-6 py-3 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 cursor-default flex items-center justify-center space-x-2">
              <FaCheck />
              <span>Request Sent</span>
            </button>
          ) : (
            <button
              onClick={sendRequest}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 flex items-center justify-center space-x-2"
            >
              <FaUserPlus />
              <span>Add Friend</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
