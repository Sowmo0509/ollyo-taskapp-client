# Task Management Application - Client

A modern task management application built with React, TypeScript, and Vite. This application features real-time updates using Laravel Echo and Pusher.

## Tech Stack

- React 19
- TypeScript
- Vite 6
- TailwindCSS
- React DnD (Drag and Drop)
- Zustand (State Management)
- Laravel Echo & Pusher (Real-time Features)

## Prerequisites

- Node.js (Latest LTS version recommended)
- PM2 (for production deployment)

## Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd web/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:80`

## Building for Production

1. Build the application:

   ```bash
   npm run build
   ```

2. Preview the production build:

   ```bash
   npm run preview
   ```

3. For production deployment using PM2:
   ```bash
   npm run start
   ```

## Features

- Modern React with TypeScript for type safety
- Real-time updates using Laravel Echo and Pusher
- Drag and Drop functionality for task management
- State management with Zustand
- Responsive design with TailwindCSS
- Icon support with Tabler Icons
- Form validation with Zod

## Development Tools

- ESLint for code linting
- TypeScript for static type checking
- Vite for fast development and building
- PostCSS and TailwindCSS for styling

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start production server with PM2
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  ├── assets/      # Static assets
  ├── components/  # React components
  ├── data/        # Data models and constants
  ├── hooks/       # Custom React hooks
  ├── services/    # API services
  ├── store/       # Zustand store
  ├── types/       # TypeScript types
  └── utils/       # Utility functions
```
