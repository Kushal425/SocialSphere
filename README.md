# 🌐 SocialSphere

A modern, lightweight social media platform built for simplicity and real-time engagement.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [API Overview](#api-overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

---

## 🎯 Overview

**SocialSphere** is a mini social media platform designed to be intuitive and user-friendly. It provides users with a simple way to:

- 📝 Share posts with their network
- ❤️ Like and comment on content
- 💬 Send direct messages to others
- 👤 Manage their personal profiles
- 🔍 Discover content through search and filters

Built with modern web technologies, SocialSphere delivers a smooth, responsive experience for both desktop and mobile users.

---

## ⚠️ Problem Statement

Existing social media platforms are often overwhelming with complex features and cluttered interfaces. **SocialSphere** solves this by offering a streamlined alternative that focuses on core social features without unnecessary complexity.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration and login
- Secure JWT-based authentication
- Session management and logout
- Password protection

### 📝 Post Management
- Create, edit, and delete posts
- Global feed with real-time updates
- Like and unlike posts
- Add and manage comments
- Rich text support

### 🔍 Search, Filter & Sort
- Search posts by keyword
- Find users by username
- Filter by tags or categories
- Sort options:
  - Newest posts
  - Most liked
  - Most commented

### 📑 Pagination
- Efficient feed pagination (10 posts per page)
- Smooth scrolling experience

### 💬 Direct Messaging (DM)
- Private, thread-based conversations
- Real-time message delivery
- Message history

### 🗂️ CRUD Operations
- Full post management capabilities
- Comment creation and editing
- User profile management

### 🧭 Navigation
Key pages include:
- Home (Feed)
- Login & Register
- User Profile
- Create Post
- Messaging Center

### 🤖 AI Integration (Optional)
- AI-generated post captions
- Intelligent hashtag suggestions
- Content moderation powered by OpenAI

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | React.js | UI library |
| | React Router | Client-side routing |
| | Tailwind CSS | Styling & design system |
| | Axios | HTTP client |
| **Backend** | Node.js | Runtime environment |
| | Express.js | Web framework |
| **Database** | MongoDB Atlas | Cloud database |
| **Authentication** | JWT | Secure token-based auth |
| **AI (Optional)** | OpenAI API | Content generation & moderation |
| **Hosting** | Vercel / Netlify | Frontend deployment |
| | Render / Railway | Backend deployment |
| | MongoDB Atlas | Database hosting |

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React.js)     │
│  Vercel/Netlify │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │
│ (Node/Express)  │
│ Render/Railway  │
└────────┬────────┘
         │
         │ MongoDB
         │
┌────────▼────────┐
│  MongoDB Atlas  │
│   Database      │
└─────────────────┘
```

### Frontend Stack
- **React.js** - Component-based UI
- **React Router** - Multi-page navigation
- **Tailwind CSS** - Utility-first styling
- **Axios** - API communication

### Backend Stack
- **Express.js** - REST API server
- **JWT** - Authentication tokens
- **REST APIs** - Posts, comments, messages

### Database
- **MongoDB Atlas** - NoSQL cloud database

---

## 📡 API Overview

### Authentication Endpoints
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | Login user | Public |

### Post Endpoints
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/posts` | GET | Get all posts (with search, filter, sort, pagination) | Public |
| `/api/posts/:id` | GET | Get single post details | Public |
| `/api/posts` | POST | Create new post | Authenticated |
| `/api/posts/:id` | PUT | Update post | Owner only |
| `/api/posts/:id` | DELETE | Delete post | Owner only |
| `/api/posts/:id/like` | POST | Like/Unlike post | Authenticated |
| `/api/posts/:id/comment` | POST | Add comment to post | Authenticated |

### Messaging Endpoints
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/messages/:userId` | GET | Fetch messages with user | Authenticated |
| `/api/messages` | POST | Send new message | Authenticated |

### AI Endpoints (Optional)
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/ai/generate` | POST | Generate captions/hashtags | Authenticated |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kushal425/SocialSphere.git
   cd SocialSphere
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure environment variables**
   
   Create `.env` in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_openai_api_key (optional)
   ```

5. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 📂 Project Structure

```
SocialSphere/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Kushal Sarkar**

- GitHub: [@Kushal425](https://github.com/Kushal425)

---

## 🙏 Acknowledgments

- React.js community
- Express.js documentation
- Tailwind CSS framework
- MongoDB Atlas

---

## 📞 Support

For support, email kushalsarkar457@gmail.com or open an issue on GitHub.

---

**Made with ❤️ by Kushal Sarkar**