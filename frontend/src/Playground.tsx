import React from 'react';
import AmbientBackground from "./AmbientBackground"
import ControlPanel from './ControlPanel';


const Playground: React.FC = () => {
    return(
      <>
    <ControlPanel />
    <AmbientBackground index={0}/>
      </>
    )
}

export default Playground;