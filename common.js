const DRIVER_APP_STORAGE_KEYS = {
  authToken: 'driverApp.authToken',
  currentDriver: 'driverApp.currentDriver'
};

function getEnvironmentConfig() {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin || '';
    const isLocal = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');

    if (isLocal) {
      return {
        apiBaseUrl: 'http://localhost:3000/api/v1',
        wsBaseUrl: 'ws://localhost:3000/cable'
      };
    }

    return {
      apiBaseUrl: 'https://on2door-api.onrender.com/api/v1',
      wsBaseUrl: 'wss://on2door-api.onrender.com/cable'
    };
  }

  // Fallback for non-browser contexts
  return {
    apiBaseUrl: 'https://on2door-api.onrender.com/api/v1',
    wsBaseUrl: 'wss://on2door-api.onrender.com/cable'
  };
}

function readJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (_error) {
    return null;
  }
}

function getDriverSession() {
  return {
    token: localStorage.getItem(DRIVER_APP_STORAGE_KEYS.authToken),
    driver: readJson(DRIVER_APP_STORAGE_KEYS.currentDriver)
  };
}

function setDriverSession(driver, token) {
  localStorage.setItem(DRIVER_APP_STORAGE_KEYS.authToken, token);
  localStorage.setItem(DRIVER_APP_STORAGE_KEYS.currentDriver, JSON.stringify(driver));
}

function clearDriverSession() {
  localStorage.removeItem(DRIVER_APP_STORAGE_KEYS.authToken);
  localStorage.removeItem(DRIVER_APP_STORAGE_KEYS.currentDriver);
}

function getApiBaseUrl() {
  return getEnvironmentConfig().apiBaseUrl.replace(/\/$/, '');
}

function getWsBaseUrl() {
  return getEnvironmentConfig().wsBaseUrl.replace(/\/$/, '');
}

function normalizeDriverPayload(payload) {
  const record = payload?.driver?.data;

  if (!record) return null;

  return {
    id: Number(record.id),
    ...record.attributes
  };
}

function normalizeTasksPayload(payload) {
  const records = payload?.tasks?.data || [];

  return records.map(record => ({
    id: Number(record.id),
    ...record.attributes
  }));
}

function driverDisplayName(driver) {
  if (!driver) return 'Driver';

  const name = `${driver.first_name || ''} ${driver.last_name || ''}`.trim();
  return name || driver.email || 'Driver';
}

async function driverApiFetch(path, options = {}) {
  const session = getDriverSession();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      body?.error ||
      body?.message ||
      body?.status?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return body;
}
