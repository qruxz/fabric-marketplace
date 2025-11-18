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
