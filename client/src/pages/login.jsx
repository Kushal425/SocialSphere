import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(import.meta.env.VITE_API_BASE_URL);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 mb-3 rounded"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 mb-3 rounded"
            onChange={handleChange}
          />
          <button className="bg-blue-600 text-white w-full py-2 rounded mt-2">
            Login
          </button>
        </form>
        {message && <p className="text-center text-sm mt-3 text-gray-600">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
