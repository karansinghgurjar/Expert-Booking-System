# Expert Booking System Backend

Node.js, Express, MongoDB, Mongoose, and Socket.io backend for the real-time expert session booking system.

## Setup

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expert_booking
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Scripts

```bash
npm run dev
npm start
npm run seed
```

The seed script deletes existing bookings, deletes existing experts, and inserts 10 sample experts with available slots.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /health | Check backend health |
| GET | /experts | List experts with pagination, search, and category filter |
| GET | /experts/:id | Get expert details with available slots |
| POST | /bookings | Create a booking |
| GET | /bookings?email= | Get bookings by email |
| PATCH | /bookings/:id/status | Update booking status |

## Create Booking Example

```json
{
  "expertId": "expert_id_here",
  "name": "Aman Verma",
  "email": "aman@example.com",
  "phone": "9876543210",
  "date": "2026-05-10",
  "time": "10:00 AM",
  "notes": "Need help with interview preparation."
}
```

## Double-Booking Protection

The booking flow first atomically marks the selected expert slot as booked only when that exact slot is still available. The `Booking` model also has a compound unique index on `expert + date + time`, which provides database-level protection against duplicate bookings.

## Real-Time Updates

Socket.io lets clients join expert-specific rooms with `joinExpertRoom`.

```js
socket.emit("joinExpertRoom", { expertId });
```

After a successful booking, the backend emits `slotBooked` to `expert:${expertId}`.

```js
{
  expertId,
  date,
  time,
  bookingId
}
```
