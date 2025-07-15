# Airbus Predictive Maintenance Platform

## Overview

This platform is a modern, full-stack web application for predictive maintenance (Airbus demo). It features:
- AI-powered aircraft maintenance demo (Agentic Four-Box)
- Predictive dashboards and tools
- Modular, extensible architecture
- Modern React, TypeScript, Vite, Tailwind, and shadcn/ui

## Key Features

### Predictive Maintenance (Airbus Demo)
- Multi-agent, multi-modal dashboard for aircraft maintenance
- Video, audio, document, and web data quadrants
- AI agent chat and decision support
- Maintenance alert queue, claim detail, and agent mobilization flows
- Realistic demo assets (screen recordings, audio, etc.)

## Project Structure
- `client/` — Frontend React app (TypeScript, Vite, shadcn/ui)
- `server/` — Node.js/Express backend (TypeScript, Drizzle ORM)
- `shared/` — Shared types and schema
- `client/src/assets/` — Demo video, audio, and image assets

## Setup & Development

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+) or yarn

### Installation
```bash
git clone https://github.com/invisible-tech/airbus-1.git
cd airbus/airbus
npm install
```

### Running the App
```bash
npm run dev
```
- The app will be available at the URL shown in the terminal (e.g. http://localhost:5173)

## Demo Routes
- `/agentic-claim-queue` — Maintenance alert queue (start here for demo)
- `/agentic-claim-detail/:claimId` — Alert/claim detail view
- `/agentic-agent-mobilization` — Select AI agents for analysis
- `/agentic-splash` — Demo splash/intro
- `/agentic-dashboard` — Four-box predictive maintenance dashboard
- `/quality-inspection` — Computer vision defect detection demo
- `/platform` — Wealth management dashboard

## Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit and push your changes
4. Open a Pull Request

## License
MIT License

## Contact
For questions or support, contact the Invisible Tech team.
