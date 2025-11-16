import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Dashboard 🏠
      </h1>
      <p className="text-gray-600 mb-6">
        You are logged in successfully!
      </p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
