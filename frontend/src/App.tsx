import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { IndexProvider } from './IndexContext';
import AskQuestionPage from './AskQuestionPage';
import SummaryPage from './SummaryPage';
import LandingPage from './LandingPage';
import Playground from './Playground';



const App: React.FC = () => {
  return (
    <IndexProvider>
    <div className="relative min-h-screen w-full bg-black">

      <Router>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-0">
         
          <nav className="flex space-x-4 mb-6">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
            <Link to="/question" className="text-blue-500 hover:underline">Ask a Question</Link>
            <Link to="/summary" className="text-blue-500 hover:underline">Summary Page</Link>
            <Link to="/playground" className="text-blue-500 hover:underline">Playground</Link>
          </nav> 

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/question" element={<AskQuestionPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/playground" element={<Playground />} />
          </Routes> 
        </div>
      </Router>
    </div>
    </IndexProvider>
  );
};

export default App;
