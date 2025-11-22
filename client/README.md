# Where's Brian? - Frontend

The frontend client for the "Where's Brian?" game, built with React, TypeScript, and Vite. This is an interactive "Where's Waldo"-style game where players search for specific characters in a detailed image.

## 🎮 Features

- **Interactive Gameplay**: Click on the image to select character locations
- **Real-time Validation**: Server-side validation ensures fair gameplay
- **Visual Feedback**: 
  - Character checklist showing found/remaining characters
  - Green markers indicate successfully found characters
  - Toast notifications for feedback
  - Click indicators to show selection points
- **Timer**: Track how long it takes to find all characters
- **Win Condition**: Celebration modal displays when all characters are found
- **Responsive UI**: Clean, modern interface with smooth interactions

## 🛠️ Tech Stack

- **React 19.2** - UI framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API requests
- **ESLint** - Code linting with React-specific rules

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Backend server running (see `/server` directory)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🎯 How to Play

1. **Start the Game**: The game loads automatically with a photo and list of characters to find
2. **Search**: Look for the characters listed at the top of the screen
3. **Click**: When you spot a character, click on their location in the image
4. **Select**: Choose the character's name from the dropdown menu
5. **Feedback**: 
   - ✅ Correct: Character is marked as found with a green circle
   - ❌ Wrong: Try again message appears
6. **Win**: Find all characters as quickly as possible!

## 🔧 Configuration

### API Endpoint

The frontend connects to the backend API at `http://localhost:3000/api` by default. To change this, update the `API_BASE_URL` constant in `src/App.tsx`:

```typescript
const API_BASE_URL = "http://localhost:3000/api";
```

### Game Image

Place your game image in `/public/game-map.jpeg` or update the image source in the App component.

## 📁 Project Structure

```
client/
├── public/              # Static assets
│   └── game-map.jpeg   # Main game image
├── src/
│   ├── App.tsx         # Main game component
│   ├── App.css         # App-specific styles
│   ├── main.tsx        # Application entry point
│   ├── index.css       # Global styles
│   └── assets/         # Additional assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Key Components

### Main App Component (`App.tsx`)

The primary component handles:
- **State Management**: Photos, characters, selections, and game state
- **Image Interaction**: Click handling and coordinate calculation
- **API Communication**: Fetching photos and validating selections
- **UI Rendering**: Game board, character list, markers, and modals

### Key Interfaces

```typescript
interface Character {
  id: number;
  name: string;
}

interface Photo {
  id: number;
  name: string;
  url: string;
  characters: Character[];
}

interface FoundCharacter {
  id: number;
  name: string;
  x: number;
  y: number;
}
```

## 🔌 API Integration

### Endpoints Used

#### GET `/api/photos`
Fetches available photos with their associated characters.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Game Map",
    "url": "/game-map.jpeg",
    "characters": [
      { "id": 1, "name": "Brian" },
      { "id": 2, "name": "Waldo" }
    ]
  }
]
```

#### POST `/api/validate`
Validates if a character is found at the selected coordinates.

**Request:**
```json
{
  "photoId": 1,
  "characterId": 1,
  "x": 45.5,
  "y": 32.8
}
```

**Response:**
```json
{
  "found": true
}
```

## 🎨 Styling

The app uses inline styles for simplicity and component-level styling. Key design features:
- Dark theme with high contrast
- Green (#4caf50) for success states
- Smooth hover effects and transitions
- Responsive layout that scales with image size
- Custom cursor (crosshair) for gameplay

## 🧩 Development Notes

### TypeScript Configuration

The project uses three TypeScript configurations:
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Node/build tool settings

### ESLint

Configured with:
- React Hooks rules
- React Refresh plugin
- TypeScript ESLint
- Modern ES2020 globals

## 🐛 Troubleshooting

**Game image not loading:**
- Ensure `game-map.jpeg` exists in `/public` directory
- Check browser console for 404 errors

**API connection failed:**
- Verify backend server is running on `http://localhost:3000`
- Check CORS configuration on the backend
- Confirm API endpoints are accessible

**TypeScript errors:**
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript version matches `package.json`



## 🚀 Performance

The app is optimized for performance with:
- Vite's fast HMR (Hot Module Replacement)
- React 19's improved rendering
- Minimal re-renders through proper state management
- Efficient event handling with React synthetic events

