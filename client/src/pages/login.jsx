import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        form
      );

      login(res.data.data, res.data.token);
      navigate("/dashboard");
    } catch (error) { // Changed err to error
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      setMsg(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center p-4">

      <div className="glass w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_40px_rgba(6,182,212,0.2)]">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white w-1/2">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-xl">Welcome Back 👋</h1>
          <p className="opacity-90 text-lg">
            Login to continue your journey on SocialSphere.
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-slate-900/90 w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                onChange={handleChange}
              />
            </div>

            <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white py-3 font-semibold rounded-xl shadow-lg transition-all">
              Login
            </button>

            {msg && (
              <p className="text-center text-red-500 text-sm">{msg}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don’t have an account?{" "}
            <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
