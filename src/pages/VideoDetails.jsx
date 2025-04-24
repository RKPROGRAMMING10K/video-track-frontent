import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";

const VideoDetails = () => {
    const { videoId } = useParams(); // Get videoId from the URL
    const [video, setVideo] = useState(null);
    const [watchedIntervals, setWatchedIntervals] = useState([]);
    const [lastPosition, setLastPosition] = useState(0);
    const playerRef = useRef(null);

    let currentStartTime = null;

    useEffect(() => {
        // Fetch video details and last watched data from the API
        axios.get(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}`).then((res) => {
            setVideo(res.data);
        });

        axios.get(`${import.meta.env.VITE_API_URL}/api/progress/${videoId}`).then((res) => {
            setWatchedIntervals(res.data.intervals || []);
            setLastPosition(res.data.lastPosition || 0);
        });
    }, [videoId]);

    const handleTimeUpdate = () => {
        if (playerRef.current) { // Ensure playerRef.current is not null
            const currentTime = playerRef.current.getCurrentTime();

            if (currentStartTime === null) {
                currentStartTime = currentTime;
            }
        }
    };



    const mergeIntervals = (intervals) => {
        if (!intervals.length) return [];

        intervals.sort((a, b) => a[0] - b[0]);
        const merged = [intervals[0]];

        for (let i = 1; i < intervals.length; i++) {
            const [prevStart, prevEnd] = merged[merged.length - 1];
            const [currentStart, currentEnd] = intervals[i];

            if (currentStart <= prevEnd) {
                merged[merged.length - 1] = [prevStart, Math.max(prevEnd, currentEnd)];
            } else {
                merged.push(intervals[i]);
            }
        }

        return merged;
    };

    const calculateProgress = () => {
        if (!video || !playerRef.current) return 0; // Ensure video and playerRef.current are not null

        const totalDuration = playerRef.current.getDuration();
        const watchedTime = watchedIntervals.reduce(
            (acc, [start, end]) => acc + (end - start),
            0
        );

        return ((watchedTime / totalDuration) * 100).toFixed(2);
    };

    const handlePauseOrSeek = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();

            if (currentStartTime !== null) {
                const newInterval = [currentStartTime, currentTime];
                const duration = currentTime - currentStartTime;

                // Ignore intervals shorter than 5 seconds
                if (duration >= 5) {
                    setWatchedIntervals((prev) => mergeIntervals([...prev, newInterval]));
                }
                currentStartTime = null;
            }

            // Save progress on pause or seek
            handleSaveProgress();
        }
    };

    const handleSaveProgress = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            const totalDuration = playerRef.current.getDuration();

            // Calculate the watched percentage
            const watchedTime = watchedIntervals.reduce(
                (acc, [start, end]) => acc + (end - start),
                0
            );
            const percentage = Math.min(
                ((watchedTime / totalDuration) * 100).toFixed(2),
                100
            );

            console.log("percentage", percentage);
            axios
                .post(`${import.meta.env.VITE_API_URL}/api/progress/${videoId}`, {
                    lastPosition: currentTime,
                    intervals: watchedIntervals,
                    percentage: percentage, // Ensure percentage is valid
                })
                .catch((err) => {
                    console.error("Error saving progress:", err.message);
                });
        }
    };

    useEffect(() => {
        // Save progress when the component unmounts
        return () => {
            handleSaveProgress();
        };
    }, [watchedIntervals]);

    if (!video) {
        return <div>Loading...</div>; // Show a loading state while fetching data
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
            <ReactPlayer
                ref={playerRef}
                url={video.videoUrl}
                controls
                width="100%"
                height="480px"
                className="rounded shadow-md"
                onProgress={handleTimeUpdate}
                onPause={handlePauseOrSeek}
                onSeek={handlePauseOrSeek}
                onStart={() => {
                    if (lastPosition > 0) {
                        playerRef.current.seekTo(lastPosition);
                    }
                }}
            />
            <p className="text-gray-600 mt-4">{video.description}</p>
            <p className="text-gray-800 font-semibold mt-4">
                Watched Progress: {calculateProgress()}%
            </p>
        </div>
    );
};

export default VideoDetails;