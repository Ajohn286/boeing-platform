# Media Directory

This directory contains local video files for the Airbus Review LHM application.

## How to Add Videos

1. Place your video files (MP4, MOV, etc.) in this directory
2. Reference them in components using just the filename:

```tsx
<LocalVideoPlayer 
  videoFileName="your-video.mp4" 
  title="Your Video Title" 
/>
```

## Supported Formats

- MP4 (recommended)
- MOV
- WebM
- AVI

## File Size Considerations

- Keep videos under 100MB for better performance
- Consider using video compression tools
- For larger files, consider using external hosting (YouTube, Vimeo, etc.)

## Example Files

You can add files like:
- `aircraft-demo.mp4`
- `maintenance-walkthrough.mov`
- `platform-overview.mp4`

These will be accessible at `/media/filename.ext` in your application. 