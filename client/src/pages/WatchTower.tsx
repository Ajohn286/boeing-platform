import React, { useEffect } from 'react';

export default function WatchTower() {
  useEffect(() => {
    // Try to inject CSS to hide navbar elements
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const style = iframeDoc.createElement('style');
            style.textContent = `
              nav, header, .navbar, .header, [class*="nav"], [class*="header"] {
                display: none !important;
              }
            `;
            iframeDoc.head.appendChild(style);
          }
        } catch (error) {
          // Cross-origin restrictions will prevent this from working
          console.log('Cannot modify iframe content due to cross-origin restrictions');
        }
      };
    }
  }, []);

  return (
    <div className="w-full h-full">
      {/* Header with Boeing Logo */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <img
            src="/media/Boeing_logo.png"
            alt="Boeing"
            className="h-8 w-auto mr-4"
          />
          <h1 className="text-xl font-semibold text-gray-900">Boeing Control Tower</h1>
        </div>
      </div>
      <div className="h-[calc(100vh-4rem)]">
        <iframe
          src="https://boeingneuron.vercel.app/"
          className="w-full h-full border-0"
          title="Boeing Control Tower"
          allowFullScreen
        />
      </div>
    </div>
  );
} 