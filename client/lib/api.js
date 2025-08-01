// This is the single source of truth for our backend URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// This console.log is a crucial debugging tool.
// It will appear in your BROWSER console.
console.log("API Library Initialized. Using Base URL:", API_BASE_URL);

/**
 * A centralized, robust fetch function for all our API calls.
 * @param {string} path - The API path to fetch (e.g., '/users/login').
 * @param {object} options - Optional fetch options (method, headers, body, cache).
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws {Error} - Throws an error with the server's message if the fetch fails.
 */
async function fetchAPI(path, options = {}) {
  // If the API_BASE_URL is not set, we must fail immediately.
  if (!API_BASE_URL) {
    const errorMessage = "FATAL: NEXT_PUBLIC_API_BASE_URL is not defined. Check client/.env.local";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const url = `${API_BASE_URL}/api${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  try {
    const res = await fetch(url, config);
    
    // Handle successful but empty responses (e.g., DELETE).
    if (res.status === 204) return { success: true };

    const data = await res.json();
    
    if (!res.ok) {
      // Use the specific error message from the backend if available.
      throw new Error(data.message || `API request to ${path} failed with status ${res.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`[FETCH_API_ERROR] Path: ${path}`, error.message);
    throw error; // Re-throw the error so the calling component's catch block can handle it.
  }
}

// --- AUTHENTICATION FUNCTIONS (Previously Missing) ---
export const loginUser = (credentials) => fetchAPI('/users/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const registerUser = (userData) => fetchAPI('/users/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});


// --- PUBLIC-FACING PRODUCT FUNCTIONS ---
export const getPublicProducts = (searchParams = {}) => {
  const params = new URLSearchParams(searchParams);
  return fetchAPI(`/products?${params.toString()}`);
};

export const getProductBySlug = (slug) => fetchAPI(`/products/slug/${slug}`);


// --- ADMIN & PROTECTED USER FUNCTIONS ---
export const getAdminProducts = (token) => fetchAPI('/admin/products/all', {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
});

export const getMyOrders = (token) => fetchAPI('/orders/myorders', {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
});

// Note: getProductById is used by the admin edit page, so it should be protected.
export const getProductById = (id, token) => fetchAPI(`/products/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
});