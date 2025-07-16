import React from 'react';

export default function DataEnvironment() {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://prototype-data-platform-bvzq.vercel.app/visualize"
        className="w-full h-screen border-0"
        title="Data Environment Visualization"
        allowFullScreen
      />
    </div>
  );
}