# Where's Brian? - Backend Server

The backend API server for the "Where's Brian?" game, built with Express, TypeScript, and Prisma. This server handles photo data retrieval, character coordinate validation, and game state management.

## 🎮 Features

- **RESTful API**: Clean and simple API endpoints for game functionality
- **Data Security**: Character coordinates are never exposed to the client
- **Server-side Validation**: Fair gameplay through backend coordinate checking
- **Database Management**: PostgreSQL database with Prisma ORM
- **Type Safety**: Full TypeScript implementation
- **Hot Reload**: Nodemon for automatic server restarts during development
- **Database Seeding**: Easy setup with pre-configured game data

## 🛠️ Tech Stack

- **Express 5.1** - Web framework
- **TypeScript** - Type-safe development
- **Prisma 6.19** - Modern ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Nodemon** - Development auto-reload
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database (local or remote)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Database Setup

1. **Create a PostgreSQL database** or have connection details ready

2. **Configure environment variables**

Create a `.env` file in the server directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/wherewaldo?schema=public"
PORT=3000
```

3. **Run Prisma migrations**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init_schema
```

4. **Seed the database**

```bash
# Populate database with initial game data
npx prisma db seed
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

The server will be available at `http://localhost:3000`.

### Production

```bash
# Start production server
npm start
```

## 📁 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma        # Database schema definition
│   ├── seed.ts             # Database seed file
│   └── migrations/         # Migration history
├── src/
│   ├── index.ts            # Application entry point
│   ├── controllers/        # Request handlers
│   │   ├── get.controller.ts
│   │   └── validate.controller.ts
│   ├── routes/             # Route definitions
│   │   ├── get.routes.ts
│   │   └── validate.routes.ts
│   └── generated/          # Prisma generated files
├── img/                    # Game images
├── nodemon.json            # Nodemon configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🔌 API Endpoints

### GET `/api/photos`

Retrieves all available photos with their associated characters (without coordinates).

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

**Security Note:** Character coordinates (`x_percent`, `y_percent`) are intentionally excluded from the response to prevent cheating.

### POST `/api/validate`

Validates if a character has been found at the specified coordinates.

**Request Body:**
```json
{
  "photoId": 1,
  "characterId": 1,
  "x": 64.5,
  "y": 32.0
}
```

**Parameters:**
- `photoId` (number): ID of the photo being played
- `characterId` (number): ID of the character being selected
- `x` (number): X coordinate as percentage (0-100)
- `y` (number): Y coordinate as percentage (0-100)

**Response:**
```json
{
  "found": true
}
```

**Validation Logic:**
- Uses a 2% tolerance "hit box" for both X and Y coordinates
- Returns `true` if click is within ±2% of actual character position
- Returns `false` otherwise

**Error Responses:**
- `400`: Missing required fields
- `404`: Character not found
- `500`: Internal server error

## 🗄️ Database Schema

### Photo Model
```prisma
model Photo {
  id         Int         @id @default(autoincrement())
  name       String      @unique
  URL        String      @unique
  characters Character[]
  scores     Score[]
}
```

### Character Model
```prisma
model Character {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  x_percent Float    // X coordinate as percentage
  y_percent Float    // Y coordinate as percentage
  photoId   Int
  photo     Photo    @relation(fields: [photoId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

### Score Model
```prisma
model Score {
  id      Int    @id @default(autoincrement())
  name    String // Player name
  time    Int    // Completion time in milliseconds
  photoId Int
  photo   Photo  @relation(fields: [photoId], references: [id], onDelete: Cascade)
}
```

## 🌱 Database Seeding

The seed file (`prisma/seed.ts`) populates the database with initial game data:

```typescript
// Default seeded data:
Photo: "Brain Map"
Characters:
  - Waldo (64.86%, 31.94%)
  - Wizard (43.75%, 42.92%)
```

To modify seed data:
1. Edit `prisma/seed.ts`
2. Run `npx prisma db seed`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port number | `3000` |

### Nodemon Configuration

Located in `nodemon.json`:
- **Watch**: `src` directory
- **Extensions**: `.ts` files
- **Ignore**: Test files (`*.spec.ts`)
- **Execute**: `ts-node ./src/index.ts`

### CORS

CORS is enabled for all origins by default. For production, configure specific origins:

```typescript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## 🎯 Key Features Explained

### Coordinate Sanitization

The `getPhotos` controller intentionally removes coordinate data:

```typescript
const sanitizedPhotos = photos.map((photo) => ({
  id: photo.id,
  name: photo.name,
  url: photo.URL,
  characters: photo.characters.map((char) => ({
    id: char.id,
    name: char.name,
    // x_percent and y_percent are NOT included
  })),
}));
```

This ensures fair gameplay by preventing client-side coordinate inspection.

### Validation Algorithm

The server uses a tolerance-based validation:

```typescript
const isXValid = Math.abs(character.x_percent - x) < 2;
const isYValid = Math.abs(character.y_percent - y) < 2;
return { found: isXValid && isYValid };
```

- **2% tolerance**: Accounts for click precision and character size
- **Percentage-based**: Works with any image resolution
- **Both axes required**: Both X and Y must be within range

## 🧪 Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## 🐛 Troubleshooting

**Database connection errors:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists and credentials are correct
- Test connection: `npx prisma db push`

**Migration errors:**
- Check for schema conflicts
- Review migration files in `prisma/migrations/`
- Reset database: `npx prisma migrate reset` (development only)

**Port already in use:**
- Change `PORT` in `.env` file
- Kill existing process: `lsof -ti:3000 | xargs kill` (Linux/Mac)

**Prisma Client errors:**
- Regenerate client: `npx prisma generate`
- Ensure migrations are applied: `npx prisma migrate dev`

**Seed fails:**
- Check for unique constraint violations
- Clear existing data: `npx prisma migrate reset`
- Verify seed data format in `prisma/seed.ts`



## 🚀 Performance & Best Practices

- **Database Queries**: Uses Prisma's `include` for efficient relational queries
- **Error Handling**: Comprehensive try-catch blocks with proper status codes
- **Type Safety**: Full TypeScript implementation prevents runtime errors
- **Connection Pooling**: Prisma handles database connections efficiently
- **Middleware Order**: CORS, JSON parsing, and URL encoding properly configured

## 🔒 Security Considerations

1. **Coordinate Protection**: Never expose character coordinates to client
2. **Input Validation**: All request parameters are validated
3. **Error Messages**: Generic error messages prevent information leakage
4. **CORS**: Configure allowed origins for production
5. **Environment Variables**: Sensitive data stored in `.env` (gitignored)


