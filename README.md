# Where's Brian? 🔍

A full-stack "Where's Waldo"-style game where players search for hidden characters in detailed images. Built with a robust Express/TypeScript backend and a React frontend, featuring server-side validation to ensure fair gameplay.

## 📖 Overview

This project implements an interactive photo search game with:
- **Server-side coordinate validation** to prevent cheating
- **PostgreSQL database** with Prisma ORM for data management
- **RESTful API** architecture
- **React frontend** with real-time feedback
- **Type-safe development** using TypeScript throughout

## 🏗️ Architecture

```
Where-Waldo/
├── server/          # Express + TypeScript + Prisma backend
├── client/          # React + TypeScript + Vite frontend
└── README.md        # This file
```

---

## 🖥️ Server (Backend)

### Tech Stack

- **Express 5.1** - Web framework
- **TypeScript** - Type-safe development
- **Prisma 6.19** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Node.js** - Runtime environment

### Key Features

#### 🔒 Security First
- Character coordinates are **never exposed** to the client
- Server-side validation prevents coordinate inspection/cheating
- Sanitized API responses exclude sensitive data
- Environment-based configuration

#### 🎯 Smart Validation
- **2% tolerance hit box** for fair coordinate matching
- Percentage-based coordinates work with any resolution
- Both X and Y axes must be within tolerance
- Robust error handling with proper HTTP status codes

#### 📊 Database Design
Three core models:
- **Photo**: Game images with associated characters
- **Character**: Hidden characters with precise coordinates
- **Score**: Leaderboard tracking (ready for future implementation)

### Quick Start (Server)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

### API Endpoints

#### `GET /api/photos`
Fetches all available photos with character lists (coordinates excluded).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Brain Map",
    "url": "../img/brian.jpeg",
    "characters": [
      { "id": 1, "name": "Waldo" },
      { "id": 2, "name": "Wizard" }
    ]
  }
]
```

#### `POST /api/validate`
Validates if a character was correctly identified at given coordinates.

**Request:**
```json
{
  "photoId": 1,
  "characterId": 1,
  "x": 64.5,
  "y": 32.0
}
```

**Response:**
```json
{
  "found": true
}
```

### Database Schema

```prisma
model Photo {
  id         Int         @id @default(autoincrement())
  name       String      @unique
  URL        String      @unique
  characters Character[]
  scores     Score[]
}

model Character {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  x_percent Float    // Percentage-based X coordinate
  y_percent Float    // Percentage-based Y coordinate
  photoId   Int
  photo     Photo    @relation(fields: [photoId], references: [id])
}

model Score {
  id      Int    @id @default(autoincrement())
  name    String
  time    Int    // Completion time in ms
  photoId Int
  photo   Photo  @relation(fields: [photoId], references: [id])
}
```

### Environment Configuration

Create `.env` in the server directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/wherewaldo?schema=public"
PORT=3000
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name migration_name

# Seed database with initial data
npx prisma db seed

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (dev only)
npx prisma migrate reset
```

### Project Structure (Server)

```
server/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Initial data seeding
│   └── migrations/             # Migration history
├── src/
│   ├── index.ts                # App entry point
│   ├── controllers/            # Business logic
│   │   ├── get.controller.ts   # Photo retrieval
│   │   └── validate.controller.ts  # Coordinate validation
│   ├── routes/                 # Route definitions
│   │   ├── get.routes.ts
│   │   └── validate.routes.ts
│   └── generated/              # Prisma generated files
├── img/                        # Game images
├── nodemon.json                # Dev server config
├── tsconfig.json               # TypeScript config
└── package.json
```

### How Validation Works

1. Client sends click coordinates as percentages (0-100)
2. Server queries database for character's actual coordinates
3. Compares using tolerance-based algorithm:
   ```typescript
   const isXValid = Math.abs(character.x_percent - x) < 2;
   const isYValid = Math.abs(character.y_percent - y) < 2;
   return { found: isXValid && isYValid };
   ```
4. Returns boolean result to client
5. Coordinates remain secret throughout the process

