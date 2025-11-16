import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex justify-between">
        <Link to="/" className="font-bold text-lg text-blue-600">SocialSphere 🌐</Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:text-blue-500">Login</Link>
          <Link to="/register" className="hover:text-blue-500">Register</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-bold text-blue-600">Welcome to SocialSphere</h1>
            <p className="text-gray-500 mt-2">Login or Register to continue.</p>
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
