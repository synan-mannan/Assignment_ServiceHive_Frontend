import React from "react";
import {
  HashRouter as Router,
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
import Cookie from "js-cookie";

function App() {
  const auth = useSelector((state) => state.auth);

  const notifications = [];
  const isConnected = false;
  const removeNotification = () => {};

  let token = localStorage.getItem("token");
  if (token && !Cookie.get("token")) {
    Cookie.set("token", token, { expires: 30 });
  }

  return (
    <Router>
      <Navbar />
      <Notifications
        notifications={notifications}
        onRemove={removeNotification}
      />

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
