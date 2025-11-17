import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        form
      );
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl 
      w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

        <div className="hidden md:flex flex-col justify-center p-12 text-white w-1/2">
          <h1 className="text-4xl font-bold mb-4">Create Your Account ✨</h1>
          <p className="opacity-90 text-lg">
            Join SocialSphere and start sharing your world.
          </p>
        </div>

        {/* Right */}
        <div className="bg-white/90 w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-xl shadow-lg transition-all">
              Sign Up
            </button>

            {msg && <p className="text-center text-red-500">{msg}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