### Security Measures

✅ Coordinate sanitization in `getPhotos` controller  
✅ Input validation on all endpoints  
✅ Proper error handling without information leakage  
✅ Environment variables for sensitive configuration  
✅ CORS configuration for production deployment  

---

## 🎨 Client (Frontend)

### Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Axios** - HTTP client

### Features Summary

- **Interactive gameplay** with click-to-select mechanics
- **Visual feedback** via character checklist and markers
- **Toast notifications** for found/not found feedback
- **Win detection** with completion time tracking
- **Responsive UI** with modern styling

### Quick Start (Client)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Client runs on `http://localhost:5173`

For detailed client documentation, see [`client/README.md`](./client/README.md)

---

## 🚀 Full Stack Setup

### Prerequisites

- Node.js v18+
- PostgreSQL database
- npm or yarn

### Complete Installation

```bash
# Clone repository
git clone https://github.com/0xYurii/Where-Waldo.git
cd Where-Waldo

# Setup server
cd server
npm install
cp .env.example .env
# Configure DATABASE_URL in .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# In a new terminal, setup client
cd ../client
npm install
npm run dev
```

### Running the Game

1. **Start Backend**: `cd server && npm run dev` → http://localhost:3000
2. **Start Frontend**: `cd client && npm run dev` → http://localhost:5173
3. **Play**: Open browser to http://localhost:5173

---

## 🎮 How to Play

1. The game loads a photo with a list of characters to find
2. Click on the image where you think a character is located
3. Select the character name from the dropdown menu
4. Correct selections are marked with green circles
5. Find all characters as quickly as possible!

---

## 🔧 Development

### Server Development

```bash
cd server
npm run dev      # Start with auto-reload
npm run start    # Production mode
```

### Client Development

```bash
cd client
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📊 Database Management

### Viewing Data

```bash
cd server
npx prisma studio
```

Opens a web interface at http://localhost:5555 to view/edit database records.

### Adding New Characters

1. **Update seed file** (`server/prisma/seed.ts`):
   ```typescript
   {
     name: "Character Name",
     x_percent: 50.5,  // X coordinate as %
     y_percent: 25.8,  // Y coordinate as %
   }
   ```

2. **Re-seed database**:
   ```bash
   npx prisma db seed
   ```

### Database Reset

```bash
cd server
npx prisma migrate reset  # Drops all data and re-runs migrations + seed
```

---

## 🐛 Troubleshooting

### Server Issues

**Database connection failed:**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Test: `npx prisma db push`

**Port 3000 in use:**
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill`

**Prisma errors:**
- Regenerate client: `npx prisma generate`
- Apply migrations: `npx prisma migrate dev`

### Client Issues

**API connection failed:**
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify `API_BASE_URL` in `client/src/App.tsx`

**Image not loading:**
- Place game image in `client/public/game-map.jpeg`
- Check browser console for 404 errors

---

## 🎯 Future Enhancements

- [ ] Leaderboard system (Score model ready)
- [ ] User authentication (JWT dependencies installed)
- [ ] Multiple difficulty levels
- [ ] Real-time multiplayer
- [ ] Achievement system
- [ ] Mobile responsiveness improvements

---

## 📁 Repository Structure

```
Where-Waldo/
├── server/
│   ├── prisma/              # Database schema & migrations
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   └── index.ts         # Server entry
│   ├── img/                 # Game images
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.tsx          # Main game component
│   │   ├── main.tsx         # React entry
│   │   └── assets/
│   ├── public/              # Static files
│   └── package.json
└── README.md                # This file
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (both frontend and backend)
5. Submit a pull request

---

## 📄 License

This project is part of the Where's Brian? game.

---

## 📚 Documentation

- [Server Documentation](./server/README.md) - Detailed backend guide
- [Client Documentation](./client/README.md) - Frontend implementation details
- [Prisma Docs](https://www.prisma.io/docs) - ORM reference
- [Express Docs](https://expressjs.com/) - Web framework guide

---

**Built with ❤️ using TypeScript, Express, React, and Prisma**
