import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGigStart,
  fetchGigSuccess,
  fetchGigFailure,
} from "../store/gigsSlice";
import {
  fetchBidsStart,
  fetchBidsSuccess,
  fetchBidsFailure,
  submitBidStart,
  submitBidSuccess,
  submitBidFailure,
  hireBidStart,
  hireBidSuccess,
  hireBidFailure,
  clearError as clearBidsError,
} from "../store/bidsSlice";
import { gigsAPI, bidsAPI } from "../services/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function GigDetails() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGig, loading: gigsLoading } = useSelector(
    (state) => state.gigs
  );
  const {
    bids,
    loading: bidsLoading,
    error: bidsError,
  } = useSelector((state) => state.bids);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [bidMessage, setBidMessage] = useState("");
  const [hireBidId, setHireBidId] = useState(null);

  useEffect(() => {
    fetchGigDetails();
  }, [gigId]);

  useEffect(() => {
    if (currentGig && isAuthenticated && user && currentGig.ownerId._id === user.id) {
      fetchBidsForGig();
    }
  }, [currentGig, isAuthenticated, user]);

  const fetchGigDetails = async () => {
    try {
      dispatch(fetchGigStart());
      const response = await gigsAPI.getGig(gigId);
      dispatch(fetchGigSuccess(response.data));
    } catch (err) {
      dispatch(
        fetchGigFailure(err.response?.data?.message || "Failed to fetch gig")
      );
    }
  };

  const fetchBidsForGig = async () => {
    try {
      dispatch(fetchBidsStart());
      const response = await bidsAPI.getBidsForGig(gigId);
      dispatch(fetchBidsSuccess(response.data));
    } catch (err) {
      dispatch(
        fetchBidsFailure(err.response?.data?.message || "Failed to fetch bids")
      );
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!bidMessage.trim()) {
      alert("Please enter a bid message");
      return;
    }

    try {
      dispatch(submitBidStart());
      const response = await bidsAPI.submitBid({
        gigId,
        message: bidMessage,
      });

      dispatch(submitBidSuccess(response.data));
      setBidMessage("");
      alert("Bid submitted successfully!");
    } catch (err) {
      dispatch(
        submitBidFailure(err.response?.data?.message || "Failed to submit bid")
      );
    }
  };

  const handleHireBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to hire this freelancer?")) {
      return;
    }

    try {
      setHireBidId(bidId);
      dispatch(hireBidStart());
      const response = await bidsAPI.hireBid(bidId);

      dispatch(hireBidSuccess(response.data.bid));

      // Update the gig status to assigned
      dispatch(fetchGigSuccess(response.data.gig));

      alert("Freelancer hired successfully!");
      await fetchBidsForGig();
    } catch (err) {
      dispatch(
        hireBidFailure(err.response?.data?.message || "Failed to hire bid")
      );
    } finally {
      setHireBidId(null);
    }
  };

  if (gigsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading gig details...</p>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Gig not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Gigs
          </button>
        </div>
      </div>
    );
  }

  const isGigOwner = isAuthenticated && currentGig.ownerId._id === user?.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to Gigs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gig Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {currentGig.title}
                  </h1>
                  <p className="text-gray-600">
                    Posted by: <strong>{currentGig.ownerId.name}</strong>
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-4 py-2 rounded-full">
                  {currentGig.status}
                </span>
              </div>

              <p className="text-2xl font-bold text-green-600 mb-6">
                ${currentGig.budget}
              </p>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentGig.description}
                </p>
              </div>
            </div>

            {/* Submit Bid Section (if not gig owner) */}
            {!isGigOwner && currentGig.status === "open" && (
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold mb-4">Submit Your Bid</h2>

                {bidsError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {bidsError}
                  </div>
                )}

                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Your Bid Message
                    </label>
                    <textarea
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Tell the gig owner why you're the best fit for this job..."
                      required
                    />
                  </div>

                  {!isAuthenticated && (
                    <p className="text-gray-600 text-sm">
                      You need to{" "}
                      <a
                        href="/login"
                        className="text-blue-600 hover:underline"
                      >
                        login
                      </a>{" "}
                      to submit a bid
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={bidsLoading || !isAuthenticated}
                    className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {bidsLoading ? "Submitting..." : "Submit Bid"}
                  </button>
                </form>
              </div>
            )}

            {currentGig.status === "assigned" && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-6">
                This gig has been assigned to a freelancer.
              </div>
            )}
          </div>

          {/* Bids Section (for gig owner only) */}
          {isGigOwner && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                <h2 className="text-xl font-bold mb-4">Bids ({bids.length})</h2>

                {bidsError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {bidsError}
                  </div>
                )}

                {bidsLoading ? (
                  <p className="text-gray-600 text-sm">Loading bids...</p>
                ) : bids.length === 0 ? (
                  <p className="text-gray-600 text-sm">No bids yet</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bids.map((bid) => (
                      <div
                        key={bid._id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="mb-3">
                          <h3 className="font-bold text-sm">
                            {bid.freelancerId.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {bid.freelancerId.email}
                          </p>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                          {bid.message}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              bid.status === "hired"
                                ? "bg-green-100 text-green-800"
                                : bid.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {bid.status}
                          </span>
                        </div>

                        {bid.status === "pending" && (
                          <button
                            onClick={() => handleHireBid(bid._id)}
                            disabled={
                              hireBidId !== null ||
                              currentGig.status === "assigned"
                            }
                            className="w-full bg-green-600 text-white text-xs py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {hireBidId === bid._id ? "Hiring..." : "Hire"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
