// App.tsx: Main application file with navigation
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AskQuestionPage from './AskQuestionPage';
import SummaryPage from './SummaryPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <nav className="flex space-x-4 mb-6">
          <Link to="/" className="text-blue-500 hover:underline">Ask a Question</Link>
          <Link to="/summary" className="text-blue-500 hover:underline">Summary Page</Link>
        </nav>
        <Routes>
          <Route path="/" element={<AskQuestionPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
