import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import VideoDetails from '../pages/VideoDetails';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoDetails />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;