# Mini Fabric Marketplace

A full-stack fabric marketplace built with React, Node.js, TypeScript, Prisma, and PostgreSQL in a Turborepo monorepo.

## Features

- Browse fabric products with filtering and sorting
- Filter by fabric type, color, GSM range, and price
- Search products by name or color
- View detailed product information
- Add items to cart
- Manage cart (increase/decrease quantity, remove items)
- Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, React Router, Axios
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Monorepo**: Turborepo

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or pnpm

## Setup Instructions

### 1. Clone the repository

```bash
git clone 
cd fabric-marketplace
```

### 2. Install PostgreSQL

Make sure PostgreSQL is installed and running on your machine.

Create a new database:
```bash
psql -U postgres
CREATE DATABASE fabric_marketplace;
\q
```

### 3. Configure Environment Variables

Create `.env` file in `apps/backend/`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fabric_marketplace?schema=public"
PORT=5000
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install
cd ../..

# Install frontend dependencies
cd apps/frontend
npm install
cd ../..
```

### 5. Setup Database

```bash
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample products
npx prisma db seed

cd ../..
```

### 6. Run the Application

**Option 1: Run both apps together (from root)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd apps/backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd apps/frontend
npm start
```

### 7. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /products` - Get all products
- `GET /products/:id` - Get single product by ID

## Project Structure

```
fabric-marketplace/
├── apps/
│   ├── backend/          # Node.js Express API
│   │   ├── prisma/       # Database schema and seed
│   │   └── src/          # Source code
│   └── frontend/         # React application
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   └── App.tsx
├── package.json
└── turbo.json
```

## Troubleshooting

### Port already in use
If port 3000 or 5000 is in use:
- Backend: Change PORT in `.env`
- Frontend: Create `.env` in `apps/frontend` with `PORT=3001`

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

### Prisma errors
```bash
cd apps/backend
npx prisma generate
npx prisma migrate reset
```

## Future Enhancements

- User authentication
- Order placement
- Payment integration
- Admin panel
- Product reviews
- Wishlist functionality
