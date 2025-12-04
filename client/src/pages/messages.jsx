import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { FaPaperPlane, FaUserCircle, FaSearch } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Messages() {
  const [conversations, setConversations] = useState([]); // This would ideally be a list of users we have chatted with
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]); // List of friends
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Mock fetching users for now (in a real app, we'd have a search or friends list)
  // For simplicity, let's just fetch all posts and extract unique authors to chat with, 
  // or better, let's assume we can search for users. 
  // Since we don't have a "get all users" endpoint, we'll rely on a simple UI where 
  // we might need to know the user ID or just list recent chats.
  // To make it functional without a "get all users" API, let's implement a simple "Start Chat" 
  // where you can enter a username (if we had search) or just list users from posts we've seen.
  
  // Actually, let's add a simple "Search User" feature in the messages page or just list some users.
  // For this demo, let's fetch posts to get some users to chat with.
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch friends
        const res = await axios.get(`${API_URL}/users/friends`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
        setFilteredUsers(res.data);

        // Check for userId in query params
        const userIdParam = searchParams.get('userId');
        if (userIdParam) {
          const targetUser = res.data.find(u => u._id === userIdParam);
          if (targetUser) {
            setSelectedUser(targetUser);
          } else {
            // Fetch specific user details if not in list
            try {
              const userRes = await axios.get(`${API_URL}/users/${userIdParam}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setUsers(prev => {
                // Add to list if not present
                if (!prev.find(u => u._id === userRes.data._id)) {
                  const newList = [userRes.data, ...prev];
                  setFilteredUsers(newList); // Update filtered list too
                  return newList;
                }
                return prev;
              });
              setSelectedUser(userRes.data);
            } catch (e) {
              console.error("User not found", e);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching contacts", err);
      }
    };
    fetchContacts();
  }, [searchParams]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery, users]);

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/messages`, {
        recipientId: selectedUser._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => fetchMessages(selectedUser._id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-slate-900 pb-10">
      
      <div className="max-w-6xl mx-auto px-4 pt-8 h-[calc(100vh-100px)]">
        <div className="glass rounded-xl h-full flex overflow-hidden">
          
          {/* Sidebar - Users List */}
          <div className="w-1/3 border-r border-slate-700/50 bg-slate-800/30 flex flex-col">
            <div className="p-4 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-white">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              <div className="px-2 mb-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {filteredUsers.map(user => (
                <div 
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${selectedUser?._id === user._id ? 'bg-cyan-500/20 border border-cyan-500/50' : 'hover:bg-slate-700/50'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400 font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.username}</h3>
                    <p className="text-xs text-slate-400">Click to chat</p>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-slate-400">
                  No users found to chat with. Check the feed to find people!
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-900/50">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex items-center space-x-3 bg-slate-800/30">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400 font-bold">
                    {selectedUser.username[0].toUpperCase()}
                  </div>
                  <h3 className="font-bold text-white">{selectedUser.username}</h3>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => {
                    const isMe = msg.sender._id === currentUser.id || msg.sender === currentUser.id;
                    return (
                      <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-xl ${isMe ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none'}`}>
                          <p>{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col text-slate-500">
                <FaUserCircle size={64} className="mb-4 opacity-20" />
                <p>Select a user to start messaging</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
