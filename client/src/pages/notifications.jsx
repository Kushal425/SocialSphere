import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaHeart, FaComment, FaCheck } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? {...n, read: true} : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleAccept = async (e, notification) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/accept/${notification.sender._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Mark notification as read and remove from list to hide buttons
      await markAsRead(notification._id);
      setNotifications(prev => prev.filter(n => n._id !== notification._id));
      // Optionally fetch to get the new 'friend_accept' notification immediately
      fetchNotifications();
    } catch (err) {
      console.error('Error accepting friend request:', err);
    }
  };

  const handleReject = async (e, notification) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/reject/${notification.sender._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Mark notification as read and remove from list
      await markAsRead(notification._id);
      setNotifications(prev => prev.filter(n => n._id !== notification._id));
    } catch (err) {
      console.error('Error rejecting friend request:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'friend_request': return <FaUserPlus className="text-cyan-400" size={20} />;
      case 'friend_accept': return <FaCheck className="text-emerald-500" size={20} />;
      case 'like': return <FaHeart className="text-pink-500" size={20} />;
      case 'comment': return <FaComment className="text-emerald-400" size={20} />;
      default: return null;
    }
  };

  const getNotificationText = (notification) => {
    const username = notification.sender?.username || 'Someone';
    switch(notification.type) {
      case 'friend_request': return `${username} sent you a friend request`;
      case 'friend_accept': return notification.message;
      case 'like': return notification.message || `${username} liked your post`;
      case 'comment': return `${username} commented on your post`;
      default: return 'New notification';
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.type === 'friend_request') {
      navigate(`/profile/${notification.sender._id}`);
    } else if (notification.post) {
      // Could navigate to post detail page if you have one
      // For now, just mark as read
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-10">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold text-white mb-8">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center text-slate-400">
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`glass rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition-all hover:bg-slate-800/50 ${
                  !notification.read ? 'border-l-4 border-cyan-500' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className={`${!notification.read ? 'text-white font-medium' : 'text-slate-300'}`}>
                    {getNotificationText(notification)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                  {notification.type === 'friend_request' && (
                    <div className="mt-3 flex space-x-3">
                      <button 
                        onClick={(e) => handleAccept(e, notification)}
                        className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={(e) => handleReject(e, notification)}
                        className="px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
