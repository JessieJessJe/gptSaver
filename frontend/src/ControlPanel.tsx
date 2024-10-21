import React from 'react';
import { useIndex } from './IndexContext';

const ControlPanel: React.FC = () => {
  const { variables, setVariable } = useIndex();

  const variableConfig = {
    timeMultiplier: { min: 0.1, max: 5.0, step: 0.1 },
    smoothFactor: { min: 0.1, max: 1.0, step: 0.01 },
    radiusMultiplier: { min: 0.5, max: 10.0, step: 0.5 },
    aMultiplier: { min: 1.0, max: 100.0, step: 1.0 },
    bMultiplier: { min: 1.0, max: 100.0, step: 1.0 },
  };

  return (
    <div className="relative top-0 left-0 m-0 p-4 bg-white bg-opacity-75 rounded-md shadow-lg z-10">
      <h3 className="text-lg font-semibold mb-4">Control Panel</h3>
      {Object.keys(variables).map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {key}: {variables[key as keyof typeof variables]}
          </label>
          <input
            type="range"
            min={variableConfig[key as keyof typeof variableConfig].min}
            max={variableConfig[key as keyof typeof variableConfig].max}
            step={variableConfig[key as keyof typeof variableConfig].step}
            value={variables[key as keyof typeof variables]}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              setVariable(key as keyof typeof variables, newValue);
            }}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default ControlPanel;
