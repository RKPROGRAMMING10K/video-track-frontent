import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Import trash icon

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [progressData, setProgressData] = useState({});
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch all videos
    axios.get(`${import.meta.env.VITE_API_URL}/api/videos`).then((res) => {
      setVideos(res.data);
    });

    // Fetch progress for all videos
    axios.get(`${import.meta.env.VITE_API_URL}/api/progress`).then((res) => {
      const progressMap = {};
      res.data.forEach((progress) => {
        progressMap[progress.videoId] = progress;
      });
      setProgressData(progressMap);
    });
  }, []);

  const getProgressPercentage = (videoId) => {
    const progress = progressData[videoId];
    if (!progress) return 0;

    // Use the percentage directly from the backend
    return progress.percentage || 0;
  };

  const handleRemoveFromContinueWatching = (videoId) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/progress/${videoId}`).then(() => {
      setProgressData((prev) => {
        const updatedProgress = { ...prev };
        delete updatedProgress[videoId];
        return updatedProgress;
      });
    });
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`); // Navigate to the video details page
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Latest Videos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white shadow rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleVideoClick(video._id)} // Navigate on click
              >
                <img
                  src={video.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{video.name}</h3>
                  <p className="text-sm text-gray-600">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Continue Watching</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos
              .filter((video) => {
                const progress = progressData[video._id];
                return progress && progress.percentage > 0; // Only show videos with progress
              })
              .map((video) => {
                const progress = getProgressPercentage(video._id);
                return (
                  <div
                    key={video._id}
                    className="bg-white shadow rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleVideoClick(video._id)} // Navigate on click
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">{video.title}</h3>
                        <p className="text-sm text-gray-600">
                          Watched: {progress}%
                        </p>
                      </div>
                      <button
                        className="text-red-500"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation on button click
                          handleRemoveFromContinueWatching(video._id);
                        }}
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
