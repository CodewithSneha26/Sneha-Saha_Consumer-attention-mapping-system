import React, { createContext, useContext, useState } from 'react';

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [videoAnalysisResults, setVideoAnalysisResults] = useState(null);
  const [shelfDetectionResults, setShelfDetectionResults] = useState(null);

  return (
    <ResultsContext.Provider value={{
      videoAnalysisResults, setVideoAnalysisResults,
      shelfDetectionResults, setShelfDetectionResults,
    }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  return useContext(ResultsContext);
}