import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Notifications from "./components/Notifications";
import BrowseGigs from "./pages/BrowseGigs";
import GigDetails from "./pages/GigDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostGig from "./pages/PostGig";
import ProtectedRoute from "./components/ProtectedRoute";
import { useNotifications } from "./hooks/useNotifications";

function App() {
  const auth = useSelector((state) => state.auth);
  const { notifications, isConnected, removeNotification } = useNotifications(
    auth.user?.id || auth.user?._id,
    auth.isAuthenticated
  );

  return (
    <Router>
      <Navbar />
      <Notifications
        notifications={notifications}
        onRemove={removeNotification}
      />
      {isConnected && (
        <div className="fixed bottom-4 left-4 text-xs text-green-600 bg-green-50 px-3 py-1 rounded">
           Connected
        </div>
      )}
      <Routes>
        <Route path="/" element={<BrowseGigs />} />
        <Route path="/gig/:gigId" element={<GigDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/post-gig"
          element={
            <ProtectedRoute>
              <PostGig />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
