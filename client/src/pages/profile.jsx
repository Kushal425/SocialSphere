import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaSave, FaEnvelope, FaUserPlus, FaCheck, FaUserFriends, FaCamera } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', bio: '' });
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id || currentUser?._id;
  const isOwnProfile = currentUserId === id;
  const [friendStatus, setFriendStatus] = useState('none');
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bannerPhoto, setBannerPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setFormData({ username: res.data.username, email: res.data.email, bio: res.data.bio || '' });
        setFriendsCount(res.data.friends?.length || 0);
        setProfilePhoto(res.data.profilePhoto || null);
        setBannerPhoto(res.data.bannerPhoto || null);

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
        console.error("Error fetching profile", err);
        setError("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
    fetchUserPosts();
  }, [id, currentUserId]);

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/posts?author=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  const sendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/request/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendStatus('sent');
    } catch (err) {
      console.error("Error sending request", err);
    }
  };

  const acceptRequest = async () => {
     // We need logic to know if we can accept.
     // For now, let's just implement Send Request.
     // To implement Accept, we need to see the request.
  };

  const handleRemoveFriend = async () => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/remove/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendStatus('none');
      // Refresh profile to update friends count
      window.location.reload();
    } catch (err) {
      console.error('Error removing friend:', err);
      alert('Failed to remove friend');
    }
  };

  const handleProfilePhotoUpload = async (file) => {
    try {
      console.log('Starting profile photo upload...', file);
      const token = localStorage.getItem('token');
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        
        console.log('Sending request to:', `${API_URL}/users/profile/photo`);
        try {
          const res = await axios.post(`${API_URL}/users/profile/photo`, 
            { photoData: base64Data },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log('Upload response:', res.data);
          setProfilePhoto(res.data.profilePhoto);
          setProfile({ ...profile, profilePhoto: res.data.profilePhoto });
          alert('Profile photo uploaded successfully!');
        } catch (err) {
          console.error('Error uploading profile photo:', err);
          console.error('Error response:', err.response?.data);
          alert('Failed to upload profile photo: ' + (err.response?.data?.message || err.message));
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading profile photo:', err);
      alert('Failed to upload profile photo');
    }
  };

  const handleBannerPhotoUpload = async (file) => {
    try {
      const token = localStorage.getItem('token');
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        
        try {
          const res = await axios.post(`${API_URL}/users/profile/banner`, 
            { bannerData: base64Data },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          setBannerPhoto(res.data.bannerPhoto);
          setProfile({ ...profile, bannerPhoto: res.data.bannerPhoto });
          alert('Banner photo uploaded successfully!');
        } catch (err) {
          console.error('Error uploading banner photo:', err);
          alert('Failed to upload banner photo');
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading banner photo:', err);
      alert('Failed to upload banner photo');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update profile with all new data including bio
      setProfile({ 
        ...profile, 
        username: res.data.username, 
        email: res.data.email,
        bio: res.data.bio 
      });
      
      // Update local storage if it's own profile
      if (isOwnProfile) {
        const updatedUser = { 
          ...currentUser, 
          username: res.data.username, 
          email: res.data.email 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile");
    }
  };

  if (error) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">{error}</div>;
  if (!profile) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 pb-10">
      
      <div className="max-w-2xl mx-auto px-4 pt-16">
        <div className="glass rounded-2xl overflow-hidden relative">
          {/* Banner Section */}
          <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-80">
            {bannerPhoto && (
              <img src={bannerPhoto} alt="Banner" className="w-full h-full object-cover" />
            )}
            {isEditing && isOwnProfile && (
              <label className="absolute top-4 right-4 cursor-pointer bg-slate-900/70 hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2">
                <FaCamera />
                <span>Change Banner</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleBannerPhotoUpload(file);
                  }
                }} />
              </label>
            )}
          </div>

          {/* Profile Photo */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-cyan-400 shadow-xl overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle size={80} />
              )}
            </div>
            {isEditing && isOwnProfile && (
              <label className="absolute left-1/2 -translate-x-1/2 bottom-0 cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full transition-all">
                <FaCamera size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleProfilePhotoUpload(file);
                  }
                }} />
              </label>
            )}
          </div>

          <div className="px-8 pb-8 text-center">

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-left text-sm text-slate-400 mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-left text-sm text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-left text-sm text-slate-400 mb-1">Bio</label>
                  <textarea
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex justify-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{profile.username}</h1>
                {profile.bio ? (
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">{profile.bio}</p>
                ) : (
                  <p className="text-slate-500 text-sm italic mb-6">No bio yet</p>
                )}
                
                <div className="flex justify-center space-x-8 mb-8">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-white">{posts.length}</span>
                    <span className="text-sm text-slate-500">Posts</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-white">{friendsCount}</span>
                    <span className="text-sm text-slate-500">Friends</span>
                  </div>
                </div>

                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 hover:bg-slate-700 hover:border-cyan-500 transition-all flex items-center space-x-2 mx-auto"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => navigate(`/messages?userId=${profile._id}`)}
                      className="px-6 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-all flex items-center space-x-2"
                    >
                      <FaEnvelope />
                      <span>Message</span>
                    </button>
                    
                    {friendStatus === 'friends' ? (
                      <button 
                        onClick={handleRemoveFriend}
                        className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-colors flex items-center space-x-2"
                      >
                        <FaUserFriends />
                        <span>Remove Friend</span>
                      </button>
                    ) : friendStatus === 'sent' ? (
                      <button className="px-6 py-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 cursor-default flex items-center space-x-2">
                        <FaCheck />
                        <span>Request Sent</span>
                      </button>
                    ) : (
                      <button 
                        onClick={sendRequest}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
                      >
                        <FaUserPlus />
                        <span>Add Friend</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex space-x-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Friends ({friendsCount})
          </button>
        </div>

        {/* Posts Section */}
        {activeTab === 'posts' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Posts</h2>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-slate-400 text-lg">No posts yet</p>
              {isOwnProfile && (
                <p className="text-slate-500 text-sm mt-2">Start sharing your thoughts with the world!</p>
              )}
            </div>
          )}
          </div>
        )}

        {/* Friends Section */}
        {activeTab === 'friends' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Friends ({friendsCount})</h2>
            {profile.friends && profile.friends.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.friends.map(friend => (
                  <div 
                    key={friend._id} 
                    onClick={() => navigate(`/profile/${friend._id}`)}
                    className="glass p-4 rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white font-bold overflow-hidden">
                      {friend.profilePhoto ? (
                        <img src={friend.profilePhoto} alt={friend.username} className="w-full h-full object-cover" />
                      ) : (
                        friend.username[0].toUpperCase()
                      )}
                    </div>
                    <p className="text-white font-medium truncate">{friend.username}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-8 text-center text-slate-400">
                <p>No friends yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
