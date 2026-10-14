# Workout Tracker

A web app for tracking workouts on a calendar. Record how many reps you complete for each exercise and review your progress throughout the month.

## Features

- Monthly calendar with navigation between months
- Daily rep tracking for push-ups, pull-ups, abs, and squats
- Monthly totals for each exercise
- Workout intensity indicators on calendar days
- Dark and light themes
- Data saved locally in the browser using `localStorage`

## Tech stack

- React 18
- Vite
- CSS

## Run locally

You need Node.js and npm installed.

```bash
npm install
npm run dev
```

Open the address printed by Vite in your terminal (usually `http://localhost:5173`).

## Data storage

Workout data is stored in `localStorage` under the `workoutData` key, and the selected theme is stored under `wc-theme`. The data remains available in the browser and on the device where it was entered, including after reloading the page. It is not synced to a server. Clearing the site's browser data will remove it.

## Production build

```bash
npm run build
npm run preview
```
