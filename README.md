# GigFlow Frontend

React app for browsing jobs, posting gigs, and submitting bids.

## Tech Stack

React 18 • Vite • Redux • Tailwind CSS • React Router • Axios

## Setup

```bash
cd gigflow-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Backend must run on port 5000.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Pages

| Route       | Purpose                            |
| ----------- | ---------------------------------- |
| `/`         | Browse & search jobs               |
| `/gig/:id`  | View job details, submit/view bids |
| `/post-gig` | Create new job (protected)         |
| `/login`    | User login                         |
| `/register` | Create account                     |

## Project Structure

```
src/
├── pages/
│   ├── BrowseGigs.jsx       Browse & search
│   ├── GigDetails.jsx       Details, bids, hiring
│   ├── PostGig.jsx          Create job
│   ├── Login.jsx            Login page
│   └── Register.jsx         Register page
├── components/
│   ├── Navbar.jsx           Navigation
│   └── ProtectedRoute.jsx   Route protection
├── store/
│   ├── authSlice.js         Auth state
│   ├── gigsSlice.js         Jobs state
│   └── bidsSlice.js         Bids state
├── services/
│   └── api.js               API client
└── App.jsx                  Main app
```

## Features

- Register & login
- Browse jobs with search
- View job details
- Post new jobs (auth required)
- Submit bids
- View bids (job owner)
- Hire freelancers (job owner)
- Protected routes
- Responsive design

## State Management

Redux Toolkit with 3 slices:

- **Auth** - Login/user state
- **Gigs** - Jobs management
- **Bids** - Bidding operations

## API Integration

Backend URL: `http://localhost:5000`

Configure in [vite.config.js](vite.config.js)

## Deployment

```bash
npm run build   # Creates dist/ folder
```

Deploy `dist/` to:

- Vercel
- Netlify
- AWS S3
- Azure Static Web Apps
- Any static host

## Notes

- Backend must be running
- Check browser console for errors
- Login required to post gigs
- Only job owner can see bids
