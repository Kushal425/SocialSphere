import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Messages from "./pages/messages";
import Profile from "./pages/profile";
import Notifications from "./pages/notifications";
import Landing from "./pages/landing";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

// Fade Wrapper
function PageWrapper({ children }) {
  return <div className="animate-fadeIn min-h-screen">{children}</div>;
}

// Protect Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />

        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Messages />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Notifications />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}