import React from 'react';

export default function DataEnvironment() {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://boeingneuron.vercel.app/visualize"
        className="w-full h-screen border-0"
        title="Data Environment Visualization"
        allowFullScreen
      />
    </div>
  );
}