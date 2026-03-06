# Driver App - Location Tracker

A minimal driver app to test real-time location tracking with Action Cable.

## How to Use

1. **Open `index.html`** in your browser
2. **Enter your auth token** (same as admin dashboard)
3. **Click "Connect to Action Cable"**
4. **Send location updates** to see them on the admin dashboard

## Testing Flow

1. **Open this driver app** in one browser tab
2. **Open admin dashboard** (`http://localhost:3001/en/apps/logistics/fleet`) in another tab
3. **In driver app:** Connect and send location updates
4. **In admin dashboard:** Watch the map update in real-time!

## Features

- ✅ Simple HTML page (no build process)
- ✅ Action Cable connection
- ✅ Location updates via TaskChannel
- ✅ Random location generator
- ✅ Real-time logging
- ✅ Works with existing backend

## Files

- `index.html` - The complete driver app
- `package.json` - Dependencies (Action Cable)
- `README.md` - This file

## Backend Requirements

- Rails backend with TaskChannel
- WebSocket server running on `ws://localhost:3000/cable`
- Valid auth token for authentication
