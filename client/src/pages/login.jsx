import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock } from "react-icons/fi";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl 
      w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white w-1/2">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-xl">Welcome Back 👋</h1>
          <p className="opacity-90 text-lg">
            Login to continue your journey on SocialSphere.
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-white/90 w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-xl shadow-lg transition-all">
              Login
            </button>

            {msg && (
              <p className="text-center text-red-500 text-sm">{msg}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
