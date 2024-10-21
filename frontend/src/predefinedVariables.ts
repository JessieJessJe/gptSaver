interface Variables {
    timeMultiplier: number;
    smoothFactor: number;
    radiusMultiplier: number;
    aMultiplier: number;
    bMultiplier: number;
  }

//   <option value={1}>1 - Earth</option>
//   <option value={2}>2 - Water</option>
//   <option value={3}>3 - Air</option>
//   <option value={4}>4 - Fire</option>
//   <option value={5}>5 - Aether</option>
  
  export const predefinedVariables: Record<number, Variables> = {
    1: {
      timeMultiplier: 0.5,
      smoothFactor: 0.61,
      radiusMultiplier: 5.0,
      aMultiplier: 2.0,
      bMultiplier: 6.0,
    },
    2: {
      timeMultiplier: 3.5,
      smoothFactor: 0.9,
      radiusMultiplier: 1.0,
      aMultiplier: 50.0,
      bMultiplier: 5.0,
    },
    3: {
      timeMultiplier: 0.5,
      smoothFactor: 0.97,
      radiusMultiplier: 3.5,
      aMultiplier: 4.0,
      bMultiplier: 88.0,
    },
    4: {
      timeMultiplier: 1.5,
      smoothFactor: 0.86,
      radiusMultiplier: 1.5,
      aMultiplier:3.0,
      bMultiplier:5.0,
    },
    5: {
      timeMultiplier: 1.1,
      smoothFactor: 0.54,
      radiusMultiplier: 9.0,
      aMultiplier: 10.0,
      bMultiplier: 10.0,
    },
  };
  