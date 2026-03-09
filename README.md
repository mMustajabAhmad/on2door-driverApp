# Driver App - Location Tracker

This driver app now has a separate login page and a separate main app page.

## Pages

- `login.html` - driver email/password login page
- `index.html` - main driver app after login
- `common.js` - shared auth/config helpers
- `styles.css` - shared styling

## Auth Flow

1. Open `login.html`
2. Enter driver email and password
3. The page calls `POST /api/v1/driver/login`
4. Rails returns the driver JSON plus `auth_token`
5. The token is stored in browser local storage
6. `index.html` reads that saved token
7. API requests send `Authorization: Bearer <token>`
8. Action Cable connects using `/cable?auth_token=<token>`

## Environment Config

The login page no longer shows editable environment fields.

Instead, set these in `driver-app/.env`:

```sh
DRIVER_APP_API_BASE_URL=http://localhost:3000/api/v1
DRIVER_APP_WS_BASE_URL=ws://localhost:3000/cable
PORT=4173
```

`start.sh` reads `.env` and generates `runtime-config.js` for the browser at startup.

## Driver App Flow

1. Log in on `login.html`
2. You are redirected to `index.html`
3. The app loads tasks for the logged-in driver from `GET /api/v1/drivers/tasks`
4. Pick a task
5. Connect to Action Cable
6. Subscribe to the task channel
7. Send location updates

## Run

```sh
cd /Users/aymen/Desktop/ON2DOOR/driver-app
chmod +x start.sh
./start.sh
```

That opens:

```sh
http://localhost:4173/login.html
```

## Defaults

- API Base URL comes from `driver-app/.env`
- WebSocket URL comes from `driver-app/.env`

## Backend Requirements

- Rails API running on `http://localhost:3000`
- Driver account with valid email/password
- Task assigned to that driver
- Task should be `active` for `update_location` to be accepted by `TaskChannel`
