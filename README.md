# Gym Slot Booking System

A full-stack web application for booking gym slots with limited capacity (10 slots per time slot).

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** React
- **Database:** PostgreSQL
- **Authentication:** JWT

## 📋 Features

- ✅ User Registration & Login
- ✅ View Available Gym Slots (6 AM - 10 PM)
- ✅ Book Slots with Capacity Management
- ✅ View Personal Bookings
- ✅ Cancel Bookings
- ✅ Real-time Slot Availability Updates

## �️ NeonDB Setup (Serverless PostgreSQL)

1. **Sign up** at [neon.tech](https://console.neon.tech)
2. **Create project** with database `gym_booking`
3. **Copy connection string** from dashboard
4. **Paste in `.env`** as `DATABASE_URL`

Example connection string:

```
postgresql://user:password@ep-xyz.us-east-1.neon.tech/gym_booking?sslmode=require
```

5. Run migration → Database auto-configured! ✅

## �🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with NeonDB connection:

```bash
cp .env.example .env
```

4. Update `.env` with your NeonDB connection string:

```
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/gym_booking?sslmode=require
JWT_SECRET=your_secret_key
PORT=5000
```

> Get your `DATABASE_URL` from [NeonDB Dashboard](https://console.neon.tech) under "Connection String"

5. Run database migration:

```bash
npm run migrate
```

6. Optimize database with indexes (improves booking speed):

```bash
npm run optimize
```

7. Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm start
```

Frontend will open on `http://localhost:3000`

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Slots

- `GET /api/slots` - Get all available slots

### Bookings

- `POST /api/bookings` - Book a slot
- `GET /api/bookings` - Get user's bookings
- `DELETE /api/bookings/:bookingId` - Cancel a booking

## 🎯 Key Constraints

- Each slot has a capacity of 10 users
- Slots run from 6:00 AM to 10:00 PM (16 slots per day)
- Users cannot book the same slot twice
- Active bookings can be cancelled anytime

## 💾 Database Schema

### Users Table

- id, email, password, name, created_at

### Slots Table

- id, slot_time, capacity, booked_count, available_slots, created_at

### Bookings Table

- id, user_id, slot_id, status, booking_date

## 🔐 Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected routes with token verification
- CORS enabled for secure API access

## 📱 Usage

1. Register with email and password
2. Login with credentials
3. View available slots in the "Available Slots" tab
4. Click "Book Slot" to reserve a time
5. View your bookings in "My Bookings" tab
6. Cancel bookings if needed

## 🐛 Troubleshooting

**Backend Connection Error:**

- Ensure PostgreSQL is running
- Check `.env` database credentials
- Verify the database exists

**Frontend API Errors:**

- Make sure backend server is running on port 5000
- Check REACT_APP_API_URL in `.env`
- Clear browser cache and refresh

**Port Already in Use:**

- Backend: Change PORT in `.env`
- Frontend: Use `PORT=3001 npm start`

## 📄 License

MIT
