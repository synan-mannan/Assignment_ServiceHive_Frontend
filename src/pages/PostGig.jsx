import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createGigStart,
  createGigSuccess,
  createGigFailure,
  clearError,
} from "../store/gigsSlice";
import { gigsAPI } from "../services/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function PostGig() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.gigs);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <ProtectedRoute />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!formData.title || !formData.description || !formData.budget) {
      dispatch(createGigFailure("All fields are required"));
      return;
    }

    try {
      dispatch(createGigStart());
      const response = await gigsAPI.createGig({
        title: formData.title,
        description: formData.description,
        budget: parseInt(formData.budget),
      });

      dispatch(createGigSuccess(response.data));
      navigate("/");
    } catch (err) {
      dispatch(
        createGigFailure(err.response?.data?.message || "Failed to create gig")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Post a New Gig</h1>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gig Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="e.g., Build a React website"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Describe the gig in detail..."
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Gig"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-400 text-white py-2 rounded-md font-bold hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
