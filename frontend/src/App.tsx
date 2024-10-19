import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AskQuestionPage from './AskQuestionPage';
import SummaryPage from './SummaryPage';
import AmbientBackground from './AmbientBackground';  // Import the background component

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Ambient background that takes the full viewport and stays behind */}
      <AmbientBackground />

      {/* Main content */}
      <Router>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-2">
          {/* Navigation links */}
          {/* <nav className="flex space-x-4 mb-6">
            <Link to="/" className="text-blue-500 hover:underline">Ask a Question</Link>
            <Link to="/summary" className="text-blue-500 hover:underline">Summary Page</Link>
          </nav> */}

          {/* Page routes */}
          {/* <Routes>
            <Route path="/" element={<AskQuestionPage />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes> */}
        </div>
      </Router>
    </div>
  );
};

export default App;
