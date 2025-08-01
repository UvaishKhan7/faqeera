// This is the single source of truth for our backend URL.
// It will use your .env.local value in development, and a different value in production.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

/**
 * A centralized fetch function for all our API calls.
 * @param {string} path - The API path to fetch (e.g., '/products/slug/some-slug').
 * @param {object} options - Optional fetch options (method, headers, body, cache).
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the fetch fails or response is not ok.
 */
async function fetchAPI(path, options = {}) {
  // Set default headers. More headers can be added from the options.
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  const url = `${API_BASE_URL}/api${path}`;

  try {
    const res = await fetch(url, config);
    
    // Handle cases where the response might be empty (e.g., a successful DELETE request)
    if (res.status === 204) return { success: true };

    const data = await res.json();
    
    if (!res.ok) {
      // Use the server's error message if available, otherwise a default one.
      throw new Error(data.message || `API error on path: ${path} with status ${res.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`[FETCH_API_ERROR] Path: ${path}`, error);
    // Re-throw the error so the calling component can catch it and display a toast.
    throw error;
  }
}

// --- FOR PUBLIC-FACING PAGES (Homepage, Search) ---
export async function getPublicProducts({ keyword = '', category = '', sortBy = '' } = {}) {
  // This function is clean and simple. It receives safe string values.
  const params = new URLSearchParams({ keyword, category, sortBy });
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch public products');
    const data = await res.json();
    
    // Crucially, it returns the ENTIRE object from the backend
    return data; 
  } catch (error) {
    console.error('[GET_PUBLIC_PRODUCTS_ERROR]', error);
    // On error, return a consistent object shape.
    return { products: [], keyword: '', category: '' };
  }
}

// --- FOR ADMIN-FACING PAGES ---
export async function getAdminProducts(token) {
    const url = `${API_BASE_URL}/api/admin/products/all`;
    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch admin products');
        // Admin endpoint returns a raw array, so this is correct.
        return await res.json();
    } catch (error) {
        console.error('[GET_ADMIN_PRODUCTS_ERROR]', error);
        return [];
    }
}

// Fetches a single product by its slug (for public product detail pages)
export async function getProductBySlug(slug) {
  if (!slug) return null;
  return fetchAPI(`/products/slug/${slug}`, {
    next: { revalidate: 60 }
  });
}

// Fetches a single product by its ID (for the admin edit page)
export async function getProductById(id, token) { // Added token for consistency
  if (!id) return null;
  return fetchAPI(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }, // It's good practice to secure even GETs by ID
    cache: 'no-store'
  });
}