import React from "react";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

const VideoCard = ({ video }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Link to={`/video/${video._id}`} className="block"> {/* Ensure video._id is passed here */}
        <img
          src={video.thumbnailUrl}
          alt="Thumbnail"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{video.title}</h3>
          <p className="text-gray-600 text-sm">{video.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
