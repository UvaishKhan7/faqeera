// This is the single source of truth for our backend URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * A centralized, robust fetch function for all our API calls.
 * This is the ONLY function that will construct URLs and use the `fetch` command.
 */
async function fetchAPI(path, options = {}) {
  
  if (!API_BASE_URL) {
    const errorMsg = "FATAL ERROR: NEXT_PUBLIC_API_BASE_URL is not configured.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const url = `${API_BASE_URL}/api${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };

  try {
    const res = await fetch(url, config);
    if (res.status === 204) return { success: true };
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API Error (${res.status})`);
    }
    return data;
  } catch (error) {
    console.error(`[fetchAPI Error] Path: '${path}' | Message: ${error.message}`);
    throw error;
  }
}

// === AUTHENTICATION ===
export const registerUser = (userData) => fetchAPI('/users/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});


// === PUBLIC CONTENT ===
export const getPublicProducts = ({ keyword = '', category = '', sortBy = '' } = {}) => {
  const params = new URLSearchParams({ keyword, category, sortBy });
  return fetchAPI(`/products?${params.toString()}`);
};

export const getProductBySlug = (slug) => fetchAPI(`/products/slug/${slug}`);
export const getActiveHeroSlides = () => fetchAPI('/content/hero-slides', { next: { revalidate: 300 } });


// === PROTECTED USER ROUTES ===
export const getMyOrders = (token) => fetchAPI('/orders/myorders', {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
});

export const getUserProfile = (token) => fetchAPI('/users/profile', {
  headers: { Authorization: `Bearer ${token}` },
});

export const updateUserProfile = ({ data, token }) => fetchAPI('/users/profile', {
  method: 'PUT',
  body: JSON.stringify(data),
  headers: { Authorization: `Bearer ${token}` },
});

export const getMyAddresses = (token) => fetchAPI('/users/addresses', {
  headers: { Authorization: `Bearer ${token}` },
});

export const addMyAddress = ({ address, token }) => fetchAPI('/users/addresses', {
  method: 'POST',
  body: JSON.stringify(address),
  headers: { Authorization: `Bearer ${token}` },
});

export const updateMyAddress = ({ addressId, address, token }) => fetchAPI(`/users/addresses/${addressId}`, {
  method: 'PUT',
  body: JSON.stringify(address),
  headers: { Authorization: `Bearer ${token}` },
});

export const toggleMyDefaultAddress = ({ addressId, token }) => fetchAPI(`/users/addresses/${addressId}/toggle-default`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
});

export const deleteMyAddress = ({ addressId, token }) => fetchAPI(`/users/addresses/${addressId}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});

// === PROTECTED ADMIN ROUTES ===
export const getAdminOrders = (token) => fetchAPI('/admin/orders', {
  headers: { Authorization: `Bearer ${token}` },
});

export const updateOrderItemStatus = ({ orderId, itemId, status, trackingNumber, token }) => fetchAPI(`/admin/orders/${orderId}/items/${itemId}`, {
  method: 'PUT',
  body: JSON.stringify({ status, trackingNumber }),
  headers: { Authorization: `Bearer ${token}` },
});

export const getAdminProducts = (token) => fetchAPI('/admin/products/all', {
  headers: { Authorization: `Bearer ${token}` },
});

export const getAdminProductById = (id, token) => fetchAPI(`/products/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

export const createAdminProduct = ({ productData, token }) => fetchAPI('/admin/products', {
  method: 'POST',
  body: JSON.stringify(productData),
  headers: { Authorization: `Bearer ${token}` },
});

export const updateAdminProduct = ({ productId, productData, token }) => fetchAPI(`/admin/products/${productId}`, {
  method: 'PUT',
  body: JSON.stringify(productData),
  headers: { Authorization: `Bearer ${token}` },
});

export const deleteAdminProduct = ({ productId, token }) => fetchAPI(`/admin/products/${productId}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});


// === PROTECTED USER WISHLIST ROUTES ===

// Fetches all products in the user's wishlist
export const getMyWishlist = (token) => fetchAPI('/wishlist', {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
});

// Toggles (adds or removes) a product from the wishlist
export const toggleMyWishlist = ({ productId, token }) => fetchAPI('/wishlist', {
  method: 'POST',
  body: JSON.stringify({ productId }),
  headers: { Authorization: `Bearer ${token}` },
});