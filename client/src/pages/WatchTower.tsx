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
      <iframe
        src="https://airbuswatchtower.vercel.app/"
        className="w-full h-screen border-0"
        title="Airbus Control Tower"
        allowFullScreen
      />
    </div>
  );
} 