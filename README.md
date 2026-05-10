# Real-Time Expert Session Booking System

A full-stack expert session booking system built with React, Node.js, Express, MongoDB, Mongoose, and Socket.io. Users can browse experts, filter and search listings, book available slots, and see real-time slot updates when another user books the same expert.

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Socket.io Client
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io

## Features

- Expert listing with search, category filter, and pagination
- Expert detail page with slots grouped by date
- Real-time slot updates using Socket.io rooms
- Booking form with frontend and backend validation
- Double-booking prevention with atomic updates and a unique MongoDB index
- My Bookings search by email
- Booking status display for Pending, Confirmed, and Completed bookings
- Health check endpoint
- Centralized backend error handling

## How to Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

On Windows PowerShell, use this instead of `cp`:

```powershell
Copy-Item .env.example .env
```

## Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Package Scripts

### Backend

- `npm run dev` starts the backend with nodemon
- `npm run start` starts the backend with Node
- `npm run seed` resets experts and bookings, then inserts sample expert data

### Frontend

- `npm run dev` starts the Vite development server
- `npm run build` builds the frontend for production

## API Routes

### Health

| Method | Route | Description |
| --- | --- | --- |
| GET | `/health` | Check backend status |

### Experts

| Method | Route | Description |
| --- | --- | --- |
| GET | `/experts` | Get experts with pagination, search, and category filter |
| GET | `/experts/:id` | Get expert details and available slots |

### Bookings

| Method | Route | Description |
| --- | --- | --- |
| POST | `/bookings` | Create a booking |
| GET | `/bookings?email=` | Get bookings by email |
| PATCH | `/bookings/:id/status` | Update booking status |

## Socket.io Events

### Client Emits

```js
socket.emit("joinExpertRoom", { expertId });
```

The expert detail page joins an expert-specific room:

```text
expert:${expertId}
```

### Server Emits

```js
io.to(`expert:${expertId}`).emit("slotBooked", {
  expertId,
  date,
  time,
  bookingId,
});
```

The frontend listens for `slotBooked` and marks the matching slot as booked without refreshing the page.

## Critical Logic

The backend prevents double booking with two layers:

1. An atomic MongoDB `findOneAndUpdate` marks a slot as booked only when `availableSlots.isBooked` is still `false`.
2. The `Booking` model has a compound unique index on `expert + date + time`.

```js
bookingSchema.index(
  { expert: 1, date: 1, time: 1 },
  { unique: true }
);
```

If two users try to book the same slot at the same time, only one request succeeds. The duplicate request receives:

```json
{
  "success": false,
  "message": "This slot is already booked. Please choose another slot."
}
```

The `slotBooked` Socket.io event is emitted only after the atomic slot update and booking creation both succeed.

## Folder Structure

```text
expert-booking-system/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      app.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      api/
      components/
      pages/
      socket/
      styles/
      App.jsx
      main.jsx
    .env.example
    package.json
  README.md
```

## Testing Checklist

### Backend

- `npm run seed` works
- `npm run dev` works
- `GET /health` returns backend status
- `GET /experts` returns experts and pagination metadata
- `GET /experts/:id` returns expert detail with slots
- `POST /bookings` creates a booking
- Duplicate booking returns `409 Conflict`
- `GET /bookings?email=` returns matching bookings
- `PATCH /bookings/:id/status` updates booking status

### Frontend

- Homepage experts load
- Search by name works
- Category filter works
- Pagination works
- Expert detail page shows grouped slots
- Available slots open the booking page
- Booked slots are disabled
- Booking validation works
- Successful booking shows status
- My Bookings search by email works
- Empty, loading, and error states display correctly
- Real-time slot update works across two tabs

## Demo Flow

The demo video should show:

1. View expert listing
2. Search for an expert
3. Filter by category
4. Use pagination
5. Open an expert detail page
6. Open the same expert detail page in a second tab
7. Book a slot
8. Show the slot update in real time in the other tab
9. Try duplicate booking and show the friendly error
10. Open My Bookings
11. Search using the booking email
12. Show the booking status

## Demo Video

Add your demo video link here.

## GitHub Repository

https://github.com/karansinghgurjar/Expert-Booking-System

## Deployment

- Frontend: https://expert-booking-system-flax.vercel.app
- Backend: https://expert-booking-system-crf3.onrender.com
- Backend health check: https://expert-booking-system-crf3.onrender.com/health
- Experts API: https://expert-booking-system-crf3.onrender.com/experts

## Final Submission Format

```text
GitHub Repository:
https://github.com/karansinghgurjar/Expert-Booking-System

Demo Video:
YOUR_VIDEO_LINK

Deployment:
https://expert-booking-system-flax.vercel.app

Backend:
https://expert-booking-system-crf3.onrender.com
```
