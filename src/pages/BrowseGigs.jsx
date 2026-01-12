import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchGigsStart,
  fetchGigsSuccess,
  fetchGigsFailure,
  clearError,
} from "../store/gigsSlice";
import { gigsAPI } from "../services/api";

export default function BrowseGigs() {
  const [searchTitle, setSearchTitle] = useState("");
  const dispatch = useDispatch();
  const { gigs, loading, error } = useSelector((state) => state.gigs);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async (title = "") => {
    try {
      dispatch(clearError());
      dispatch(fetchGigsStart());
      const response = await gigsAPI.getGigs(title);
      dispatch(fetchGigsSuccess(response.data));
    } catch (err) {
      dispatch(
        fetchGigsFailure(err.response?.data?.message || "Failed to fetch gigs")
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(searchTitle);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Gigs</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search gigs by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTitle("");
                fetchGigs("");
              }}
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading gigs...</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No gigs found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold mb-2">{gig.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {gig.description}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Posted by: {gig.ownerId.name}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${gig.budget}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                    {gig.status}
                  </span>
                  <Link
                    to={`/gig/${gig._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
