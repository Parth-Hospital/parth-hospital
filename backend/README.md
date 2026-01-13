# Parth Hospital Backend API

Healthcare ERP Backend built with Node.js, Fastify, Supabase, and Prisma.

## 🚀 Tech Stack

- **Node.js** + **TypeScript**
- **Fastify** - Web framework
- **Supabase** (PostgreSQL) - Database
- **Prisma** - ORM
- **Cloudinary** - File storage
- **JWT** + **bcrypt** - Authentication
- **Zod** - Validation

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn
- Supabase account and database
- Cloudinary account

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in `.env`

3. **Set up Prisma:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── validators/      # Zod schemas
│   ├── app.ts           # Fastify app setup
│   └── server.ts        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📚 API Documentation

API documentation will be available at `/api/docs` (to be implemented).

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt
- Helmet for security headers
- Rate limiting
- CORS configuration
- Input validation with Zod

## 📄 License

ISC
