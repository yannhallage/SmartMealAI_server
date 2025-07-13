# SmartMeal Backend

Backend API for SmartMeal AI recipe generation built with Node.js, TypeScript, and Express.

## Features

- 🍳 AI-powered recipe generation
- 🔐 JWT authentication
- 📊 MongoDB database
- 🚀 RESTful API
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📝 TypeScript support

## Prerequisites

- Node.js 18+
- MongoDB
- OpenAI API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp env.example .env
   ```

4. Configure your `.env` file with your actual values

## Development

Start the development server:
```bash
npm run dev
```

## Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/recipes/generate` - Generate recipe (TODO)
- `GET /api/recipes/history` - Get recipe history (TODO)

## Docker

Build the Docker image:
```bash
docker build -t smartmeal-backend .
```

Run the container:
```bash
docker run -p 3000:3000 smartmeal-backend
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/         # API routes
├── services/       # Business logic
├── models/         # Database models
├── middlewares/    # Custom middlewares
├── config/         # Configuration files
├── app.ts          # Express app setup
└── server.ts       # Server entry point
``` 