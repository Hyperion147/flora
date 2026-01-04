# Flora

Flora is a comprehensive digital plant directory designed to help users discover, identify, and map flora from around the world. It serves as a platform for plant enthusiasts to document their findings, manage their personal plant collections, and explore a global map of plant life.

## Features

- **Interactive Map**: Explore a real-time global map populated with plant discoveries. View locations where specific flora has been spotted.
- **Advanced Search**: A powerful search engine to find specific plants or browse through the directory.
- **Personal Dashboard**: A management interface for users to organize their own plant collections, track growth, and manage their contributions.
- **Leaderboard**: A gamified element where users can climb ranks based on their botanical discoveries and contributions to the platform.
- **Plant Identification & Tracking**: users can log details such as plant name, category, description, location (latitude/longitude), and images.

## Technology Stack

This project is built using a modern web development stack:

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP, Framer Motion
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Maps**: Leaflet / React-Leaflet
- **Authentication**: Supabase Auth
- **Forms & Validation**: React Hook Form, Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (Latest LTS recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd flora
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and configure the necessary environment variables for Supabase and your database connection.

5. Run the exploration server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 with your browser to see the application.

## Database Management

This project uses Drizzle ORM for database management.

- **Generate Migrations**: `npm run db:generate`
- **Push Schema**: `npm run db:push`
- **Run Migrations**: `npm run db:migrate`
- **Open Studio**: `npm run db:studio` (Opens Drizzle Studio to view database)

## Project Structure

- `src/app`: Application routes and pages (Next.js App Router).
- `src/components`: Reusable UI components.
- `src/db`: Database schema and configuration.
- `src/lib`: Utility functions and helper libraries.
- `public`: Static assets.

## License

[Add License Information Here]
