// IndexSelector.tsx
import React, { useState } from 'react';
import { useIndex } from './IndexContext';
import { predefinedVariables } from './predefinedVariables';

const IndexSelector: React.FC = () => {
  const { setVariable } = useIndex();
  const [selectedIndex, setSelectedIndex] = useState<number>(1);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSelectedIndex(newValue);

    // Update all the variables based on the selected index using the predefinedVariables object
    const updatedVariables = predefinedVariables[newValue];
    Object.entries(updatedVariables).forEach(([key, value]) => {
      setVariable(key as keyof typeof updatedVariables, value);
    });
  };

  return (
    <div className="mb-6">
      <label htmlFor="indexSelector" className="block text-sm font-medium text-gray-700 mb-2">
        Select a Category Index (1 to 5):
      </label>
      <select
        id="indexSelector"
        value={selectedIndex}
        onChange={handleSelectChange}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value={1}>1 - Earth</option>
        <option value={2}>2 - Water</option>
        <option value={3}>3 - Air</option>
        <option value={4}>4 - Fire</option>
        <option value={5}>5 - Aether</option>
      </select>
    </div>
  );
};

export default IndexSelector;
