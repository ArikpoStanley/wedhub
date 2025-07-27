# Wedding Website Application

## Overview

This is a modern wedding website application for Olufunbi & Joseph's wedding celebration on August 2nd, 2025. The application is built using a full-stack TypeScript architecture with React frontend and Express backend, featuring elegant design, responsive layout, and wedding-specific functionalities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Router**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with hot module replacement
- **Animation**: Framer Motion for smooth transitions and effects

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: express-session with PostgreSQL session store
- **API**: RESTful endpoints with `/api` prefix

### Development Environment
- **Replit Integration**: Cartographer plugin for development debugging
- **Hot Reload**: Full-stack development with automatic reloading
- **Error Handling**: Runtime error overlay for development

## Key Components

### Frontend Components
- **Wedding Theme UI**: Custom wedding-themed components with burgundy and rose color palette
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Elements**:
  - Countdown timer to wedding date
  - Photo gallery with carousel
  - RSVP functionality
  - Registry integration
  - Schedule display
- **Accessibility**: Radix UI primitives for keyboard navigation and screen readers

### Backend Components
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **User Management**: Basic user schema with authentication support
- **Database Integration**: Drizzle ORM with PostgreSQL dialect
- **Session Handling**: Secure session management with connect-pg-simple

### Shared Components
- **Schema Definitions**: Centralized data models using Drizzle and Zod
- **Type Safety**: Full TypeScript coverage across client and server

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and interact with storage layer
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: JSON responses with error handling middleware
5. **State Updates**: React Query manages caching and synchronization

## External Dependencies

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth user interactions
- **Google Fonts**: Custom typography (Dancing Script, Playfair Display, Inter)

### Database and ORM
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Schema validation library

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite bundles React application to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle handles schema migrations

### Environment Configuration
- **Development**: Uses tsx for hot reloading and Vite dev server
- **Production**: Serves static files and runs compiled Express server
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (configured via DATABASE_URL)
- Static file serving capability
- Environment variables for configuration

### Scalability Considerations
- Stateless server design enables horizontal scaling
- Database connection pooling through Neon serverless
- CDN-ready static asset structure
- Session storage in PostgreSQL for multi-instance deployments