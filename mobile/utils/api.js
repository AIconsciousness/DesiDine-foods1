const BASE_URL = 'http://10.36.44.177:5000/api'; // Change to your backend URL if needed

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