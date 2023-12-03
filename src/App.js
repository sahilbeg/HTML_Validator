import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ChooseFilePage from './Components/ChooseFilePage';  // Correct import
import AnalyzeHtmlPage from './Components/AnalyzeHtmlPage';
import LinkCheckPage from './Components/LinkCheckPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set the default route to ChooseFilePage */}
        <Route path="/" element={<Navigate to="/choose-file" />} />
        <Route path="/choose-file" element={<ChooseFilePage />} />
        <Route path="/analyze" element={<AnalyzeHtmlPage />} />
        <Route path="/linkcheck" element={<LinkCheckPage />} />
      </Routes>
    </Router>
  );
};

export default App;
