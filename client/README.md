# Airbus Client

This is the frontend React application for the Airbus project, built with Vite and TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

This client can be deployed independently to platforms like Vercel, Netlify, or any static hosting service.

### Vercel Deployment

1. Connect your repository to Vercel
2. Set the root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Install command: `npm install`

### Environment Variables

If you need to connect to a backend API, set the appropriate environment variables in your deployment platform.

## Project Structure

- `src/` - React source code
- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and configurations
- `public/` - Static assets
- `dist/` - Build output (generated)

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Query
- Wouter (routing) 