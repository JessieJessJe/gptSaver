interface Variables {
    timeMultiplier: number;
    smoothFactor: number;
    radiusMultiplier: number;
    aMultiplier: number;
    bMultiplier: number;
  }

  
  export const predefinedVariables: Record<number, Variables> = {
    1: {
      timeMultiplier: 0.8,
      smoothFactor: 0.11,
      radiusMultiplier: 0.7,
      aMultiplier: 3.0,
      bMultiplier: 2.0,
    },
    2: {
      timeMultiplier: 1.0,
      smoothFactor: 0.9,
      radiusMultiplier: 1.0,
      aMultiplier: 3.0,
      bMultiplier: 5.0,
    },
    3: {
      timeMultiplier: 1.3,
      smoothFactor: 0.87,
      radiusMultiplier: 1.1,
      aMultiplier: 9.0,
      bMultiplier: 2.0,
    },
    4: {
      timeMultiplier: 1.5,
      smoothFactor: 0.13,
      radiusMultiplier: 0.9,
      aMultiplier:1.0,
      bMultiplier:75.0,
    },
    5: {
      timeMultiplier: 1.1,
      smoothFactor: 0.54,
      radiusMultiplier: 9.0,
      aMultiplier: 10.0,
      bMultiplier: 10.0,
    },
  };
  