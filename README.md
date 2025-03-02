# NY News App

A React + Typescript application that displays news articles from The New York Times API with infinite scrolling and automatic updates.

## Features

- Real-time news updates with automatic polling
- Infinite scroll pagination
- Articles grouped by publication date
- Error handling and loading states

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- Vitest for testing
- CSS Modules for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd nynews
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your NY Times API key:
```
VITE_NYT_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Running Tests

```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
src/
├── components/      # React components
├── store/          # Redux store and slices
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── styles/         # Global styles and variables
└── tests/          # Test files
```
