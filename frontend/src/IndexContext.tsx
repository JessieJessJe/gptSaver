// IndexContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Variables {
  timeMultiplier: number;
  smoothFactor: number;
  radiusMultiplier: number;
  aMultiplier: number;
  bMultiplier: number;
}

interface IndexContextProps {
  variables: Variables;
  setRadiusMultiplier: (radiusMultiplier: number) => void;
  setVariable: (key: keyof Variables, value: number) => void;
}

const IndexContext = createContext<IndexContextProps | undefined>(undefined);

export const IndexProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [variables, setVariables] = useState<Variables>({
    timeMultiplier: 1.0,
    smoothFactor: 0.5,
    radiusMultiplier: 1.0,
    aMultiplier: 10.0,
    bMultiplier: 20.0,
  });

  const setRadiusMultiplier = (radiusMultiplier: number) => {
    setVariables((prev) => ({
      ...prev,
      radiusMultiplier,
    }));
  };

  const setVariable = (key: keyof Variables, value: number) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <IndexContext.Provider value={{ variables, setRadiusMultiplier, setVariable }}>
      {children}
    </IndexContext.Provider>
  );
};

export const useIndex = () => {
  const context = useContext(IndexContext);
  if (!context) {
    throw new Error('useIndex must be used within an IndexProvider');
  }
  return context;
};
