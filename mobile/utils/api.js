const BASE_URL = 'https://desidine-foods1.onrender.com/api'; // Updated to Render backend URL

export async function apiRequest(path, method = 'GET', body, token) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error('Invalid JSON: ' + text);
    }
  } catch (err) {
    throw err;
  }
} 