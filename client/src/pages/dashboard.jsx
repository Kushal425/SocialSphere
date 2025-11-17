import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center text-white p-6">

      <div className="backdrop-blur-lg bg-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4 drop-shadow">
          Welcome to SocialSphere 🎉
        </h1>

        <p className="opacity-90 mb-6">
          You are successfully logged in.
        </p>

        <button
          onClick={logout}
          className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl 
          shadow-lg hover:bg-gray-200 transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
