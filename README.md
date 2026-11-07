# PT. Reliable Future Technology - Corporate Website

A high-performance, secure, and visually stunning corporate website built with Next.js, featuring a premium dark mode design inspired by modern technology agencies.

## 🚀 Technology Stack

- **Framework:** Next.js 16 (App Router) with React Server Components
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **State Management:** Zustand
- **Validation:** Zod
- **Animations:** Framer Motion
- **Caching:** DragonflyDB (Redis-compatible, multi-threaded)
- **Database:** PostgreSQL 15
- **Authentication:** Auth.js (email + password admin accounts stored in PostgreSQL)
- **Object Storage:** MinIO (S3-compatible)
- **Containerization:** Docker (multi-stage build)

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- DragonflyDB (runs in Docker, Redis-compatible)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Node Environment
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rft_blog

# Authentication
AUTH_SECRET=your-32-character-secret-here-minimum

# DragonflyDB Configuration (Redis-compatible)
REDIS_URL=redis://:your-password@localhost:6379
REDIS_PASSWORD=your-secure-redis-password-change-this

# MinIO/S3 Configuration
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=blog-images
S3_REGION=us-east-1

# Next.js Public Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** 
- Set a strong `AUTH_SECRET` (minimum 32 characters)
- Push the schema (`npm run db:push`) and create the first admin: `npm run admin:create -- --email you@example.com --name "Your Name"`, then log in at `/login`
- Configure MinIO bucket (see `SETUP_MINIO.md`)
- Set strong passwords for production

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 4. Production Build

```bash
npm run build
npm start
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

This will start both the Next.js application and DragonflyDB:

```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000).

To stop the containers:

```bash
docker-compose down
```

### Using Docker Only

Build the image:

```bash
docker build -t rft-website .
```

Run the container (requires DragonflyDB to be running separately):

```bash
docker run -p 3000:3000 \
  -e REDIS_URL=redis://:your-password@your-dragonfly-host:6379 \
  -e REDIS_PASSWORD=your-dragonfly-password \
  rft-website
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with navbar and footer
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles and theme
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx         # Navigation bar
│   ├── footer.tsx         # Footer component
│   ├── hero-section.tsx   # Homepage hero section
│   ├── services-section.tsx # Services grid
│   └── trusted-by-section.tsx # Client marquee
├── lib/                   # Utility libraries
│   ├── env.ts            # Environment variable validation (Zod)
│   ├── redis.ts          # DragonflyDB/Redis client initialization
│   └── utils.ts          # Utility functions
├── store/                 # Zustand stores
│   └── useUIStore.ts     # UI state management
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Docker Compose configuration
└── next.config.ts        # Next.js configuration with security headers
```

## 🔒 Security Features

- **Security Headers:** Implemented in `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)
- **Non-root Docker User:** Container runs as non-root user for enhanced security
- **Input Validation:** Zod schemas for environment variables and form validation
- **Secure Cookies:** Configured for production use

## 🎨 Design System

The website features a premium dark mode design with:

- **Typography:** Inter font family for modern, clean aesthetics
- **Color Palette:** Dark theme with subtle gradients and accent colors
- **Animations:** Smooth scroll reveals and hover effects using Framer Motion
- **Layout:** Generous whitespace and clean grid layouts

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### DragonflyDB Connection

The application uses DragonflyDB (Redis-compatible, multi-threaded) for caching. Configure the connection via environment variables:

- `REDIS_URL`: Full connection URL with password (e.g., `redis://:password@localhost:6379`)
- `REDIS_HOST` & `REDIS_PORT`: Alternative to REDIS_URL
- `REDIS_PASSWORD`: Required password for DragonflyDB authentication

**Note:** Variable names use "REDIS" prefix for compatibility, but the application uses DragonflyDB which is fully Redis-compatible. All Redis commands work seamlessly with DragonflyDB.

### Next.js Configuration

Security headers and standalone output are configured in `next.config.ts`. The standalone output is required for Docker deployment.

## 🚧 Development Notes

- The application uses React Server Components by default
- Client components are marked with `'use client'` directive
- Zustand is used for client-side UI state (e.g., mobile menu)
- Framer Motion is used for animations and scroll reveals

## 📄 License

Copyright © 2024 PT. Reliable Future Technology. All rights reserved.
