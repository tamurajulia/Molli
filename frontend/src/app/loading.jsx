'use client';

import React from 'react';
import './Loader.css'; // vamos criar um arquivo CSS separado

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <svg className="pl" viewBox="0 0 240 240">
        <circle className="pl__ring pl__ring--a" cx={120} cy={120} r={105} />
        <circle className="pl__ring pl__ring--b" cx={120} cy={120} r={35} />
        <circle className="pl__ring pl__ring--c" cx={85} cy={120} r={70} />
        <circle className="pl__ring pl__ring--d" cx={155} cy={120} r={70} />
      </svg>
    </div>
  );
};

export default Loader;
