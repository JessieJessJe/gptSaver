import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { IndexProvider } from './IndexContext';
import AskQuestionPage from './AskQuestionPage';
import SummaryPage from './SummaryPage';
import AmbientBackground from './AmbientBackground'; 
import IndexSelector from './IndexSelector';

const App: React.FC = () => {
  return (
    <IndexProvider>
    <div className="relative min-h-screen w-full">
      <AmbientBackground />

      <Router>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-0">
          <IndexSelector/>
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
    </div>
    </IndexProvider>
  );
};

export default App;
